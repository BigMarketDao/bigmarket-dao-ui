<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import { sessionStore } from '$stores/stores';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';
	import {
		type ResultsSummary,
		type VotingEventProposeProposal
	} from '@mijoco/stx_helpers/dist/index';
	import { fmtNumber } from '$lib/utils';
	import { goto } from '$app/navigation';
	import {
		getCurrentProposalLink,
		getProposalLatest,
		getProposalNotFoundLink,
		isConclusionPending,
		isPostVoting,
		isVoting
	} from '$lib/dao/proposals';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao/dao_api';
	import { getDaoSummary } from '$lib/dao/voting_api';
	import ChainUtils from '$lib/dao/ChainUtils';
	import ProposalHeader from '$lib/dao/proposals/ProposalHeader.svelte';
	import VoteResultsOverview from '$lib/dao/proposals/dao-voting/VoteResultsOverview.svelte';
	import DaoResults from '$lib/dao/proposals/dao-voting/DaoResults.svelte';
	import HoldingResults from '$lib/components/ui/HoldingResults.svelte';
	import Placeholder from '$lib/components/common/Placeholder.svelte';
	import { page } from '$app/state';
	import { configStore } from '$stores/stores_config';
	import { getStxAddress, isCoordinator } from '$lib/stacks/stacks-connect';
	import { concludeVote } from '$lib/dao/dao_actions';

	let proposal: VotingEventProposeProposal | undefined;

	let daoSummary: ResultsSummary;
	let uniqueAll: number = 0;
	let uniqueAccounts: number = 0;
	let method: number = 1;
	let errorReason: string | undefined;
	let balanceAtHeight: number = 0;
	let approved = false;
	let inited = false;

	const conclude = async () => {
		if (proposal) {
			await concludeVote(proposal.daoContract, proposal.votingContract, proposal.proposal);
		}
	};

	const blockSinceEnd = () => {
		return (
			$sessionStore.stacksInfo?.burn_block_height - (proposal?.proposalData?.burnEndHeight || 0)
		);
	};

	const isApproved = () => {
		approved = $sessionStore.stacksInfo?.burn_block_height > NAKAMOTO_VOTE_STOPS_HEIGHT;
	};

	const voteConcluded = () => {
		if (!proposal || !proposal.proposalData) return false;
		return isPostVoting(proposal);
	};

	const uniqueVotes = () => {
		const votesFor =
			daoSummary?.summary?.find((o: any) => o._id.event === 'vote' && o._id.for) || 0;
		const votesAgn =
			daoSummary?.summary?.find((o: any) => o._id.event === 'vote' && !o._id.for) || 0;
		const stxFor = daoSummary?.proposalData?.votesFor || 0;
		const stxAgainst = daoSummary?.proposalData?.votesAgainst || 0;
		let stxPower = stxFor + stxAgainst;

		return stxPower;
	};

	onMount(async () => {
		proposal = await getProposalLatest(page.params.slug);
		if (!proposal) {
			return;
		}
		if (proposal.stackerData?.nodao) goto(`/dao/proposals/${page.params.slug}/results2`);
		method = 1; //Number($page.url.searchParams.get('method')) || 3

		if (proposal) {
			daoSummary = await getDaoSummary(proposal.proposal);
			uniqueAll = uniqueVotes();

			isApproved();
			try {
				const response = await getBalanceAtHeight(
					$configStore.VITE_STACKS_API,
					getStxAddress(),
					proposal.proposalData.startBlockHeight
				);
				balanceAtHeight = ChainUtils.fromMicroAmount(
					Number(response.stx.balance) - Number(response.stx.locked)
				);
			} catch (e: any) {
				balanceAtHeight =
					$sessionStore.keySets[$configStore.VITE_NETWORK].walletBalances?.stacks.amount || 0;
				errorReason = e.message;
			}
		}
		inited = true;
	});
</script>

<svelte:head>
	<title>Ecosystem DAO - SIP Voting</title>
	<meta
		name="description"
		content="Stacks Improvement Proposals - governance of the Stacks Blockchain."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl py-6 md:px-6">
	{#if proposal && inited}
		<ProposalHeader {proposal} />
		{#if isConclusionPending(proposal)}
			<div class="flex justify-around">
				<div class="my-3 text-sm">
					<a href="/" class="text-bloodorange" on:click|preventDefault={() => conclude()}
						>Voting closed - please conclude</a
					>
				</div>
			</div>
		{/if}

		{#if voteConcluded() || isVoting(proposal)}
			<div class="my-8 flex w-full flex-col">
				<div
					class="relative overflow-hidden rounded-2xl bg-[#F4F3F0] py-10 md:grid md:auto-cols-auto md:grid-flow-col md:gap-12"
				>
					<div class="flex flex-col items-stretch justify-items-stretch">
						<div>
							{#if blockSinceEnd() > 0}
								<div class="mb-3 max-w-md text-[#131416]">
									<h2 class="mb-3 text-2xl">Voting is closed</h2>
									<p>Voting closed at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
									<p>{uniqueAccounts} addresses voted. Detailed results are displayed below.</p>
								</div>
							{:else}
								<div class="mb-3 max-w-md text-[#131416]">
									<h2 class="mb-3 text-2xl">Voting in progress</h2>
									<p>Voting closes at block {fmtNumber(proposal.proposalData.burnEndHeight)}</p>
									<p>{uniqueAccounts} addresses voted. Detailed results are displayed below.</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			{#if voteConcluded()}
				<div id="tabs-header">
					<VoteResultsOverview {approved} {daoSummary} />
				</div>
			{/if}
			<div>
				<div class="bg-transparent px-4 py-8">
					<DaoResults {proposal} {daoSummary} />
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
