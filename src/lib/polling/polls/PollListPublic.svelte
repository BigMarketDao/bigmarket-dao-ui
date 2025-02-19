<script lang="ts">
	import { onMount } from 'svelte';
	import PollGridItem from './PollGridItem.svelte';
	import { getAllOpinionPolls } from '../polling';
	import type { PollCreateEvent } from '@mijoco/stx_helpers/dist/index';

	let polls: Array<PollCreateEvent> = [];

	onMount(async () => {
		polls = await getAllOpinionPolls();
	});
</script>

<div class="flex flex-col gap-y-5">
	{#each polls as poll}
		<div class="grid w-full grid-cols-6 justify-stretch gap-y-5 rounded-lg bg-gray-800 px-10 py-5 text-white opacity-100">
			<PollGridItem {poll} admin={false} />
		</div>
	{/each}
</div>
