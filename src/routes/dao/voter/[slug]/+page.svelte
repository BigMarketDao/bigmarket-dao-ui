<script lang="ts">
	import { onMount } from 'svelte';
	import { type VotingEventVoteOnProposal } from '@mijoco/stx_helpers/dist/index';
	import { getCurrentProposalLink, getVotesByVoter } from '$lib/dao/proposals';
	import Placeholder from '$lib/components/common/Placeholder.svelte';
	import { page } from '$app/state';

	let votes: Array<VotingEventVoteOnProposal> | [];

	onMount(async () => {
		votes = await getVotesByVoter(page.params.slug);
	});
</script>

<svelte:head>
	<title>BigMarket DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="mx-auto max-w-7xl py-6 md:px-6">
	{#if votes && votes.length > 0}
		<h1 class="mb-6 border-b-2 border-gray-200 pb-2 text-2xl font-bold text-gray-300">Voter history</h1>
		<div class="mb-8 flex flex-col gap-y-5 overflow-x-auto">
			<table class="min-w-full table-auto border-collapse border border-gray-300 shadow-lg">
				<thead>
					<tr class="bg-gray-200 text-left">
						<th class="border border-gray-300 px-4 py-2 text-gray-800">Proposal</th>
						<th class="border border-gray-300 px-4 py-2 text-gray-800">Power</th>
						<th class="border border-gray-300 px-4 py-2 text-gray-800">Yay/Nay</th>
					</tr>
				</thead>
				<tbody>
					{#each votes as vote}
						<tr class="border-b transition hover:bg-gray-700">
							<td class="border border-gray-300 px-4 py-2">{vote.proposal}</td>
							<td class="border border-gray-300 px-4 py-2">{vote.amount}</td>
							<td class="border border-gray-300 px-4 py-2">{vote.for ? 'for' : 'against'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<Placeholder message={'No votes found'} link={getCurrentProposalLink(page.params.slug)} />
	{/if}
</div>
