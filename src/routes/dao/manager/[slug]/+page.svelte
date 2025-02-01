<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getContractDeploymentTxId, isDaoConstructed } from '$lib/dao/dao_manager_helper';
	import BootstrapDao from '$lib/dao/manager/BootstrapDao.svelte';
	import DaoBanner from '$lib/components/common/DaoBanner.svelte';
	import type { SignatureData } from '@stacks/connect';
	import { getStxAddress } from '$lib/stacks/stacks-connect';
	import ExtensionList from '$lib/dao/manager/extensions/ExtensionList.svelte';
	import SlotModal from '$lib/components/common/SlotModal.svelte';
	import ProposalList from '$lib/dao/manager/proposals/ProposalList.svelte';
	import { signAdminMessage } from '$lib/dao/voting_sip18';
	import { readBaseDaoEvents } from '$lib/dao/dao_api';
	import type { Auth } from '@mijoco/stx_helpers/dist/index';
	import CoreSignalExecute from '$lib/dao/manager/core-execute/CoreSignalExecute.svelte';
	import { sessionStore } from '$stores/stores';
	import { goto } from '$app/navigation';

	let daoContractId: string;
	let constructed = false;
	let showExtensions = false;
	let showProposals = false;
	let showOpenProposals = false;
	let showCoreExecute = false;
	let txId: string | undefined;
	let inited = false;
	let componentKey = 0;

	function closeModal() {
		showExtensions = false;
		showProposals = false;
		showCoreExecute = false;
		showOpenProposals = false;
		componentKey++;
	}

	const baseDaoEvents = async () => {
		//const response = await signXverse();

		await signAdminMessage(async function (auth: Auth) {
			const result = await readBaseDaoEvents(daoContractId, auth);
			console.log(result);
		});
	};

	onMount(async () => {
		daoContractId = page.params.slug;
		txId = await getContractDeploymentTxId(daoContractId);
		if (txId) constructed = await isDaoConstructed(daoContractId);
		inited = true;
	});
</script>

<svelte:head>
	<title>Bitcoin DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="mx-auto max-w-7xl py-6 md:px-6">
	<div class="my-8 flex w-full flex-col">
		<div class="flex w-full flex-col gap-y-4 overflow-hidden rounded-lg border-[0.5px] border-gray-700 p-6 sm:p-10">
			{#if inited}
				<div class="py-0">
					{#if !txId}
						<DaoBanner {daoContractId} />
						<div>
							<p>No dao found for contract: {daoContractId}</p>
							<p><a href="/dao/launcher">Launch your dao now</a></p>
						</div>
					{:else if !constructed}
						<DaoBanner {daoContractId} />
						<div>
							<p>DAO for contract: {daoContractId} is not bootstrapped</p>
						</div>
						<div>
							<BootstrapDao {daoContractId} />
						</div>
					{:else}
						<DaoBanner {daoContractId} />
						<h1 class="text-2xl">Manage DAO</h1>
						<p class="py-2">Proposals can change the DAO configuration of the DAO by activating, deactivating the extensions. For example a proposal can automatically switch the current voting extension for a new type of voting.</p>
						<p class="py-2">There are two ways for proposals to pass - voting via the whole DAO community and voting via the core team.</p>
						<div class="mt-5">
							<ul class="ps-5">
								{#if $sessionStore.userSettings.executiveTeamMember}
									<li class="list-disc">
										<a href="/" on:click|preventDefault={() => (showCoreExecute = !showCoreExecute)}>run core actions</a>
									</li>
								{/if}
								<li class="list-disc">
									<a href="/" on:click|preventDefault={() => (showExtensions = !showExtensions)}>view current extensions</a>
								</li>
								<li class="list-disc">
									<a href="/" on:click|preventDefault={() => (showProposals = !showProposals)}>view finished proposals</a>
								</li>
								<li class="list-disc">
									<a href="/" on:click|preventDefault={() => (showOpenProposals = !showOpenProposals)}>view open proposals</a>
								</li>
								<li class="list-disc">
									<a href={'/dao/manager/propose/' + daoContractId}>make a new proposal</a>
								</li>
								<li class="list-disc">
									<a href="/" on:click|preventDefault={() => goto('/dao/transfers')}>transfer tokens</a>
								</li>
							</ul>
						</div>
						{#if showCoreExecute}
							<SlotModal onClose={() => closeModal()}>
								<div slot="modalBody">
									<CoreSignalExecute />
								</div>
							</SlotModal>
						{/if}
						{#if showExtensions}
							<SlotModal onClose={() => closeModal()}>
								<div slot="modalBody">
									<ExtensionList {daoContractId} />
								</div>
							</SlotModal>
						{/if}
						{#if showProposals}
							<SlotModal onClose={() => closeModal()}>
								<div slot="modalBody">
									<ProposalList {daoContractId} status={'open'} />
								</div>
							</SlotModal>
						{/if}
						{#if showOpenProposals}
							<SlotModal onClose={() => closeModal()}>
								<div slot="modalBody">
									<ProposalList {daoContractId} status={'open'} />
								</div>
							</SlotModal>
						{/if}
						<div class="my-10">
							<p class="">Keep the DAO up to date.</p>
							<ul class="mt-4 ps-5">
								<li class="list-disc">
									<a href="/" on:click|preventDefault={() => baseDaoEvents()}>read dao events</a>
								</li>
							</ul>
						</div>
					{/if}
				</div>
			{:else}
				<div>Loading...</div>
			{/if}
		</div>
	</div>
</div>
