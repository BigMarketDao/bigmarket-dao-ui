<script lang="ts">
	import { onMount } from 'svelte';
	import ProposalGridItem from './ProposalGridItem.svelte';
	import { fetchExecutedProposalsByDao, fetchProposedProposalsByDao } from '$lib/dao/proposals';

	export let contractId: string;
	export let status: string;
	let proposals: Array<any> = [];

	onMount(async () => {
		if (status === 'executed') proposals = await fetchExecutedProposalsByDao(contractId!);
		else if (status === 'open') proposals = await fetchProposedProposalsByDao(contractId!);
	});
</script>

<div class="flex flex-col gap-y-5">
	<h1 class=" text-2xl">DAO Proposals</h1>
	<p class="strapline">
		The following are contracts which are extensions registered for this dao. They may be changed,
		activated and deactivated via accepted proposals.
	</p>

	{#each proposals as proposal}
		<div class="grid w-full grid-cols-6 justify-stretch">
			<ProposalGridItem {proposal} admin={true} />
		</div>
	{/each}
</div>
