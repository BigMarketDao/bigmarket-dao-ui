<script lang="ts">
	import { fmtMicroToStx, fmtNumber } from '$lib/utils';
	import BallotBox from './DaoVotingBallotBox.svelte';
	import Sip18BallotBox from './Sip18VotingBallotBox.svelte';
	import { onMount } from 'svelte';
	import { fullBalanceInSip10Token, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getDaoVotesByProposalAndVoter } from '$lib/dao/voting_api';
	import { getStxAddress, isLoggedIn, loginStacksFromHeader } from '$lib/stacks/stacks-connect';
	import Banner from '$lib/components/ui/Banner.svelte';
	import { isVoting } from '$lib/dao/proposals';
	import SlotModal from '$lib/components/common/SlotModal.svelte';
	import InfoOnVotingMessage from './InfoOnVotingMessage.svelte';
	import VotingPowerInput from './VotingPowerInput.svelte';
	import { getConfig, getDaoConfig } from '$stores/store_helpers';

	export let proposal: VotingEventProposeProposal;
	//export let adjustBal: number;
	const votes: any[] = [];
	let voted = 0;
	let txVoting = false;
	let totalBalanceUstx = 0;
	let votingPower = 0;
	let votedPower = 0;
	let inited = false;
	let showVotingInfo = false;
	let showSip18Result = false;
	let showTxResult = false;
	let errorMessage: string | undefined;

	const login = async () => {
		loginStacksFromHeader(document);
	};

	function handleTxVote(data: string) {
		console.log('Received from child:', data);
		showTxResult = true;
	}

	function handleSip18Vote(data: string) {
		console.log('Received from child:', data);
		showSip18Result = true;
	}

	function handleVotingPowerChange(amount: number) {
		if (amount > totalBalanceUstx) {
			errorMessage = 'Maximum voting power is ' + fmtMicroToStx(totalBalanceUstx) + ' STX';
			return;
		}
		votingPower = amount;
	}

	function handleVotingTypeChange(newTxVoting: boolean) {
		txVoting = newTxVoting;
	}

	function closeModal() {
		showSip18Result = false;
		showTxResult = false;
		errorMessage = undefined;
	}

	onMount(async () => {
		const daoVotes = await getDaoVotesByProposalAndVoter(proposal.proposal, getStxAddress());
		totalBalanceUstx = await fullBalanceInSip10Token(getConfig().VITE_STACKS_API, getStxAddress(), `${getDaoConfig().VITE_DOA_DEPLOYER}.${getDaoConfig().VITE_DAO_GOVERNANCE_TOKEN}`);
		// if (daoVotes && daoVotes.length > 0) {
		// 	daoVotes.forEach((o: any) => {
		// 		if (o) votes.push(o);
		// 		const amountVoted = Number(o.amount);
		// 		if (o.for) {
		// 			votedPower += amountVoted;
		// 		} else {
		// 			votedPower += amountVoted;
		// 		}
		// 		voted++;
		// 	});
		// 	totalBalanceUstx = totalBalanceUstx - votedPower;
		// }
		votingPower = totalBalanceUstx;
		inited = true;
	});
</script>

{#if inited}
	<div>
		<div class="flex w-full flex-col rounded-2xl bg-transparent text-white">
			<div class="relative overflow-hidden py-3 md:grid md:auto-cols-auto md:grid-flow-col">
				<div class="bg-warning-01 flex flex-col gap-y-3">
					{#if showSip18Result}
						<SlotModal onClose={() => closeModal()}>
							<div slot="modalBody">Your vote message has been registered - thanks for voting!</div>
						</SlotModal>
					{/if}

					{#if showTxResult}
						<SlotModal onClose={() => closeModal()}>
							<div slot="modalBody">Your vote has been registered - thanks for voting!</div>
						</SlotModal>
					{/if}

					{#if errorMessage}
						<SlotModal onClose={() => closeModal()}>
							<div slot="modalBody">{errorMessage}</div>
						</SlotModal>
					{/if}

					{#if isLoggedIn()}
						{#if voted > 0}
							<div class="mb-3 max-w-xl">
								<Banner bannerType={'warning'} message={'Already voted with ' + fmtMicroToStx(votedPower) + ' stx.'} />
							</div>
						{/if}
						{#if isVoting(proposal)}
							<div>
								<VotingPowerInput {totalBalanceUstx} {votingPower} {txVoting} onVotingPowerChange={handleVotingPowerChange} onVotingTypeChange={handleVotingTypeChange} />
							</div>
							<div>
								{#if txVoting}
									<BallotBox {proposal} {votingPower} onTxVote={handleTxVote} />
								{:else}
									<Sip18BallotBox {proposal} {votingPower} onSip18Vote={handleSip18Vote} />
								{/if}
							</div>
						{:else if voted === 0}
							<div class="mb-3 max-w-xl">
								<Banner bannerType={'warning'} message={'Already voted or your snapshot balance when voting began (at block ' + fmtNumber(proposal.proposalData.startBlockHeight) + ') was 0 STX.'} />
							</div>
						{/if}
					{/if}

					<div class="mt-8">
						<div class="flex flex-col gap-y-5 text-sm">
							{#if isLoggedIn()}
								<h4 class="">
									<a href="/" on:click|preventDefault={() => (showVotingInfo = !showVotingInfo)}>how does voting work?</a>
								</h4>
							{/if}
							{#if showVotingInfo || !isLoggedIn()}
								<InfoOnVotingMessage />
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
