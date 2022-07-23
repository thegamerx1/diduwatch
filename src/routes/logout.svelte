<script lang="ts">
	import { UserData, JWT } from '$lib/login_store';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	if (browser) {
		$JWT = { token: '', userid: 0, valid: false };
		$UserData = { list: [], favourites: [], user: undefined };
		goto(`${base}/`);
	}
</script>
