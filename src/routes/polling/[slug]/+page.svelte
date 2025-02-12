<script lang="ts">
	import { onMount } from 'svelte';
	import PolymarketCard from '$lib/components/common/PolymarketCard.svelte';
	import { page } from '$app/state';

	let pollContract: string;

	onMount(async () => {
		pollContract = page.params.slug;
	});
</script>

<svelte:head>
	<title>BigMarket DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="mx-auto max-w-4xl py-4 md:px-6">
	<div class="my-2 flex w-full flex-col">
		<h2 class="text-3xl">Opinion Polls</h2>

		<div class="flex flex-col sm:flex-row">
			<div class="order-1 w-3/4 py-4 md:order-1">
				<PolymarketCard target={'/polling/new/' + pollContract} label={'Start here!'} description={undefined} title={'New Poll'} selected={0}>
					<div slot="longDescription">
						<p>Launching a poll is cheap and easy. For 50 STX you get;</p>
						<ul class="m-3 text-sm">
							<li class="list-disc">open, transparent, on-chain</li>
							<li class="list-disc">zero cost for end users</li>
							<li class="list-disc">marketing - discord / X integration</li>
							<li class="list-disc">upload proposals</li>
							<li class="list-disc">custom start/end times</li>
						</ul>
					</div>
				</PolymarketCard>
			</div>
			<div class="order-2 w-1/4 p-4 md:order-2">
				<h3 class="font-semibold">live polls</h3>
				<h3 class="font-semibold">all polls</h3>
				<h3 class="font-semibold">integrations</h3>
				<ol class="font-semibold">
					<li class="ms-5">discord</li>
					<li class="ms-5">twitter</li>
				</ol>
			</div>
		</div>
	</div>
</div>
