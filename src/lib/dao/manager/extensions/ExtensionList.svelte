<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchExtensions } from '$lib/dao/dao_api';
	import Modal from '$lib/components/ui/Modal.svelte';
	import ClaritySytaxHighlighter from '$lib/components/ui/ClaritySytaxHighlighter.svelte';
	import ExtensionGridItem from '$lib/dao/manager/extensions/ExtensionGridItem.svelte';

	export let contractId: string;
	let extensions: Array<any> = [];
	let showModal = false;
	let item: any;
	let sourceCode: string;

	const openSourceModal = (evt: any) => {
		item = evt.detail;
		sourceCode = item.contract?.source;
	};

	onMount(async () => {
		extensions = await fetchExtensions(contractId);
	});
</script>

<Modal {showModal} on:click={() => (showModal = !showModal)}>
	<div class="source-modal"><ClaritySytaxHighlighter {sourceCode} /></div>
	<div slot="title">
		<h3>Extension: {item.contractId.split('.')[1]}</h3>
	</div>
</Modal>

<div class="flex flex-col gap-y-5">
	<h1 class=" text-2xl">DAO Extensions</h1>
	<p class="strapline">
		The following are contracts which are extensions registered for this dao. They may be changed,
		activated and deactivated via accepted proposals.
	</p>

	{#each extensions as extension}
		<div class="grid w-full grid-cols-6 justify-stretch">
			<ExtensionGridItem {extension} on:openSourceModal={openSourceModal} />
		</div>
	{/each}
</div>
