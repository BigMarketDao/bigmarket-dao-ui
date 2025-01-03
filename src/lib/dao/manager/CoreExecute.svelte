<script lang="ts">
	import { showContractCall } from '@stacks/connect';
	import { PostConditionMode, contractPrincipalCV } from '@stacks/transactions';
	import { getStacksNetwork, lookupContract } from '@mijoco/stx_helpers/dist/index';
	import { configDaoStore } from '$stores/stores_config_dao';
	import { configStore } from '$stores/stores_config';

	let txId: string;
	let contractId: string;
	$: buttonLabel = txId ? 'Tx Sent' : 'SUPPORT PROPOSAL';

	const signalSupport = async () => {
		if (!contractId) return;
		const deployer = $configDaoStore.VITE_DOA_DEPLOYER;
		const proposalCV = contractPrincipalCV(contractId.split('.')[0], contractId.split('.')[1]);
		await showContractCall({
			network: getStacksNetwork($configStore.VITE_NETWORK),
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: deployer,
			contractName: 'bde004-core-execute',
			functionName: 'executive-action',
			functionArgs: [proposalCV],
			onFinish: (data) => {
				txId = data.txId;
				console.log('finished contract call!', data);
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	};

	const explorerUrl = () => {
		return `${$configStore.VITE_STACKS_EXPLORER}/txid/${txId}?chain=${$configStore.VITE_NETWORK}&api=${$configStore.VITE_STACKS_API}`;
	};

	let deployed = false;
	const checkDeployed = async (contractId: string) => {
		const result = await lookupContract($configStore.VITE_STACKS_API, contractId);
		deployed = typeof result !== undefined;
	};
</script>

<div class="my-5 rounded-md bg-sand-300 p-3">
	<div class="row">
		<div>
			<div class="text-small">Send signal</div>

			<div class="my-4 flex w-full flex-col justify-start">
				<label for="token-name">Proposal contract</label>
				<input
					id="token-name"
					class="rounded-lg border-gray-800 p-2 text-black"
					bind:value={contractId}
					on:change={() => checkDeployed(contractId)}
					type="text"
					aria-describedby="tokenName"
				/>
			</div>

			{#if !txId && deployed}
				<button
					on:click={() => signalSupport()}
					class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
				>
					{buttonLabel}
				</button>
			{/if}
		</div>
		{#if txId}
			<div>
				<a href={explorerUrl()} target="_blank">View on explorer</a>
			</div>
		{/if}
	</div>
</div>

<style>
</style>
