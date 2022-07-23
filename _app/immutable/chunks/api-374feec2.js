class u extends Error{constructor(t){super("Query failed"),this.errors=t.errors.map(d=>d.message),this.original=t}}async function p(i,t){let o=await c(i,`
	query ($id: Int!) {
		User(id: $id) {
			id
			name
			avatar {
				medium
			}
		}
	}
	`,{id:t});return{id:o.data.User.id,name:o.data.User.name,avatar:o.data.User.avatar.medium}}async function g(i,t){let o=await c(i,`
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
	}`,{user:t}),l=o.data.User.favourites.anime.nodes.map(n=>n.id);return o.data.MediaListCollection.lists.flatMap(n=>n.entries.map(e=>({isFav:l.includes(e.mediaId),id:e.mediaId,status:e.status,completed:e.completedAt.year?new Date(e.completedAt.year,e.completedAt.month-1,e.completedAt.day):null})))}async function*m(i,t){const o=`
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
	 }`,l=a=>a.Page.media.map(r=>({id:r.id,title:r.title.userPreferred,status:r.status,start:new Date(r.startDate.year,r.startDate.month-1,r.startDate.day),averageScore:r.averageScore,episodes:r.episodes,cover:r.coverImage.large,banner:r.bannerImage,relations:r.relations.edges.map(s=>({id:s.node.id,title:s.node.title.userPreferred,status:s.node.status,start:new Date(s.node.startDate.year,s.node.startDate.month-1,s.node.startDate.day),averageScore:s.node.averageScore,episodes:s.node.episodes,cover:s.node.coverImage.large,banner:s.node.bannerImage,relationType:s.relationType}))}));let n=!0,e=1;for(;n;){let a=await c(i,o,{page:e,ids:t});console.log(`Page ${e} ${t.length}`),n=a.data.Page.pageInfo.hasNextPage,e++,yield{animes:l(a.data),progress:e/Math.ceil(t.length/50)*100}}}async function c(i,t,d={}){var e;const o="https://graphql.anilist.co",l={method:"POST",headers:{Authorization:"Bearer "+i,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({variables:d,query:t})};let n=await fetch(o,l);if(n.ok){let a=await n.json();if(((e=a==null?void 0:a.errors)==null?void 0:e.length)>0)throw new u(a);return a}else{let a=await n.json();throw console.log(a.errors),new u(a)}}export{u as G,g as a,m as b,p as g};
