<script lang="ts">
	import { writable } from 'svelte/store';
	import { showConnect, showContractCall } from '@stacks/connect';
	import { openContractCall } from '@stacks/connect';
	import { noneCV, PostConditionMode, standardPrincipalCV, uintCV } from '@stacks/transactions';
	import { getStacksNetwork } from '@mijoco/stx_helpers/dist/index';
	import { getConfig, getDaoConfig } from '$stores/store_helpers';
	import { explorerTxUrl, getStxAddress } from '$lib/stacks/stacks-connect';

	let error: string;
	let txId: string;

	let contractAddress = getDaoConfig().VITE_DOA_DEPLOYER;
	let contractName = 'sbtc';
	let recipientAddress = '';
	let tokenAmount = 200000000000;

	// Open Stacks Wallet for Token Transfer
	const transferTokens = async () => {
		const network = getStacksNetwork(getConfig().VITE_NETWORK);
		try {
			await showContractCall({
				network: getStacksNetwork(getConfig().VITE_NETWORK),
				postConditions: [],
				postConditionMode: PostConditionMode.Allow,
				contractAddress,
				contractName,
				functionName: 'transfer',
				functionArgs: [uintCV(tokenAmount), standardPrincipalCV(getStxAddress()), standardPrincipalCV(recipientAddress), noneCV()],
				onFinish: (data) => {
					txId = data.txId;
				},
				onCancel: () => {
					console.log('popup closed!');
				}
			});
		} catch (err: any) {
			console.error('Error during transfer:', err);
		}
	};
</script>

<div class="w-1/3 space-y-4 rounded-xl bg-white p-6 shadow-md">
	<h2 class="text-lg font-bold text-gray-800">SIP-010 Token Transfer</h2>

	<label class="block">
		<span class="text-sm font-medium text-gray-700">Contract Address</span>
		<input type="text" class="bg-gray-50 mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={contractAddress} />
	</label>

	<label class="block">
		<span class="text-sm font-medium text-gray-700">Contract Name</span>
		<input type="text" class="bg-gray-50 mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={contractName} />
	</label>

	<label class="block">
		<span class="text-sm font-medium text-gray-700">Recipient Address</span>
		<input type="text" class="bg-gray-50 mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={recipientAddress} />
	</label>

	<label class="block">
		<span class="text-sm font-medium text-gray-700">Token Amount</span>
		<input type="number" class="bg-gray-50 mt-1 block w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500" bind:value={tokenAmount} />
	</label>

	<div class="space-y-2">
		<button class="w-full rounded-md bg-success-800 px-4 py-2 text-white hover:bg-success-600 focus:outline-none" on:click={() => transferTokens()}> Transfer Tokens </button>
	</div>

	{#if txId}
		<p class=" mt-2">
			<a class="text-black underline" href={explorerTxUrl(txId)} target="_blank" rel="noopener noreferrer"> view on explorer </a>
		</p>
	{/if}
</div>

<style>
	/* Add your custom Tailwind styles if needed */
</style>
