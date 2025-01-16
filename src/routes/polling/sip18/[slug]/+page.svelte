<script lang="ts">
	import { onMount } from 'svelte';
	import { type PollCreateEvent, type StoredPollVoteMessage } from '@mijoco/stx_helpers/dist/index';
	import { getStxAddress } from '$lib/stacks/stacks-connect';
	import { page } from '$app/state';
	import {
		fetchSip18PollVotes,
		getCreatePollEvent,
		submitSip18PollVotes
	} from '$lib/polling/polling';

	let poll: PollCreateEvent;
	let showVotes = false;
	let pollId: string;
	let sip18PollVotes: Array<StoredPollVoteMessage>;
	let inited = false;

	const fetchAll = async () => {
		sip18PollVotes = await fetchSip18PollVotes(pollId);
		showVotes = true;
	};

	const submitAll = async () => {
		const results = await submitSip18PollVotes(poll.votingContract, sip18PollVotes);
		showVotes = false;
	};

	onMount(async () => {
		pollId = page.params.slug;
		poll = await getCreatePollEvent(pollId);
		fetchAll();
		inited = true;
	});
</script>

<svelte:head>
	<title>Bitcoin DAO - SIP Voting</title>
	<meta
		name="description"
		content="Stacks Improvement Proposals - governance of the Stacks Blockchain."
	/>
</svelte:head>

<div class="mx-auto max-w-7xl py-6 md:px-6">
	<div class="py-0">
		<h1 class="my-5 text-2xl">Process vote messages</h1>

		{#each sip18PollVotes as item}
			<div class="grid w-full grid-cols-4 justify-evenly text-[11px]">
				<div
					class={item.voter === getStxAddress()
						? 'text-success col-span-2 w-full break-words'
						: 'col-span-2 break-words'}
					title={item.voter === getStxAddress() ? 'I voted!' : ''}
				>
					<span class="break-words">{item.voter}</span>
				</div>
				<div class="text-end">
					{@html item.vote}
				</div>
				<div class="text-end">
					{@html item.processed
						? '<span class="bg-success-300 text-success-800 py-2 px-3  border-success-500 rounded-2xl">Yes</span>'
						: '<span class="bg-danger-300 text-danger-100 py-2 px-3  border-danger-500 rounded-2xl">No</span>'}
				</div>
			</div>
		{/each}
		<div class="my-5">
			<button
				on:click={() => {
					submitAll();
				}}
				class="bg-success-01 w-52 shrink-0 items-center justify-center gap-x-1.5 rounded-xl border border-success-600 px-4 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50"
			>
				Submit votes
			</button>
		</div>
	</div>
</div>
