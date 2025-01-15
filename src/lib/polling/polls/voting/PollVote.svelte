<script lang="ts">
	import { onMount } from 'svelte';
	import { type PollCreateEvent } from '@mijoco/stx_helpers/dist/index';
	import { isLoggedIn } from '$lib/stacks/stacks-connect';
	import Banner from '$lib/components/ui/Banner.svelte';
	import PollInformation from './PollInformation.svelte';
	import { isPollActive } from '$lib/polling/polling';
	import PollBallotBoxTransaction from './PollBallotBoxTransaction.svelte';
	import PollBallotBoxSip18 from './PollBallotBoxSip18.svelte';
	import InfoOnPollingMessage from './InfoOnPollingMessage.svelte';
	import { error } from '@sveltejs/kit';

	export let poll: PollCreateEvent;
	export let onSubmitPollVote: any;
	let showVotingInfo = false;
	let voted = false;
	let txVoting = false;

	function handleTxPollVote(data: any) {
		console.log('Received from child:', data);
		onSubmitPollVote(data);
	}

	function handleSip18PollVote(data: any) {
		console.log('Received from child:', data);
		onSubmitPollVote(data);
	}

	onMount(async () => {});
</script>

<div>
	<div class="flex w-full flex-col rounded-2xl bg-transparent text-white">
		<div class="relative overflow-hidden py-3 md:grid md:auto-cols-auto md:grid-flow-col">
			<div class="bg-warning-01 flex flex-col gap-y-3">
				<PollInformation {poll} />
				{#if isLoggedIn()}
					{#if voted}
						<div class="mb-3 max-w-xl">
							<Banner bannerType={'warning'} message={'Already voted'} />
						</div>
					{/if}
					{#if isPollActive(poll)}
						<div>
							{#if txVoting}
								<PollBallotBoxTransaction {poll} onTxPollVote={handleTxPollVote} />
							{:else}
								<PollBallotBoxSip18 {poll} onSip18PollVote={handleSip18PollVote} />
							{/if}
						</div>
					{/if}
				{/if}

				<div class="mt-8">
					<div class="flex flex-col gap-y-5 text-sm">
						{#if isLoggedIn()}
							<h4 class="">
								<a href="/" on:click|preventDefault={() => (showVotingInfo = !showVotingInfo)}
									>how does voting work?</a
								>
							</h4>
						{/if}
						{#if showVotingInfo || !isLoggedIn()}
							<InfoOnPollingMessage />
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
