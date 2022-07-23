<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { tweened } from 'svelte/motion';

	import { JWT, UserData } from '$lib/login_store';
	import { getAnimeData } from '$lib/api';

	import Collapser from '$lib/Collapser.svelte';
	import AnimeItem from '$lib/AnimeItem.svelte';
	let animeStorage: Anime[] = [];
	let toWatch: { anime: Anime; rels: Anime[] }[] = [];

	const FILTER_WATCH: MediaListStatus[] = ['COMPLETED', 'CURRENT', 'REPEATING'];
	const FILTER_VALID: MediaListStatus[] = ['COMPLETED', 'REPEATING'];
	const FILTER_LIVE: Status[] = ['FINISHED', 'RELEASING'];

	let barprogress = tweened(0);

	if (browser) {
		if (!$JWT.valid) {
			goto('/login');
		}
		getData();
	}

	async function getData() {
		let ids = $UserData.list
			.filter((x) => {
				return FILTER_VALID.includes(x.status);
			})
			.map((x) => x.id);

		let animes = getAnimeData($JWT.token, ids);
		for await (let { animes: anime, progress } of animes) {
			$barprogress = progress;
			animeStorage = [...animeStorage, ...anime];
			for (let anim of anime) {
				let user = $UserData.list.find((x) => x.id === anim.id);
				// for every anime watched
				if (user && FILTER_WATCH.includes(user.status)) {
					// if its a sequel and it is not watched
					let rels = anim.relations.filter(
						(x) =>
							x.relationType === 'SEQUEL' &&
							FILTER_LIVE.includes(x.status) &&
							$UserData.list.find((y) => y.id === x.id && !FILTER_WATCH.includes(y.status))
					);
					// add it to the list
					if (rels.length > 0) {
						toWatch = [...toWatch, { anime: anim, rels }];
					}
				}
			}
		}
		$barprogress = 100;
	}
</script>

<div class="w-full h-1">
	<div class="bg-accent h-full" style="width: {$barprogress}%" />
</div>
<div class="flex-1 bg-base-200">
	<div
		class="scrolly gap-2 justify-center items-start flex flex-wrap snap-y overflow-y-scroll p-3 mx-auto w-full"
	>
		{#each toWatch as { anime, rels }}
			<AnimeItem {anime} {rels} />
		{/each}
	</div>
</div>
<footer class="footer items-center p-4 bg-neutral text-neutral-content">
	<div class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
		<a href="https://github.com/thegamerx1/diduwatch">
			<svg
				width="24"
				height="24"
				viewBox="0 0 1024 1024"
				class="fill-current"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
					transform="scale(64)"
				/>
			</svg>
		</a>
	</div>
</footer>

<style>
	.scrolly {
		scrollbar-color: red white;
		scrollbar-width: thin;
	}
	.scrolly::-webkit-scrollbar {
		height: 2px;
		border-radius: 5px;
	}
	.scrolly::-webkit-scrollbar-track {
		background-color: var(--n);
	}
	.scrolly::-webkit-scrollbar-thumb {
		background-color: var(--p);
		border-radius: 5px;
	}
</style>
