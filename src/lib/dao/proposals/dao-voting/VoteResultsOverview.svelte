<script lang="ts">
	import tick from '$lib/assets/tick.png';
	import cross from '$lib/assets/cross.png';
	import { sessionStore } from '$stores/stores';
	import { onMount } from 'svelte';
	import { NAKAMOTO_VOTE_STOPS_HEIGHT, type VoteSummary } from '$lib/dao/dao_api';

	export let summary: VoteSummary;

	let daoPercent = '0';

	const blockSinceEnd = () => {
		return $sessionStore.stacksInfo?.burn_block_height - NAKAMOTO_VOTE_STOPS_HEIGHT;
	};

	onMount(async () => {
		daoPercent = summary.inFavour;
	});
</script>

<div class="mb-8 space-y-4 align-top lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
	<div class="stretch self-start rounded-2xl p-8">
		<h3 class="text-3xl font-extralight text-white">Vote results</h3>
	</div>
	{#if blockSinceEnd() > 0}
		<div class="relative col-span-2 rounded-2xl border-error-600 bg-[#F4F3F0] bg-primary-01 p-8">
			<div class="mb-5 flex justify-between">
				<div></div>
				<div><span class="text-4xl font-extrabold"></span></div>
			</div>
			<div class="mb-2 flex justify-between">
				<div><span class="text-4xl font-extrabold">In Favour</span></div>
				<div><span class="text-4xl font-extrabold">{daoPercent} %</span></div>
				<div>
					{#if Number(daoPercent) >= 66}<img
							alt="correct"
							src={tick}
							class="bg-transparent"
						/>{:else}<img alt="correct" class="bg-transparent" src={cross} />{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="relative col-span-2 rounded-2xl border-error-600 bg-[#F4F3F0] bg-primary-01 p-8">
			{#if summary.passed}
				<div class="mb-5 flex justify-between">
					<div><img alt="correct" src={tick} /></div>
					<div><span class="text-4xl font-extrabold">YES</span></div>
				</div>
				<div class="flex justify-between">
					<div><span class="">Proposal failed to pass</span></div>
				</div>
			{:else}
				<div class="mb-5 flex justify-between">
					<div><img alt="correct" src={cross} /></div>
					<div><span class="text-4xl font-semibold">NO</span></div>
				</div>
				<div class="flex flex-col">
					<div><span class="">Proposal failed to pass</span></div>
					<div>
						<span class="">Check below for the detailed breakdown on each voting method</span>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
