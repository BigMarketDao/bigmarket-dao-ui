<script lang="ts">
	import { onMount } from 'svelte';
	import { sessionStore } from '$stores/stores';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getBalanceAtHeight } from '@mijoco/stx_helpers/dist/custom-node';
	import { getConfig } from '$stores/store_helpers';
	import { explorerTxUrl } from '$lib/stacks/stacks-connect';
	import ChainUtils from '$lib/dao/ChainUtils';
	import FormatUtils from '$lib/dao/FormatUtils';
	import Banner from '$lib/components/ui/Banner.svelte';

	export let proposal: VotingEventProposeProposal;
	let balanceAtHeight = 0;

	let errorMessage: string | undefined;
	let txId: string;
	let canVote = true;
	$: explorerUrl = explorerTxUrl(txId);

	if (balanceAtHeight === 0 || balanceAtHeight < 1) {
		canVote = false;
	}
	onMount(async () => {
		const response = await getBalanceAtHeight(
			getConfig().VITE_STACKS_API,
			$sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress,
			proposal.proposalData.startBlockHeight
		);
		//balanceAtHeight = ChainUtils.fromMicroAmount(Number(response.stx.balance) - Number(response.stx.locked))
		balanceAtHeight = Number(response?.stx?.balance) || 0;
		balanceAtHeight = ChainUtils.fromMicroAmount(ChainUtils.toOnChainAmount(balanceAtHeight));
	});
</script>

<div>
	<div class="flex flex-col gap-y-4">
		<div class="flex w-full flex-col justify-start">
			<div class="space-y-3 rounded-lg pb-6">
				<Banner
					bannerType={'warning'}
					message={'Snapshot balance (connected wallet) when voting began, (at block ' +
						FormatUtils.fmtNumber(proposal.proposalData?.startBlockHeight) +
						'), was ' +
						balanceAtHeight +
						' STX'}
				/>
			</div>
		</div>
		{#if errorMessage}
			<div class="flex w-full justify-start gap-x-4">
				{errorMessage}
			</div>
		{/if}
	</div>
</div>
