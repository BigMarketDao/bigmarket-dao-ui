<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getContractDeploymentTxId, isDaoConstructed } from '$lib/dao/dao_manager_helper';
	import DaoBanner from '$lib/components/common/DaoBanner.svelte';
	import MakeProposal from '$lib/dao/manager/proposals/MakeProposal.svelte';

	let daoContractId: string;
	let constructed = false;
	let txId: string | undefined;

	onMount(async () => {
		daoContractId = page.params.slug;
		txId = await getContractDeploymentTxId(daoContractId);
		if (txId) constructed = await isDaoConstructed(daoContractId);
	});
</script>

<svelte:head>
	<title>BigMarket DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="mx-auto max-w-7xl py-6 md:px-6">
	<div class="my-8 flex w-full flex-col">
		<div class="flex w-full flex-col gap-y-4 overflow-hidden rounded-lg border-[0.5px] border-gray-700 p-6 sm:p-10">
			<div class="py-0">
				<DaoBanner {daoContractId} />
				<h1 class="text-2xl">Make a Proposal</h1>
				<!-- <p class="py-2">Proposals, clarity smart contracts, come in 2 forms;</p>
				<ol class="mb-8 ps-5">
					<li class="list-decimal">
						non operational - for conducting votes and polls e.g. sip votes
					</li>
					<li class="list-decimal">
						operational - for changing the DAO configuration - adding/enabling/disabling extensions
					</li>
				</ol> -->
				{#if daoContractId}
					<MakeProposal daoContractAddress={daoContractId.split('.')[0]} />
				{/if}
			</div>
		</div>
	</div>
</div>
