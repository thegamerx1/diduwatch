<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/env';
	import { base } from '$app/paths';

	import { JWT, UserData } from '$lib/login_store';
	import { getUserData, GraphError, getUserAnime } from '$lib/api';
	import jwt_decode from 'jwt-decode';

	let token: string;
	let userid: number;
	let error: any;

	type Decoded = {
		sub: string;
	};

	if (browser) {
		let params = new URLSearchParams($page.url.hash.substring(1));
		token = params.get('access_token') ?? '';
		let decoded = jwt_decode(token) as Decoded;
		userid = Number(decoded.sub);
		if (userid !== NaN) {
			gotToken();
		} else {
			goto(`${base}/`);
		}
	}

	async function gotToken() {
		try {
			let user = await getUserData(token, userid);
			let userAnime = await getUserAnime(token, user.id);
			$UserData.user = user;
			$UserData.list = userAnime;
			$UserData.favourites = userAnime.filter((a) => a.isFav).map((a) => a.id);
			success();
		} catch (e) {
			error = e;
		}
	}

	function success() {
		$JWT.token = token;
		$JWT.userid = userid;
		$JWT.valid = true;
		goto(`${base}/dash`);
	}
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="container">
			{#if !error}
				<button class="btn btn-primary loading">Loading</button>
			{:else}
				{#if error instanceof GraphError}
					{#each error.errors as error}
						<div class="alert alert-warning">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/></svg
							>
							{error}
						</div>
					{/each}
				{:else}
					{error}
				{/if}
				{#if error instanceof Error}
					<div class="mockup-code">
						<pre><code>{error.stack}</code></pre>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
