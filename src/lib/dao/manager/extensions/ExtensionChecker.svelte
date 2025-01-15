<script lang="ts">
	import { isExtension } from '$lib/dao/dao_manager_helper';
	import { onMount } from 'svelte';

	export let extension: string | undefined;
	let result: { result: boolean };
	let checked = false;
	const checkExtension = async () => {
		if (!extension) return;
		result = await isExtension(extension);
		checked = true;
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

<div class="flex flex-col gap-y-1">
	<div class="flex w-full justify-start">
		<input
			class="w-full rounded-lg border-gray-800 p-2 text-black"
			bind:value={extension}
			type="text"
			id="Contribution"
			aria-describedby="Contribution"
		/>
	</div>
	<div>
		<button
			on:click={() => {
				checkExtension();
			}}
			class="bg-success-01 shrink-0 items-center gap-x-1.5 rounded-xl border border-success-600 px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex md:w-auto"
		>
			Check extension
		</button>
	</div>
	<div class="text-xs">
		{#if checked}{extension} is a {result.result} extension{/if}
	</div>
</div>
