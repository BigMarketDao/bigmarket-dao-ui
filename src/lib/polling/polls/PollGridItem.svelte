<script lang="ts">
	import { type PollCreateEvent } from '@mijoco/stx_helpers/dist/index';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessionStore } from '$stores/stores';
	import BlockHeightProgressBar from '$lib/components/common/BlockHeightProgressBar.svelte';
	import SlotModal from '$lib/components/common/SlotModal.svelte';
	import PollVote from './voting/PollVote.svelte';
	import { fmtNumber } from '$lib/utils';
	import Banner from '$lib/components/ui/Banner.svelte';

	export let poll: PollCreateEvent;
	export let admin: boolean;
	let currentBurnHeight = 0;
	let startBurnHeight = 0;
	let stopBurnHeight = 0;
	let inited = false;
	let showModal = false;
	let errorMessage: string | undefined;
	let successMessage: string | undefined;

	const openVoting = async () => {
		showModal = true;
	};

	const manageVoting = async () => {
		goto('/polling/poll/' + poll.metadataHash);
	};

	const handleSubmitPollVote = async (data: any) => {
		if (data.error) {
			errorMessage = data.message;
		} else {
			successMessage = 'Vote will ne batched and sent to contract';
		}
		closeModal();
	};

	function closeModal() {
		showModal = false;
	}

	onMount(async () => {
		currentBurnHeight = $sessionStore.stacksInfo.burn_block_height;
		startBurnHeight = poll.unhashedData.startBurnHeight;
		stopBurnHeight = poll.unhashedData.endBurnHeight;
		inited = true;
	});
</script>

{#if showModal}
	<SlotModal onClose={() => closeModal()}>
		<div class="" slot="modalBody"><PollVote {poll} onSubmitPollVote={handleSubmitPollVote} /></div>
	</SlotModal>
{/if}

{#if inited}
	<div class="col-span-5">
		<div class="flex justify-between">
			<div class="text-lg">{poll.unhashedData.name}</div>
		</div>
		<div class="flex justify-between">
			{poll.unhashedData.description}
		</div>
		<div>
			{#if errorMessage}
				<Banner bannerType={'danger'} message={errorMessage} />
			{/if}
			{#if successMessage}
				<Banner bannerType={'danger'} message={successMessage} />
			{/if}
		</div>
	</div>
	<div class="col-span-1 text-end">
		{#if admin}<a
				class="pointer text-light"
				href="/"
				on:click|preventDefault={() => {
					manageVoting();
				}}>manage</a
			>
		{/if}
		{#if currentBurnHeight < startBurnHeight}
			<button
				class="w-[100px] cursor-not-allowed whitespace-nowrap rounded-lg bg-gray-200 px-4 py-2 text-[10px] font-medium text-gray-500"
				disabled>starts soon</button
			>
		{:else if currentBurnHeight >= startBurnHeight && currentBurnHeight < stopBurnHeight}
			<button
				on:click|preventDefault={() => openVoting()}
				class="w-[100px] whitespace-nowrap rounded-lg bg-bitcoinorange px-4 py-2 text-[10px] font-medium text-white hover:bg-bitcoinorange"
				>vote now</button
			>
		{:else}
			<button
				class="w-[100px] cursor-not-allowed whitespace-nowrap rounded-lg bg-gray-200 px-4 py-2 text-[10px] font-medium text-gray-500"
				disabled>poll closed</button
			>
		{/if}
	</div>
	<div class="col-span-6">
		<div class="flex w-full flex-col justify-between">
			<BlockHeightProgressBar {currentBurnHeight} {startBurnHeight} {stopBurnHeight} />
			<div class="flex w-full justify-between">
				<div class="text-start text-[10px]">
					{#if currentBurnHeight < startBurnHeight}{fmtNumber(startBurnHeight)}{/if}
				</div>
				<div class="text-end text-[10px]">ends: {fmtNumber(stopBurnHeight)}</div>
			</div>
		</div>
	</div>
	<div class="col-span-6">
		<div class="flex w-full flex-col justify-between">
			<div class="text-end text-[10px]">
				<a class="underline" href={'/polling/sip18/' + poll.metadataHash}
					>&lt;show poll messages&gt;</a
				>
			</div>
		</div>
	</div>
{/if}
