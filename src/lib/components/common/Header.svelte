<script lang="ts">
	import { disconnectWallet } from '$lib/sui/sui-connect';
	import { onMount } from 'svelte';
	import ListWalletsModal from '../wallet/ListWalletsModal.svelte';
	import { fmtNumber, truncate } from '$lib/utils';
	import { authenticate, getStxAddress, handlePendingSignin, isLoggedIn, logUserOut } from '$lib/stacks/stacks-connect';
	import { configStore, switchConfig } from '$stores/stores_config';
	import { sessionStore } from '$stores/stores';
	import { goto } from '$app/navigation';

	export let title = 'BigMarket';
	let componentKey = 0;
	let availableWallets = [];
	let showModal = false;
	$: heights = {
		stacksHeight: fmtNumber($sessionStore.stacksInfo?.stacks_tip_height || 0) || '0',
		bitcoinHeight: fmtNumber($sessionStore.stacksInfo?.burn_block_height || 0) || '0'
	};

	let authUrl = '';

	const toggleNetwork = async () => {
		const network = $configStore.VITE_NETWORK;
		if (network === 'devnet') switchConfig('testnet');
		else if (network === 'testnet') switchConfig('mainnet');
		else if (network === 'mainnet') switchConfig('devnet');
		componentKey++;
	};
	const loginStacks = async () => {
		authenticate(function () {
			typeof window !== 'undefined' ? window.location.reload() : '';
		});
	};
	const logoutStacks = async () => {
		logUserOut();
		componentKey++;
	};
	const loginSui = async () => {
		showModal = true;
		componentKey++;
	};
	const logoutSui = async () => {
		disconnectWallet();
		componentKey++;
	};
	function closeModal() {
		showModal = false;
		componentKey++;
	}

	onMount(async () => {
		// const nonce = await suiGetNonce();
		// const response = await fetch(`${$configStore.VITE_BIGMARKET_API}/jwt/v1/auth-url/${nonce}`);
		// const data = await response.json();
		// authUrl = data.url;
		if (typeof window !== 'undefined') {
			window.onload = function () {
				handlePendingSignin();
			};
		}
	});
</script>

<header class=" py-4 text-white">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">
			<a href="/" class="mx-2 hover:text-blue-400">{title}</a>
		</h1>
		{#key componentKey}
			<nav>
				<span>
					Block height:
					<svg class="inline-block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
						><path
							fill="#fff"
							d="m14.8897 16.0001-2.546-3.8575H16v-1.4554H4v1.4571h3.65512l-2.54485 3.8558h1.8986L10 11.4681l2.9911 4.532h1.8986ZM16 9.27468V7.80464h-3.582L14.929 4h-1.8986L9.99997 8.59149 6.96957 4H5.07099l2.51428 3.80805H4v1.46663h12Z"
						/></svg
					>
					{heights.stacksHeight}
					<svg class="inline-block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
						><path
							fill="#fff"
							d="M15.549 8.62826c.22-1.47106-.9-2.26187-2.4315-2.78942l.4968-1.99275-1.213-.3023-.4837 1.94023c-.3189-.07946-.6464-.15442-.9718-.2287l.4871-1.95302L10.2206 3l-.49716 1.99205c-.26395-.06011-.52306-.11953-.77458-.18206l.00139-.00622-1.67282-.4177-.32268 1.29556s.89998.20626.88097.21904c.49128.12265.58007.44774.56521.70547l-.5659 2.27018c.03386.00863.07774.02107.12611.04042-.04042-.01002-.08361-.02108-.12818-.03179l-.79323 3.18015c-.06012.1493-.21247.3731-.55588.2882.01209.0176-.88167-.2201-.88167-.2201L5 13.5217l1.57851.3935c.29366.0736.58144.1506.86474.2232l-.50198 2.0155 1.21161.3023.49715-1.9941c.33097.0898.65227.1727.96666.2508l-.49542 1.9848L10.3343 17l.5019-2.0117c2.0684.3914 3.6238.2335 4.2785-1.6373.5276-1.5063-.0263-2.3752-1.1145-2.9418.7925-.1827 1.3895-.70407 1.5488-1.78094Zm-2.7715 3.88634c-.3748 1.5063-2.91103.692-3.73328.4878l.66609-2.6702c.82229.2052 3.45899.6115 3.06719 2.1824Zm.3752-3.90811c-.342 1.37019-2.4529.67404-3.1377.50337l.6039-2.42183c.6848.17067 2.89.4892 2.5338 1.91846Z"
						/></svg
					>
					{heights.bitcoinHeight}
				</span>
				<a href="/" on:click|preventDefault={() => toggleNetwork()} class="mx-2 hover:text-blue-400">{$configStore.VITE_NETWORK}</a>
				<a href="/" on:click|preventDefault={() => goto(`/dao/voter/${getStxAddress()}`)} class="mx-2 hover:text-blue-400">history</a>
				{#if isLoggedIn()}
					<a href="/" on:click|preventDefault={() => logoutStacks()} class="mx-2 hover:text-blue-400">{truncate(getStxAddress())}</a>
				{:else}
					<a id="connect-wallet" href="/" on:click|preventDefault={() => loginStacks()} class="mx-2 hover:text-blue-400">Connect Wallet</a>
				{/if}
			</nav>
		{/key}
	</div>
</header>
{#if showModal}
	<ListWalletsModal onClose={() => closeModal()} />
{/if}
