<script lang="ts">
	import { fmtMicroToStx, fmtNumber } from '$lib/utils';
	import { sessionStore } from '$stores/stores';
	import BallotBox from './DaoVotingBallotBox.svelte';
	import Sip18BallotBox from './Sip18VotingBallotBox.svelte';
	import { onMount } from 'svelte';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getDaoVotesByProposalAndVoter } from '$lib/dao/voting_api';
	import { configStore } from '$stores/stores_config';
	import { isLoggedIn, loginStacksFromHeader } from '$lib/stacks/stacks-connect';
	import Banner from '$lib/components/ui/Banner.svelte';
	import { isVoting } from '$lib/dao/proposals';
	import DaoUtils from '$lib/dao/DaoUtils';
	import SlotModal from '$lib/components/common/SlotModal.svelte';

	export let proposal: VotingEventProposeProposal;
	//export let adjustBal: number;
	const votes: any[] = [];
	let voted = 0;
	let showTxVoting = false;
	let totalBalanceUstx = 0;
	let votedPower = 0;
	let inited = false;
	let showVotingInfo = false;
	let showSip18Result = false;
	let showTxResult = false;

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

	function closeModal() {
		showSip18Result = false;
		showTxResult = false;
	}

	onMount(async () => {
		const daoVotes = await getDaoVotesByProposalAndVoter(
			proposal.proposal,
			$sessionStore.keySets[$configStore.VITE_NETWORK].stxAddress
		);
		totalBalanceUstx = await DaoUtils.fullBalance(proposal);
		if (daoVotes && daoVotes.length > 0) {
			daoVotes.forEach((o: any) => {
				if (o) votes.push(o);
				const amountVoted = Number(o.amount);
				if (o.for) {
					votedPower += amountVoted;
				} else {
					votedPower += amountVoted;
				}
				voted++;
			});
			totalBalanceUstx = totalBalanceUstx - votedPower * 1000000;
		}
		inited = true;
	});
</script>

{#if inited}
	<div>
		<div class="flex w-full flex-col rounded-2xl bg-transparent text-white">
			<div class="relative overflow-hidden py-3 md:grid md:auto-cols-auto md:grid-flow-col">
				<div class="bg-warning-01 flex flex-col gap-y-3">
					<div class="">
						<h2 class="mb-3 text-2xl">Send your vote</h2>
					</div>
					{#if showSip18Result}
						<SlotModal onClose={() => closeModal()}>
							<div slot="modalBody">Youe vote message has been registered - thanks for voting!</div>
						</SlotModal>
					{/if}

					{#if showTxResult}
						<SlotModal onClose={() => closeModal()}>
							<div slot="modalBody">Your vote has been registered - thanks for voting!</div>
						</SlotModal>
					{/if}

					<div class="flex flex-col gap-y-5 text-sm">
						{#if isLoggedIn()}
							<h4 class="">
								<a href="/" on:click|preventDefault={() => (showVotingInfo = !showVotingInfo)}
									>show voting information</a
								>
							</h4>
						{/if}
						{#if showVotingInfo || !isLoggedIn()}
							<div class="flex flex-col gap-y-2 rounded-lg border border-white p-5">
								<p>
									Vote by signing a message with your (Leather / Xverse / etc) web wallet. The
									signed messages are batched up and sent to the voting contract for verification.
								</p>
								<p>
									If you prefer you can use the link below to send your vote directly to the smart
									contract by sending a stacks transaction.
								</p>
								<div class="">
									<Banner
										bannerType={'warning'}
										message={'Your wallet must be connected to vote!'}
									/>
								</div>
								<div class="my-5 flex w-full flex-col items-center">
									<button
										on:click={() => {
											login();
										}}
										class="bg-success-01 w-[250px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
									>
										Connect Wallet to Continue
									</button>
								</div>
							</div>
						{/if}
					</div>
					{#if voted > 0}
						<div class="mb-3 max-w-xl">
							<Banner
								bannerType={'warning'}
								message={'Account has voted with ' +
									fmtMicroToStx(votedPower) +
									' stx. <a href="/dao/proposals/' +
									proposal.proposal +
									'/badge?method=3" >collect your badge here!</a>'}
							/>
						</div>
					{/if}

					{#if isLoggedIn()}
						{#if isVoting(proposal)}
							<div>
								{#if showTxVoting}
									<BallotBox {proposal} {totalBalanceUstx} onTxVote={handleTxVote} />
								{:else}
									<Sip18BallotBox {proposal} {totalBalanceUstx} onSip18Vote={handleSip18Vote} />
								{/if}
							</div>
							<p class="my-5">
								<a
									class="text-sm underline hover:text-stackspurple"
									href="/"
									on:click|preventDefault={() => (showTxVoting = !showTxVoting)}
									>{#if showTxVoting}prefer to vote by signing a voting message?{:else}prefer to
										vote by sending a transaction?{/if}</a
								>
							</p>
						{:else if voted === 0}
							<div class="mb-3 max-w-xl">
								0
								<Banner
									bannerType={'warning'}
									message={'Already voted or your snapshot balance when voting began (at block ' +
										fmtNumber(proposal.proposalData.startBlockHeight) +
										') was 0 STX.'}
								/>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
