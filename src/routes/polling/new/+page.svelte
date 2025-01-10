<script lang="ts">
	import { onMount } from 'svelte';
	import CreatePoll from '$lib/polling/new/CreatePoll.svelte';

	onMount(async () => {});
</script>

<svelte:head>
	<title>New Poll</title>
	<meta name="description" content="Create an opinion poll" />
</svelte:head>

<div class="mx-auto max-w-4xl py-4 md:px-6">
	<div class="my-2 flex w-full flex-col">
		<CreatePoll />
	</div>
</div>
