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

<div class="flex flex-col gap-y-5">
	<h1 class=" text-2xl">Open Proposals</h1>

	<div class="">
		{#each proposalsProposed as proposal}
			<div class="grid w-full grid-cols-6 justify-stretch">
				<ProposalGridItem {proposal} admin={false} />
			</div>
		{/each}
	</div>
	<div class="">
		{#each proposalsExecuted as proposal}
			<div class="grid w-full grid-cols-6 justify-stretch">
				<ProposalGridItem {proposal} admin={false} />
			</div>
		{/each}
	</div>
</div>
