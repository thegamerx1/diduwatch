<script lang="ts">
	// import collapse from 'svelte-collapse';
	export let open = true;
</script>

<div class="rounded-md flex flex-col">
	<div on:click={() => (open = !open)} class="flex align-middle p-3 top-0 z-10" class:sticky={open}>
		<slot name="title">
			<p class="italic">Default title</p>
		</slot>
		<div class="ml-auto">
			{#if open}
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
					><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg
				>
			{:else}
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
					><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg
				>
			{/if}
		</div>
	</div>
	<!-- <div use:collapse={{ open }} class="bg-neutral"> -->
	<div class="p-3">
		<slot />
	</div>
	<!-- </div> -->
</div>
