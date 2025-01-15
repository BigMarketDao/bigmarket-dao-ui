<script lang="ts">
	import { onMount } from 'svelte';
	import { type PollCreateEvent } from '@mijoco/stx_helpers/dist/index';
	import PollLogo from './PollLogo.svelte';
	import { isAdministrator } from '$lib/polling/polling';

	export let poll: PollCreateEvent;

	onMount(async () => {});
</script>

<div>
	<h1>{poll.unhashedData.name}</h1>
	<div class="flex">
		<PollLogo logo={poll.unhashedData.logo} />
		<p>{@html poll.unhashedData.description}</p>
	</div>
	<p>
		{#if isAdministrator(poll)}
			upload/change logo
		{/if}
	</p>
</div>
