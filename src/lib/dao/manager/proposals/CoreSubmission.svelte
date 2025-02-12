<script lang="ts">
	import { sessionStore } from '$stores/stores';
	import { PostConditionMode, contractPrincipalCV, someCV, uintCV } from '@stacks/transactions';
	import { openContractCall } from '@stacks/connect';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { FundingData } from '@mijoco/stx_helpers/dist/index';
	import { fetchStacksInfo, getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import { fmtMicroToStx, fmtNumber } from '$lib/utils';
	import { isLoggedIn } from '$lib/stacks/stacks-connect';
	import Countdown from '$lib/components/common/Countdown.svelte';
	import { getCurrentProposalLink } from '$lib/dao/proposals';
	import Holding from '$lib/components/ui/Holding.svelte';
	import Placeholder from '$lib/components/common/Placeholder.svelte';

	export let contractId: string;
	export let submissionContractId: string;

	let errorMessage: string | undefined;
	let inited = false;
	let burnHeightNow = 0;
	let componentKey = 0;

	let txId: string | undefined;

	let fundingMet = false;
	let proposalDuration = 0;
	let proposalStart = 0;
	let startHeightMessage: string;
	let durationMessage: string;

	const submitFlexible = async () => {
		if (!isLoggedIn()) {
			errorMessage = 'Please connect your wallet';
			return;
		}
		if (proposalDuration < 3) {
			errorMessage = 'Duration minimum is 3 blocks';
			return;
		}
		if (proposalDuration > 15000) {
			errorMessage = 'Duration maximum is 5000 blocks';
			return;
		}
		const proposalStartCV = uintCV(proposalStart);
		const paramDurationCV = uintCV(proposalDuration);
		const customMajorityCV = someCV(uintCV(8000));
		const votingContractCV = contractPrincipalCV(contractId.split('.')[0], 'bme001-0-proposal-voting');
		const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1]);
		let functionArgs = [proposalCV, proposalStartCV, paramDurationCV, customMajorityCV];
		console.log('submissionContractId: ' + submissionContractId);
		console.log('getStacksNetwork: ', getStacksNetwork(getConfig().VITE_NETWORK));
		await openContractCall({
			network: getStacksNetwork(getConfig().VITE_NETWORK),
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: submissionContractId.split('.')[0],
			contractName: submissionContractId.split('.')[1],
			functionName: 'core-propose',
			functionArgs,
			onFinish: async (data) => {
				txId = data.txId;
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	};

	const refreshClocks = () => {
		componentKey++;
	};

	onMount(async () => {
		const stacksInfo = await fetchStacksInfo(getConfig().VITE_STACKS_API);
		burnHeightNow = stacksInfo.burn_block_height;

		fundingMet = false;
		proposalDuration = 2000;
		proposalStart = $sessionStore.stacksInfo.burn_block_height + 6;
		inited = true;
	});

	$: explorerUrl = getConfig().VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + getConfig().VITE_NETWORK;
	$: startHeightMessage = 'Voting starts at ' + proposalStart + ' in ' + fmtNumber(proposalStart - burnHeightNow) + ' bitcoin blocks';
	$: durationMessage = 'The voting window is ' + proposalDuration + ' blocks, roughly ' + (proposalDuration / 144).toFixed(2) + ' days, after voting starts.';
</script>

{#if inited}
	{#if !fundingMet}
		<div class="bg-warning-01 flex flex-col gap-y-2">
			<div class="mt-6 flex w-full flex-col gap-y-4">
				<div>
					<div>
						<p>{startHeightMessage}</p>
						<p>{durationMessage}</p>
					</div>
					<p class="text-sm font-thin">(minimum contribution is 0.5 STX)</p>
					{#if txId}
						<div>
							<a href={explorerUrl} target="_blank">View on explorer</a>
						</div>
					{/if}
				</div>
				<form on:submit|preventDefault class="form-inline">
					<div class="flex w-full flex-col gap-y-4">
						{#key componentKey}
							<div class="w-full">
								<label class="block" for="start-block">voting will begin at block</label>
								<input on:change={() => refreshClocks()} bind:value={proposalStart} type="number" id="start-block" class={'h-[40px] w-60 rounded-lg border border-gray-400 px-2 py-1 text-black'} aria-describedby="Contribution" />
								<span class="text-sm text-[#131416]/[0.64]">approx start <Countdown endBlock={proposalStart - burnHeightNow} scaleFactor={1} /></span>
							</div>
							<div class="w-full">
								<label class="block" for="duration-block">voting open for minimum {proposalDuration} blocks</label>
								<input on:change={() => refreshClocks()} bind:value={proposalDuration} type="number" id="duration-block" class={'h-[40px] w-60 rounded-lg border border-gray-400 px-2 py-1 text-black'} aria-describedby="Contribution" />
								<span class="text-sm text-[#131416]/[0.64]">approx end <Countdown endBlock={proposalStart + proposalDuration - burnHeightNow} scaleFactor={1} /></span>
							</div>
							<div>
								<button
									on:click={() => {
										submitFlexible();
									}}
									class="bg-success-01 w-52 shrink-0 items-center justify-center gap-x-1.5 rounded-xl border border-success-600 px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
								>
									Submit proposal
								</button>
							</div>
						{/key}
						{#if errorMessage}<div>{errorMessage}</div>{/if}
					</div>
				</form>
			</div>
		</div>
	{:else}
		<Holding />
	{/if}
{:else}
	<Placeholder message={'Vote info loading'} link={getCurrentProposalLink('Unknown')} />
{/if}
