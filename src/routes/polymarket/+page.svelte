<script lang="ts">
	import { goto } from '$app/navigation';
	import Introduction from '$lib/components/Introduction.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {});
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
