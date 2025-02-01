<script lang="ts">
	import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
	import { openContractCall } from '@stacks/connect';
	import { onMount } from 'svelte';
	import { fetchStacksInfo, getStacksNetwork } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig, getDaoConfig } from '$stores/store_helpers';
	import { isLoggedIn } from '$lib/stacks/stacks-connect';
	import { getCurrentProposalLink } from '$lib/dao/proposals';
	import Holding from '$lib/components/ui/Holding.svelte';
	import Placeholder from '$lib/components/common/Placeholder.svelte';
	import ProposalDetection from '../proposals/ProposalDetection.svelte';

	let errorMessage: string | undefined;
	let inited = false;
	let componentKey = 0;

	let txId: string | undefined;

	let fundingMet = false;
	let proposal: string;

	const handleDetectProposal = (detectedProposal: string) => {
		proposal = detectedProposal;
		sendSignal();
	};

	const sendSignal = async () => {
		if (!isLoggedIn()) {
			errorMessage = 'Please connect your wallet to vote';
			return;
		}
		const proposalCV = contractPrincipalCV(proposal.split('.')[0], proposal.split('.')[1]);
		let functionArgs = [proposalCV];
		await openContractCall({
			network: getStacksNetwork(getConfig().VITE_NETWORK),
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: getDaoConfig().VITE_DOA_DEPLOYER,
			contractName: getDaoConfig().VITE_DOA_EMERGENCY_EXECUTE_EXTENSION,
			functionName: 'executive-action',
			functionArgs: functionArgs,
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
		inited = true;
	});
</script>

{#if inited}
	{#if !fundingMet}
		<div class="bg-warning-01 flex flex-col gap-y-2">
			<div class="mt-6 flex w-full flex-col gap-y-4">
				<form on:submit|preventDefault class="form-inline">
					<div class="flex w-full flex-col gap-y-4">
						{#key componentKey}
							<div class="w-full">
								<ProposalDetection onDetectProposal={handleDetectProposal} />
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
