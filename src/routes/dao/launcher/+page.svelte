<script lang="ts">
	import { onMount } from 'svelte';
	import LaunchTemplate from '$lib/dao/launcher/LaunchTemplate.svelte';
	import { isLoggedIn, loginStacksFromHeader } from '$lib/stacks/stacks-connect';

	const login = async () => {
		loginStacksFromHeader(document);
	};
	onMount(async () => {});
</script>

<svelte:head>
	<title>Bitcoin DAO</title>
	<meta
		name="description"
		content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin"
	/>
</svelte:head>

<div class="mx-auto w-full max-w-7xl py-4 md:px-6">
	<div class="my-2 flex w-full flex-col items-center">
		<h2>Dao Launcher</h2>
		<p>Launch your project today</p>

		{#if isLoggedIn()}
			<LaunchTemplate />
		{:else}
			<div class="my-5 flex w-full flex-col items-center">
				<button
					on:click={() => {
						login();
					}}
					class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-bitcoinorange bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
				>
					Connect Wallet to Continue
				</button>
			</div>
		{/if}
	</div>
</div>
