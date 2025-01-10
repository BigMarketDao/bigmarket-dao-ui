<script lang="ts">
	import { lookupContract, type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { configStore } from '$stores/stores_config';
	import ClaritySytaxHighlighter from '$lib/components/ui/ClaritySytaxHighlighter.svelte';
	import { truncate } from '$lib/utils';
	import { onMount } from 'svelte';
	import { isPostVoting, isVoting } from '$lib/dao/proposals';
	import { goto } from '$app/navigation';

	export let proposal: VotingEventProposeProposal;
	export let admin: boolean;
	let contract: any;
	let showSource = false;
	let inited = false;
	let rowClasses = 'py-3 grid w-full grid-cols-6 justify-stretch';

	const openSesame = async () => {
		if (showSource) {
			showSource = false;
			return;
		}
		contract = await lookupContract($configStore.VITE_STACKS_API, proposal.proposal);
		showSource = true;
	};

	const openVoting = async () => {
		if (admin) goto('/dao/proposals/sip18/' + proposal.proposal);
		else goto('/dao/proposals/' + proposal.proposal);
	};

	const openResults = async () => {
		goto('/dao/proposals/results/' + proposal.proposal);
	};

	onMount(async () => {
		if (proposal.submissionContract && isPostVoting(proposal)) {
			rowClasses += 'bg-primary-900 text-white';
		}
		inited = true;
	});
</script>

{#if inited}
	<div class="col-span-4">
		<a class="pointer text-light" href={'/dao/proposals/' + proposal.proposal}
			>{truncate(proposal.proposal.split('.')[0]) + '.' + proposal.proposal.split('.')[1]}</a
		>
	</div>
	<div class="col-span-1">
		<a
			class="pointer text-light"
			href="/"
			on:click|preventDefault={() => {
				openSesame();
			}}>source</a
		>
	</div>
	{#if isPostVoting(proposal)}
		<div class="col-span-1">
			<a
				class="pointer text-light"
				href="/"
				on:click|preventDefault={() => {
					openResults();
				}}>vote</a
			>
		</div>
	{:else}
		<div class="col-span-1">
			<a
				class="pointer text-light"
				href="/"
				on:click|preventDefault={() => {
					openVoting();
				}}
				>{#if admin}voting{:else}vote{/if}</a
			>
		</div>
	{/if}
	{#if showSource}
		<div class="col-span-6">
			<div class="source-modal">
				<ClaritySytaxHighlighter sourceCode={contract.source_code} />
			</div>
		</div>
	{/if}
{/if}
