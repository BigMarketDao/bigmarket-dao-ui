<script lang="ts">
	import { fetchWallets, connectWallet } from '$lib/sui/sui-connect';
	import { onMount, onDestroy } from 'svelte';
	import type { Wallet } from '@mysten/wallet-standard';

	let availableWallets: Array<Wallet> = [];
	export let onClose: () => void;

	const connectToWallet = async (wallet: Wallet) => {
		await connectWallet(wallet);
		closeModal();
	};

	function closeModal() {
		if (onClose) {
			onClose();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	onMount(async () => {
		availableWallets = await fetchWallets();
		// if (wallets) {
		// 	availableWallets = [...wallets];
		// }

		if (typeof window !== 'undefined') window.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') window.removeEventListener('keydown', handleKeyDown);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
	style="@apply animate-fade-in"
	on:click={closeModal}
>
	<div
		class="relative h-1/2 w-2/3 overflow-hidden rounded-lg text-black shadow-lg transition-transform duration-300"
		on:click|stopPropagation
	>
		{#if availableWallets.length > 0}
			<div class="justify-content-start flex bg-white">
				<div class="w-[40%] bg-gray-300 p-6 pe-10">
					<h2 class="mb-1 text-xl font-bold">Connect a Wallet</h2>
					{#each availableWallets as wallet}
						<a
							href="/"
							class="text-md mb-1 block cursor-pointer rounded-lg border border-gray-300 p-3 font-bold hover:bg-gray-100"
							on:click|preventDefault={() => connectToWallet(wallet)}
						>
							<img src={wallet.icon} alt="wallet icon" class="inline" />
							{wallet.name}
						</a>
					{/each}
				</div>
				<div class="flex flex-col space-y-2 p-6">
					<h2 class="mb-5 text-xl font-bold">What is a Wallet</h2>
					<h3 class="text-md mb-5 font-semibold">Easy Login</h3>
					<p class="pb-10 text-gray-500">
						No need to create new accounts and passwords for every website. Just connect your wallet
						and get going.
					</p>
					<h3 class="text-md mb-5 font-semibold">Store your Digital Assets</h3>
					<p class="pb-10 text-gray-500">
						Send, receive, store, and display your digital assets like NFTs & coins.
					</p>
				</div>
			</div>
		{:else}
			<div class="justify-content-start flex">
				<div class="w-1/3 bg-gray-300 pe-10"></div>
				<div class="flex flex-col space-y-1">
					<h2 class="mb-1 text-xl font-bold">No sui wallet found</h2>
					<p class="pb-10">Please install one of the following sui wallets:</p>
					<a
						href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
						target="_blank"
						class="font-bold text-blue-500 hover:underline"
					>
						Mysten Wallet
					</a>
					<p>Where managing your digital assets is simple</p>
					<a
						href="https://www.stashers.app/"
						target="_blank"
						class="font-bold text-blue-500 hover:underline"
					>
						Stasher Wallet
					</a>
					<p>
						With your Stasher, you can promote your favorite cryptocurrencies, launch projects,
						communicate airdrops, become an influencer on the Sui network, and more.
					</p>
				</div>
			</div>
		{/if}

		<button
			on:click={closeModal}
			class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
		>
			&times;
		</button>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-in-out;
	}
</style>
