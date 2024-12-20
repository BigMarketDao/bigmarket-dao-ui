<script lang="ts">
	import { disconnectWallet, suiGetNonce } from '$lib/sui/sui-connect';
	import { getConfig } from '$stores/store_helpers';
	import { onMount } from 'svelte';
	import ListWalletsModal from '../wallet/ListWalletsModal.svelte';
	import type { Wallet } from '@mysten/wallet-standard';
	import { storedAccount, storedWallet } from '$stores/wallet';
	import { truncate } from '$lib/utils';

	export let title = 'Big Market';
	let componentKey = 0;
	let availableWallets = [];
	let showModal = false;

	let authUrl = '';

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
		const nonce = await suiGetNonce();
		const response = await fetch(`${getConfig().VITE_BIGMARKET_API}/jwt/v1/auth-url/${nonce}`);
		const data = await response.json();
		authUrl = data.url;
	});
</script>

<header class=" p-4 text-white">
	<div class="container mx-auto flex items-center justify-between">
		<h1 class="text-2xl font-bold">
			<a href="/" class="mx-2 hover:text-blue-400">{title}</a>
		</h1>
		{#key componentKey}
			<nav>
				<a href="/" class="mx-2 hover:text-blue-400">Home</a>
				<a href="/campaign" class="mx-2 hover:text-blue-400">Markets</a>
				{#if $storedWallet}
					<a href="/" on:click|preventDefault={() => logoutSui()} class="mx-2 hover:text-blue-400"
						>{truncate($storedAccount?.address)}</a
					>
				{:else}
					<a href="/" on:click|preventDefault={() => loginSui()} class="mx-2 hover:text-blue-400"
						>Connect Wallet</a
					>
				{/if}
			</nav>
		{/key}
	</div>
</header>
{#if showModal}
	<ListWalletsModal onClose={() => closeModal()} />
{/if}
