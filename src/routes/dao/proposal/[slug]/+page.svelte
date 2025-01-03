<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from 'flowbite-svelte';
	import { sessionStore } from '$stores/stores';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { goto } from '$app/navigation';
	import {
		getCurrentProposalLink,
		getProposalLatest,
		isConclusionPending,
		isPostVoting,
		isProposedPreVoting,
		isVoting
	} from '$lib/dao/proposals';
	import { getStxAddress, isCoordinator } from '$lib/stacks/stacks-connect';
	import { concludeVote } from '$lib/dao/dao_actions';
	import ChainUtils from '$lib/dao/ChainUtils';
	import ProposalHeader from '$lib/dao/proposals/ProposalHeader.svelte';
	import Holding from '$lib/components/ui/Holding.svelte';
	import Placeholder from '$lib/components/common/Placeholder.svelte';
	import DaoVotingActive from '$lib/dao/proposals/dao-voting/DaoVotingActive.svelte';
	import DaoConcluded from '$lib/dao/proposals/dao-voting/DaoConcluded.svelte';
	import { page } from '$app/state';
	import { configStore } from '$stores/stores_config';

	let method: number = 1;
	let errorReason: string | undefined;
	let proposal: VotingEventProposeProposal | undefined;
	let lockedBalanceAtHeight: number;
	let totalBalanceAtHeight: number;
	let balanceAtHeight: number = 0;
	let inited = false;

	const conclude = async () => {
		if (proposal) {
			await concludeVote(proposal.daoContract, proposal.votingContract, proposal.proposal);
		}
	};

	onMount(async () => {
		method = Number(page.url.searchParams.get('method')) || 2;
		proposal = await getProposalLatest(page.params.slug);

		if (!proposal) goto('/');
		if (isPostVoting(proposal)) {
			const nodao = proposal.stackerData?.nodao;
			goto(`/dao/proposal/results/${proposal.proposal}?chain=mainnet`);
		}
		try {
			// note the latter is the proposal deploy height but we'd like it to the height that corresponds to the bitcoin start height.
			const startStacksBlock =
				proposal.stackerData?.heights?.stacksStart || proposal.proposalData.startBlockHeight;
			const stxAddress = getStxAddress();
			const response = await getBalanceAtHeight(
				$configStore.VITE_STACKS_API,
				stxAddress,
				startStacksBlock
			);
			totalBalanceAtHeight = Number(response.stx?.balance || 0);
			lockedBalanceAtHeight = Number(response.stx?.locked || 0);
			balanceAtHeight = ChainUtils.fromMicroAmount(
				Number(response.stx.balance) - Number(response.stx.locked)
			);
			inited = true;
		} catch (e: any) {
			balanceAtHeight =
				$sessionStore.keySets[$configStore.VITE_NETWORK].walletBalances?.stacks.amount || 0;
			errorReason = e.message;
			inited = true;
		}
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

		{#if isVoting(proposal)}
			{#if method === 1}
				{#if $sessionStore.stacksInfo?.burn_block_height >= proposal.proposalData.burnStartHeight}
					<DaoVotingActive {proposal} adjustBal={balanceAtHeight} />
				{:else}
					<div class="my-8 flex w-full flex-col rounded-2xl bg-[#F4F3F0]">
						<div
							class="relative overflow-hidden px-10 py-10 md:grid md:auto-cols-auto md:grid-flow-col md:gap-12"
						>
							<Holding />
						</div>
					</div>
				{/if}
			{:else}
				<div class="flex flex-col gap-y-6 rounded-md border border-gray-900 bg-white/5 p-4">
					<Skeleton size="md" />
				</div>
			{/if}
		{:else if isProposedPreVoting(proposal)}
			<Holding />
		{:else if isConclusionPending(proposal)}
			<div class="flex justify-around">
				{#if isCoordinator(getStxAddress())}<div class="my-3 text-sm">
						<a href="/" class="text-bloodorange" on:click|preventDefault={() => conclude()}
							>Voting closed - please conclude</a
						>
					</div>
				{:else}
					Voting has ended. Results will be published soon.
				{/if}
			</div>
		{:else}
			<DaoConcluded {proposal} />
		{/if}
	{:else}
		<Placeholder message={'Proposal not found'} link={getCurrentProposalLink(page.params.slug)} />
	{/if}
</div>
