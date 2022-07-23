<script lang="ts" context="module">
	import { login_url } from '$lib/login_store';
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async () => {
		return {
			status: 307,
			redirect: login_url
		};
	};
</script>
