<script lang="ts">
	import { goto } from '$app/navigation';
	import Introduction from '$lib/components/Introduction.svelte';
	import { onMount } from 'svelte';

	onMount(async () => {
		//goto('/polymarket');
	});
</script>

<svelte:head>
	<title>Z-KYC ME</title>
	<meta name="description" content="Prove who you are without handing over the keys" />
</svelte:head>

<div class="w-full py-4">
	<div class="my-2 flex w-full flex-col">
		<Introduction />
	</div>
</div>
