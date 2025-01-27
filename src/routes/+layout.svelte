<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { sessionStore } from '../stores/stores';
	import { configStore, setConfigByUrl } from '../stores/stores_config';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import { initAddresses, initApplication } from '@mijoco/stx_helpers/dist/account';
	import { getStxAddress, getUserData } from '$lib/stacks/stacks-connect';
	import { page } from '$app/state';
	import { isExecutiveTeamMember } from '$lib/dao/dao_manager_helper';
	import { fetchExchangeRates } from '$lib/stacks/rates';
	import { getConfig } from '$stores/store_helpers';

	const unsubscribe1 = sessionStore.subscribe(() => {});
	const unsubscribe3 = configStore.subscribe(() => {});
	let inited = false;

	onDestroy(async () => {
		unsubscribe1();
		unsubscribe3();
	});

	setConfigByUrl(page.url.searchParams);

	const initApp = async () => {
		if (!$sessionStore.keySets || !$sessionStore.keySets[$configStore.VITE_NETWORK])
			await initAddresses(sessionStore);
		const exchangeRates = await fetchExchangeRates();
		console.log($configStore.VITE_STACKS_API);
		console.log(getConfig().VITE_STACKS_API);
		if (!$sessionStore.balances) {
			await initApplication(
				$configStore.VITE_STACKS_API,
				$configStore.VITE_MEMPOOL_API,
				$configStore.VITE_NETWORK,
				sessionStore,
				exchangeRates,
				'$configStore.VITE_SBTC_CONTRACT_ID',
				getUserData()
			);
		} else {
			initApplication(
				$configStore.VITE_STACKS_API,
				$configStore.VITE_MEMPOOL_API,
				$configStore.VITE_NETWORK,
				sessionStore,
				exchangeRates,
				'$configStore.VITE_SBTC_CONTRACT_ID',
				getUserData()
			);
		}
		const daoContractId = page.params.slug;
		const emTeamMam = await isExecutiveTeamMember(undefined, getStxAddress());
		$sessionStore.userSettings.executiveTeamMember = emTeamMam?.executiveTeamMember || false;
	};

	onMount(async () => {
		await initApp();
		inited = true;
	});
</script>

<div
	class="min-h-screen bg-gray-1000 bg-[url('$lib/assets/bg-lines.svg')] bg-cover font-extralight text-white"
>
	<div class=" min-h-[calc(100vh-160px)] px-6">
		<div class="relative mx-auto flex min-h-screen flex-col">
			{#if inited}
				<div class="mx-[10%]"><Header /></div>
				<div class="mx-[10%] grow">
					<slot></slot>
				</div>
				<div class="mx-[10%]"><Footer /></div>
			{/if}
		</div>
	</div>
</div>
