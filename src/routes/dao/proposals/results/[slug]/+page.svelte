<script lang="ts">
	import { onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import { type ResultsSummary, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { fmtNumber } from '$lib/utils';
	import { getCurrentProposalLink, getProposalLatest, getProposalNotFoundLink, isConclusionPending, isPostVoting, isVoting } from '$lib/dao/proposals';
	import { findDaoVotes, NAKAMOTO_VOTE_STOPS_HEIGHT, summarizeVotes, type VoteSummary } from '$lib/dao/dao_api';
	import ProposalHeader from '$lib/dao/proposals/ProposalHeader.svelte';
	import VoteResultsOverview from '$lib/dao/proposals/dao-voting/VoteResultsOverview.svelte';
	import DaoResults from '$lib/dao/proposals/dao-voting/DaoResults.svelte';
	import HoldingResults from '$lib/components/ui/HoldingResults.svelte';
	import Placeholder from '$lib/components/common/Placeholder.svelte';
	import { page } from '$app/state';
	import { concludeVote } from '$lib/dao/dao_actions';

	let proposal: VotingEventProposeProposal | undefined;
	let inited = false;
	let votes: Array<any> = [];
	let summary: VoteSummary;

	const conclude = async () => {
		if (proposal) {
			await concludeVote(proposal.daoContract, proposal.votingContract, proposal.proposal);
		}
	};

	const blockSinceEnd = () => {
		return $sessionStore.stacksInfo?.burn_block_height - (proposal?.proposalData?.burnEndHeight || 0);
	};

	const voteConcluded = () => {
		if (!proposal || !proposal.proposalData) return false;
		return isPostVoting(proposal);
	};

	onMount(async () => {
		proposal = await getProposalLatest(page.params.slug);
		if (!proposal) {
			return;
		}
		votes = await findDaoVotes(proposal.proposal);
		summary = summarizeVotes(votes, proposal.proposalData);
		inited = true;
	});
</script>

<svelte:head>
	<title>BigMarket DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="mx-auto max-w-7xl py-6 md:px-6">
	{#if proposal && inited}
		<ProposalHeader {proposal} />
		{#if isConclusionPending(proposal)}
			<div class="flex justify-around">
				<div class="my-3 text-sm">
					<a href="/" class="text-bloodorange" on:click|preventDefault={() => conclude()}>Voting closed - please conclude</a>
				</div>
			</div>
		{/if}

		{#if voteConcluded() || isVoting(proposal)}
			<div class="my-8 flex w-full flex-col">
				<div class="relative overflow-hidden rounded-2xl py-10 md:grid md:auto-cols-auto md:grid-flow-col md:gap-12">
					<div class="flex flex-col items-stretch justify-items-stretch">
						<div>
							{#if blockSinceEnd() > 0}
								<div class="mb-3 max-w-md">
									<h2 class="mb-3 text-2xl">Voting is closed</h2>
									<p>Voting closed at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
									<p>
										{summary.accountsAgainst + summary.accountsFor} addresses voted. Detailed results are displayed below.
									</p>
								</div>
							{:else}
								<div class="mb-3 max-w-md">
									<h2 class="mb-3 text-2xl">Voting in progress</h2>
									<p>Voting closes at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
									<p>
										{summary.accountsAgainst + summary.accountsFor} addresses voted. Detailed results are displayed below.
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			{#if voteConcluded()}
				<div id="tabs-header">
					<VoteResultsOverview {summary} />
				</div>
			{/if}
			<div>
				<div class="bg-transparent px-4 py-8">
					<DaoResults {votes} {summary} />
				</div>
			</div>
		{:else}
			<HoldingResults />
		{/if}
	{:else if !proposal}
		<Placeholder message={'Proposal loading'} link={getProposalNotFoundLink()} />
	{:else}
		<Placeholder message={'Vote info loading'} link={getCurrentProposalLink(page.params.slug)} />
	{/if}
</div>
