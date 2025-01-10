<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		lookupContract,
		type DaoEventEnableExtension,
		type ExtensionType
	} from '@mijoco/stx_helpers/dist/index';
	import { configStore } from '$stores/stores_config';
	import ClaritySytaxHighlighter from '$lib/components/ui/ClaritySytaxHighlighter.svelte';

	let dispatch = createEventDispatcher();

	export let extension: DaoEventEnableExtension;
	export let status = { name: 'active', color: 'info', colorCode: '#4786cd' };
	let contract: any;
	let showSource = false;
	let sourceCode: string;

	if (!extension.enabled) {
		status = { name: 'inactive', color: 'primary', colorCode: '#4B515D' };
	}
	const openSesame = async () => {
		contract = await lookupContract($configStore.VITE_STACKS_API, extension.extension);
		showSource = true;
	};

	const explorerUrl = () => {
		return `${$configStore.VITE_STACKS_EXPLORER}/txid/${extension.extension}?chain=${$configStore.VITE_NETWORK}&api=${$configStore.VITE_STACKS_API}`;
	};

	const statusStyle = () => {
		let clazzes =
			'border-top: 1pt solid ' +
			status.colorCode +
			'; border-left: 1pt solid ' +
			status.colorCode +
			'; border-right: 1pt solid ' +
			status.colorCode +
			';';
		return clazzes;
	};

	const actionStyle = () => {
		let clazzes =
			'border-top: 1pt solid ' +
			status.colorCode +
			'; border-left: 1pt solid ' +
			status.colorCode +
			'; border-bottom: 1pt solid ' +
			status.colorCode +
			';';
		return clazzes;
	};

	const actionRightStyle = () => {
		let clazzes = 'border: 1pt solid ' + status.colorCode + ';';
		return clazzes;
	};
	const headerStyle = () => {
		let clazzes = 'upper text-' + status.color;
		return clazzes;
	};
</script>

<div class="col-span-4">
	<a
		class="pointer text-light"
		href="/"
		on:click|preventDefault={() => {
			openSesame();
		}}>{extension.extension}</a
	>
</div>
<div class="col-span-1">
	{extension.enabled}
</div>
<div class="col-span-1">
	<a class="pointer text-light" href={explorerUrl()} target="_blank">Explorer</a>
</div>
{#if showSource}
	<div class="col-span-6">
		<div class="source-modal"><ClaritySytaxHighlighter sourceCode={contract.source_code} /></div>
	</div>
{/if}
