<script lang="ts">
	import { onMount } from 'svelte';
	import TokenTransfer from '$lib/dao/tokens/TokenTransfer.svelte';

	onMount(async () => {});
</script>

<svelte:head>
	<title>Bitcoin DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="w-full py-4">
	<div class="my-2 flex w-full flex-col items-center">
		<TokenTransfer />
	</div>
</div>
