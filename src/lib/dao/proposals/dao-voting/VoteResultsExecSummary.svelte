<script lang="ts">
	import { CheckCircleSolid, XSolid } from 'flowbite-svelte-icons';
	import { sessionStore } from '$stores/stores';
	import type { ResultsSummary, VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { onMount } from 'svelte';
	import { getDaoSummary } from '$lib/dao/voting_api';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT } from '$lib/dao/dao_api';

	export let proposal: VotingEventProposeProposal;
	let approved = true;
	let daoSummary: ResultsSummary;

	let daoPercent = '0';
	let daoAccountsFor = 0;
	let daoAccountsAgainst = 0;

	const blockSinceEnd = () => {
		return $sessionStore.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT;
	};

	const doCount = () => {
		const votesFor = daoSummary.summary.find((o) => o._id.event === 'vote' && o._id.for);
		const votesAgn = daoSummary.summary.find((o) => o._id.event === 'vote' && !o._id.for);
		const stxFor = daoSummary.proposalData.votesFor;
		const stxAgainst = daoSummary.proposalData.votesAgainst;
		const stxPower = stxFor + stxAgainst;
		daoAccountsFor = votesFor?.count || 0;
		daoAccountsAgainst = votesAgn?.count || 0;
		daoPercent = ((stxFor / stxPower) * 100).toFixed(4);
	};

	onMount(async () => {
		daoSummary = await getDaoSummary(proposal.proposal);
		doCount();
	});
</script>

<div class="mb-8 space-y-4 align-top lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
	{#if blockSinceEnd() > 0}
		<div class="bg-success-01 relative col-span-3 rounded-2xl border-error-600 bg-[#1c671b] p-8">
			{#if daoPercent !== 'NaN'}
				<div class="mb-2 flex flex-col justify-between gap-y-3 text-white md:flex-row">
					<div><span class="text-4xl font-extrabold">Non-Stackers</span></div>
					<div><span class="text-4xl font-extrabold">{daoPercent} %</span></div>
					<div>
						{#if Number(daoPercent) >= 66}
							<CheckCircleSolid class="h-10 w-10 text-white " />
						{:else}
							<XSolid class="text-red-500 h-10 w-10" />
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="relative col-span-2 rounded-2xl border-error-600 bg-[#1c671b] bg-primary-01 p-8">
			{#if approved}
				<div class="mb-5 flex justify-between">
					<div>
						<CheckCircleSolid class="h-10 w-10 text-white " />
					</div>
					<div><span class="text-4xl font-extrabold">YES</span></div>
				</div>
				<div class="flex justify-between">
					<div><span class="">Proposal failed to pass</span></div>
				</div>
			{:else}
				<div class="mb-5 flex justify-between">
					<div>
						<XSolid class="text-red-500 h-10 w-10" />
					</div>
					<div><span class="text-4xl font-semibold">NO</span></div>
				</div>
				<div class="flex flex-col">
					<div><span class="">Proposal failed to pass</span></div>
					<div>
						<span class="">Check below for the detailed breakdown on each voting method</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
