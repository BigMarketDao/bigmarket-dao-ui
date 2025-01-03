<script lang="ts">
	import { onMount } from 'svelte';
	import ProposalGridItem from './ProposalGridItem.svelte';
	import { fetchExecutedProposals, fetchProposedProposals } from '$lib/dao/proposals';

	let proposalsExecuted: Array<any> = [];
	let proposalsProposed: Array<any> = [];

	onMount(async () => {
		proposalsExecuted = await fetchExecutedProposals();
		proposalsProposed = await fetchProposedProposals();
	});
</script>

<div class="rounded-md bg-sand-700 p-5 py-6">
	<h1 class=" text-2xl">DAO Proposals</h1>

	<div class="my-10">
		<h2>Proposals</h2>
		{#each proposalsProposed as proposal}
			<div class="grid w-full grid-cols-6 justify-stretch">
				<ProposalGridItem {proposal} />
			</div>
		{/each}
	</div>
	<div class="mb-10">
		<h2>Executed Proposals</h2>
		{#each proposalsExecuted as proposal}
			<div class="grid w-full grid-cols-6 justify-stretch">
				<ProposalGridItem {proposal} />
			</div>
		{/each}
	</div>
</div>
