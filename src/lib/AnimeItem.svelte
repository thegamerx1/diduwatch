<script lang="ts">
	import { UserData } from '$lib/login_store';

	// export let cover = '',
	// 	banner = '',
	// 	title = '',
	// 	episodes = 99,
	// 	averageScore = 99,
	// 	start: Date | undefined,
	// 	isSub = false,
	// 	id: number;

	export let anime: Anime, rels: Anime[];

	let user = $UserData.list.find((x) => x.id === anime.id);

	const anilist = (id: number) => `https://anilist.co/anime/${id}`;
</script>

{#each rels as anime}
	<a
		href={anilist(anime.id)}
		target="_blank"
		class="animation border-violet-400 border-opacity-60  border-2 flex flex-row m-1 shadow-xl w-full md:w-[452px] transition-all hover:cursor-pointer hover:shadow-2xl hover:scale-105"
	>
		<img src={anime.cover} class="h-32 w-24 object-cover" width="auto" alt="Anime cover" />
		<div class="p-3 text-sm overflow-hidden">
			<p class="text-lg truncate block">{anime.title}</p>
			<div class="grid px-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-activity"
					><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg
				>
				<p class="capitalize">{anime.status.toLocaleLowerCase()}</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3" /></svg
				>
				<p>{anime.episodes ?? 0} Episodes</p>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-package"
					><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path
						d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
					/><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line
						x1="12"
						y1="22.08"
						x2="12"
						y2="12"
					/></svg
				>
				<p class="mt-auto">
					Released on {anime.start
						? anime.start.toLocaleString('defaul', { month: 'long', year: 'numeric' })
						: 'Unknown'}
				</p>
			</div>
		</div>
	</a>
{/each}

<style>
	.animation:hover {
	}

	.grid {
		display: grid;
		grid-template-columns: 18px 1fr;
		grid-template-rows: 18px;
		grid-gap: 0.2rem;
	}
	svg {
		width: 18px;
		height: 18px;
	}
</style>
