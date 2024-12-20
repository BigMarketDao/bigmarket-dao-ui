<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(async () => {
		goto('/polymarket');
	});
</script>

<svelte:head>
	<title>Z-KYC ME</title>
	<meta name="description" content="Prove who you are without handing over the keys" />
</svelte:head>

<div class="w-full py-4 mx-auto max-w-7xl md:px-6">
	<div class="flex flex-col w-full my-8"></div>
</div>
