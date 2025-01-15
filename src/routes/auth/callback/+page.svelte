<script lang="ts">
	import { goto } from '$app/navigation';
	import Introduction from '$lib/components/Introduction.svelte';
	import type { SessionStore } from '@mijoco/stx_helpers/dist/index';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const token = urlParams.get('token');
			if (token) {
				// sessionStore.update((conf: SessionStore) => {
				// 	conf.jwtToken = token;
				// 	return conf;
				// });
				goto('/');
			} else {
				console.error('No token found in URL');
				goto('/');
			}
		}
	});
</script>

<svelte:head>
	<title>sui polymarket</title>
	<meta name="description" content="polymarket on sui" />
</svelte:head>

<div class="mx-auto w-full max-w-7xl py-4 md:px-6">
	<div class="my-2 flex w-full flex-col items-center">
		<Introduction />
	</div>
</div>
