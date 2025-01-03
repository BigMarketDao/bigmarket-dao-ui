<script lang="ts">
	import { lookupContract, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { configStore } from '$stores/stores_config';
	import ClaritySytaxHighlighter from '$lib/components/ui/ClaritySytaxHighlighter.svelte';
	import { truncate } from '$lib/utils';
	import { goto } from '$app/navigation';

	export let proposal: VotingEventProposeProposal;
	let contract: any;
	let showSource = false;

	const openSesame = async () => {
		if (proposal.event === 'propose') {
			goto('/dao/proposal/' + proposal.proposal);
			return;
		}
		if (showSource) {
			showSource = false;
			return;
		}
		contract = await lookupContract($configStore.VITE_STACKS_API, proposal.proposal);
		showSource = true;
	};
</script>

<div class="col-span-5 py-5">
	<a
		class="pointer text-light"
		href="/"
		on:click|preventDefault={() => {
			openSesame();
		}}>{truncate(proposal.proposal.split('.')[0]) + '.' + proposal.proposal.split('.')[1]}</a
	>
</div>
<div class="col-span-1 py-5">{proposal.event}</div>
{#if showSource}
	<div class="col-span-6 py-0">
		<div class="source-modal"><ClaritySytaxHighlighter sourceCode={contract.source_code} /></div>
	</div>
{/if}
