<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from 'flowbite-svelte';
	import { sessionStore } from '$stores/stores';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { goto } from '$app/navigation';
	import { getCurrentProposalLink, getProposalLatest, isConclusionPending, isPostVoting, isProposedPreVoting, isVoting } from '$lib/dao/proposals';
	import { getStxAddress, isCoordinator } from '$lib/stacks/stacks-connect';
	import { concludeVote } from '$lib/dao/dao_actions';
	import ProposalHeader from '$lib/dao/proposals/ProposalHeader.svelte';
	import Holding from '$lib/components/ui/Holding.svelte';
	import Placeholder from '$lib/components/common/Placeholder.svelte';
	import DaoVotingActive from '$lib/dao/proposals/dao-voting/ballot-box/DaoVotingActive.svelte';
	import DaoConcluded from '$lib/dao/proposals/dao-voting/DaoConcluded.svelte';
	import { page } from '$app/state';

	let proposal: VotingEventProposeProposal | undefined;
	let postVoting: boolean = false;
	let inited = false;

	const conclude = async () => {
		if (proposal) {
			await concludeVote(proposal.daoContract, proposal.votingContract, proposal.proposal);
		}
	};

	onMount(async () => {
		// method = Number(page.url.searchParams.get('method')) || 2;
		proposal = await getProposalLatest(page.params.slug);
		postVoting = ($sessionStore?.stacksInfo?.burn_block_height || 0) >= (proposal?.proposalData?.burnStartHeight || 0);

		if (!proposal) {
			goto('/');
			return;
		}
		if (isPostVoting(proposal)) {
			const nodao = proposal.stackerData?.nodao;
		}
		inited = true;
	});
</script>

<svelte:head>
	<title>BigMarket DAO - SIP Voting</title>
	<meta name="description" content="Stacks Improvement Proposals - governance of the Stacks Blockchain." />
</svelte:head>

<div class="mx-auto max-w-7xl py-6 md:px-6">
	{#if proposal}
		<ProposalHeader {proposal} />

		{#if isVoting(proposal)}
			<DaoVotingActive {proposal} />
		{:else if isProposedPreVoting(proposal)}
			<Holding />
		{:else if isConclusionPending(proposal)}
			<div class="flex justify-around">
				{#if isCoordinator(getStxAddress())}<div class="my-3 text-sm">
						<a href="/" class="text-bloodorange" on:click|preventDefault={() => conclude()}>Voting closed - please conclude</a>
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
