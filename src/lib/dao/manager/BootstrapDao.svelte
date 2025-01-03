<script lang="ts">
	import { onMount } from 'svelte';
	import { configDaoStore } from '$stores/stores_config_dao';
	import { contractPrincipalCV, PostConditionMode } from '@stacks/transactions';
	import { openContractCall } from '@stacks/connect';
	import { getStxNetwork } from '$lib/stacks/stacks-connect';
	import { page } from '$app/state';
	import { getContractDeploymentTxId, isDaoConstructed } from '$lib/dao/dao_manager_helper';

	export let contractId: string;
	let txId: string | undefined;
	let constructed: boolean;

	const constructDao = async () => {
		const bootstrap = contractPrincipalCV(contractId.split('.')[0], 'bdp000-bootstrap');
		await openContractCall({
			network: getStxNetwork(),
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: contractId.split('.')[0],
			contractName: contractId.split('.')[1],
			functionName: 'construct',
			functionArgs: [bootstrap],
			onFinish: (data: any) => {
				txId = data.txId;
				console.log('finished contract call!', data);
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	};

	onMount(async () => {
		txId = await getContractDeploymentTxId(contractId);
		constructed = await isDaoConstructed(contractId);
	});
</script>

<svelte:head>
	<title>Bitcoin DAO</title>
	<meta
		name="description"
		content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin"
	/>
</svelte:head>

<div class="mx-auto w-full max-w-7xl py-4 md:px-6">
	<div class="my-2 flex w-full flex-col items-center">
		<div>
			<button
				on:click={() => {
					constructDao();
				}}
				class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
			>
				Bootstrap DAO
			</button>
		</div>
	</div>
</div>
