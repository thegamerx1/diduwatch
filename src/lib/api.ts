export class GraphError extends Error {
	errors: string[];
	original: any;
	constructor(data: { errors: { message: string }[] }) {
		super('Query failed');
		this.errors = data.errors.map((err: any) => err.message);
		this.original = data;
	}
}

export async function getUserData(token: string, userid: number) {
	const query = `
	query ($id: Int!) {
		User(id: $id) {
			id
			name
			avatar {
				medium
			}
		}
	}
	`;

	let req = await makeQuery(token, query, {
		id: userid
	});
	return {
		id: req.data.User.id as number,
		name: req.data.User.name as string,
		avatar: req.data.User.avatar.medium as string
	};
}

export async function getUserAnime(token: string, userid: number) {
	const query = `
	query ($user: Int!) {
		User(id: $user) {
			favourites {
				anime {
					nodes {
						id
					}
				}
			}
		}
		MediaListCollection(userId: $user, type: ANIME) {
			lists {
				entries {
					mediaId
					status
					completedAt {
						year
						month
						day
					}
				}
			}
		}
	}`;
	let req = await makeQuery(token, query, {
		user: userid
	});
	let favs = (req.data.User.favourites.anime.nodes as { id: number }[]).map((node) => node.id);

	interface Entry {
		isFav: boolean;
		mediaId: number;
		status: MediaListStatus;
		completedAt:
			| {
					year: number;
					month: number;
					day: number;
			  }
			| {
					year: null;
					month: null;
					day: null;
			  };
	}

	return (req.data.MediaListCollection.lists as { entries: Entry[] }[]).flatMap((list) =>
		list.entries.map(
			(entry) =>
				({
					isFav: favs.includes(entry.mediaId),
					id: entry.mediaId,
					status: entry.status,
					completed: entry.completedAt.year
						? new Date(entry.completedAt.year, entry.completedAt.month - 1, entry.completedAt.day)
						: null
				} as AnimeEntry)
		)
	);
}

export async function* getAnimeData(token: string, animes: number[]) {
	const MAX_QUERY = 50;
	const query = `
	query ($page: Int!, $ids: [Int!]) {
		Page(page: $page, perPage: 50) {
		  pageInfo {
			 hasNextPage
		  }
		  media(id_in: $ids, type: ANIME) {
			 id
			 title {
				userPreferred
			 }
			 coverImage {
				large
			 }
			 bannerImage
			 episodes
			 status
			 averageScore
			 startDate {
				year
				month
				day
			 }
			 relations {
				edges {
				  node {
					 id
					 title {
						userPreferred
					 }
					 coverImage {
						large
					 }
					 bannerImage
					 episodes
					 status
					 averageScore
					 startDate {
						year
						month
						day
					 }
				  }
				  relationType
				}
			 }
		  }
		}
	 }`;

	interface Entry {
		id: number;
		title: {
			userPreferred: string;
		};
		coverImage: {
			large: string;
		};
		bannerImage: string;
		episodes: number;
		status: Status;
		averageScore: number;
		startDate: {
			year: number;
			month: number;
			day: number;
		};
	}

	const parse = (data: {
		Page: {
			media: Array<Entry & { relations: { edges: { node: Entry; relationType: Relation }[] } }>;
		};
	}): AnimeR[] => {
		return data.Page.media.map((media) => ({
			id: media.id,
			title: media.title.userPreferred,
			status: media.status,
			start: new Date(media.startDate.year, media.startDate.month - 1, media.startDate.day),
			averageScore: media.averageScore,
			episodes: media.episodes,
			cover: media.coverImage.large,
			banner: media.bannerImage,
			relations: media.relations.edges.map((edge) => ({
				id: edge.node.id,
				title: edge.node.title.userPreferred,
				status: edge.node.status,
				start: new Date(
					edge.node.startDate.year,
					edge.node.startDate.month - 1,
					edge.node.startDate.day
				),
				averageScore: edge.node.averageScore,
				episodes: edge.node.episodes,
				cover: edge.node.coverImage.large,
				banner: edge.node.bannerImage,
				relationType: edge.relationType
			}))
		}));
	};
	let hasNextPage = true;
	let page = 1;
	while (hasNextPage) {
		let req = await makeQuery(token, query, {
			page: page,
			ids: animes
		});
		console.log(`Page ${page} ${animes.length}`);
		hasNextPage = req.data.Page.pageInfo.hasNextPage as boolean;
		page++;
		yield {
			animes: parse(req.data),
			progress: (page / Math.ceil(animes.length / MAX_QUERY)) * 100
		};
	}
}

async function makeQuery(token: string, query: string, variables: any = {}) {
	const url = 'https://graphql.anilist.co',
		options = {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				variables,
				query
			})
		};

	let req = await fetch(url, options);
	if (req.ok) {
		let json = await req.json();
		if (json?.errors?.length > 0) {
			throw new GraphError(json);
		}
		return json;
	} else {
		let json = await req.json();
		console.log(json.errors);
		throw new GraphError(json);
	}
}
