<script lang="ts">
	import { onMount } from 'svelte';
	import CreatePoll from '$lib/polling/new/CreatePoll.svelte';
	import { page } from '$app/state';
	import SlotModal from '$lib/components/common/SlotModal.svelte';
	import { explorerTxUrl } from '$lib/stacks/stacks-connect';

	let pollContract: string;
	let showPollResult = false;
	let txId: string;
	$: explorerUrl = explorerTxUrl(txId);

	const handlePollSubmission = (data: any) => {
		txId = data;
		showPollResult = true;
	};
	function closeModal() {
		showPollResult = false;
	}

	onMount(async () => {
		pollContract = page.params.slug;
	});
</script>

<svelte:head>
	<title>New Poll</title>
	<meta name="description" content="Create an opinion poll" />
</svelte:head>

{#if showPollResult}
	<SlotModal onClose={() => closeModal()}>
		<div slot="modalBody">
			Your transaction has been sent - <a href={explorerUrl} target="_blank">show tx!</a>!
		</div>
	</SlotModal>
{/if}

<div class="mx-auto max-w-4xl py-4 md:px-6">
	<div class="my-2 flex w-full flex-col">
		<CreatePoll {pollContract} onPollSubmit={handlePollSubmission} />
	</div>
</div>
