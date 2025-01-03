<script lang="ts">
	import { Icon, Share } from 'svelte-hero-icons';
	import Preamble from './Preamble.svelte';
	import ProposalStageUpdate from './ProposalStageUpdate.svelte';
	import { type VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { onMount } from 'svelte';
	import LinkInChainIcon from '$lib/assets/LinkInChainIcon.svelte';

	export let proposal: VotingEventProposeProposal;
	const tweetText = `Voting on proposal ${proposal.proposalMeta.title} to improve the Stacks Blockchain is under way at `;
	const siteUrl = 'https://stx.eco'; // Replace with your site's URL

	const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText + siteUrl)}`;

	let showDetails = false;

	const getIntLink = () => {
		return `/dao/proposals/${proposal.proposal}`;
	};

	const getSipLink = () => {
		if (proposal.links && proposal.links.length > 0 && proposal.links[0].href) {
			return proposal.links[0].href;
		}
		return `/dao/proposals/${proposal.proposal}`;
	};

	onMount(async () => {});
</script>

<div class="mt-8 sm:flex sm:items-start sm:justify-between">
	<div class="flex flex-col gap-y-4">
		<ProposalStageUpdate {proposal} />
	</div>
</div>
<div class="mt-6 text-white sm:flex sm:items-center sm:justify-between">
	<h1 class="flex text-2xl sm:text-4xl">
		<a class="" href={getIntLink()}>{@html proposal.proposalMeta.title}</a>
		<a href={getSipLink()} target="_blank" title="link to SIP doucment in Github"
			><LinkInChainIcon /></a
		>
		<a href={tweetUrl} target="_blank" class="mt-3">
			<button style="display: flex; ">
				<Icon src={Share} width={30} height={30} />
			</button>
		</a>
	</h1>

	<button
		on:click={() => (showDetails = !showDetails)}
		class="focus-visible:outline-black-500/50 inline-flex shrink-0 items-center gap-2 rounded-lg border border-transparent bg-transparent px-4 py-2 font-mono text-sm uppercase text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
	>
		<!-- Show/Hide toggle -->
		Show details
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4">
			<path
				fill-rule="evenodd"
				d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>
</div>

{#if showDetails}
	<Preamble
		proposalMeta={proposal.proposalMeta}
		votingContract={proposal.votingContract}
		submissionContract={proposal.submissionContract}
		contractId={proposal.proposal}
	/>
{/if}
