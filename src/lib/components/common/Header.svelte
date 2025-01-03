<script lang="ts">
	import { disconnectWallet } from '$lib/sui/sui-connect';
	import { onMount } from 'svelte';
	import ListWalletsModal from '../wallet/ListWalletsModal.svelte';
	import { truncate } from '$lib/utils';
	import {
		authenticate,
		getStxAddress,
		handlePendingSignin,
		isLoggedIn,
		logUserOut
	} from '$lib/stacks/stacks-connect';
	import { configStore, switchConfig } from '$stores/stores_config';

	export let title = 'Big Market';
	let componentKey = 0;
	let availableWallets = [];
	let showModal = false;

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
			window.location.reload();
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

		window.onload = function () {
			handlePendingSignin();
		};
	});
</script>

<header class=" py-4 text-white">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">
			<a href="/" class="mx-2 hover:text-blue-400">{title}</a>
		</h1>
		{#key componentKey}
			<nav>
				<a href="/" class="mx-2 hover:text-blue-400">Home</a>
				<a href="/campaign" class="mx-2 hover:text-blue-400">Markets</a>
				<a href="/" on:click|preventDefault={() => toggleNetwork()} class="mx-2 hover:text-blue-400"
					>{$configStore.VITE_NETWORK}</a
				>
				{#if isLoggedIn()}
					<a
						href="/"
						on:click|preventDefault={() => logoutStacks()}
						class="mx-2 hover:text-blue-400">{truncate(getStxAddress())}</a
					>
				{:else}
					<a
						id="connect-wallet"
						href="/"
						on:click|preventDefault={() => loginStacks()}
						class="mx-2 hover:text-blue-400">Connect Wallet</a
					>
				{/if}
			</nav>
		{/key}
	</div>
</header>
{#if showModal}
	<ListWalletsModal onClose={() => closeModal()} />
{/if}
