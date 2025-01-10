<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PostConditionMode,
		contractPrincipalCV,
		falseCV,
		trueCV,
		uintCV
	} from '@stacks/transactions';
	import { showContractCall } from '@stacks/connect';
	import { sessionStore } from '$stores/stores';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getStacksNetwork, getTransaction } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import { explorerTxUrl, getAddressId, isLoggedIn } from '$lib/stacks/stacks-connect';
	import ChainUtils from '$lib/dao/ChainUtils';
	import Banner from '$lib/components/ui/Banner.svelte';
	import FormatUtils from '$lib/dao/FormatUtils';
	import { fmtMicroToStx, fmtMicroToStxFormatted } from '$lib/utils';
	import SlotModal from '$lib/components/common/SlotModal.svelte';

	export let onTxVote;
	export let proposal: VotingEventProposeProposal;
	export let totalBalanceUstx: number = 0;

	let amountStx = fmtMicroToStx(totalBalanceUstx);
	const balanceAtHeightF = fmtMicroToStxFormatted(totalBalanceUstx);

	let errorMessage: string | undefined;
	let txId: string;
	let canVote = true;
	$: explorerUrl = explorerTxUrl(txId);

	$: amountStx = fmtMicroToStx(totalBalanceUstx);
	const castVote = async (vfor: boolean) => {
		const deployer = proposal.daoContract.split('.')[0];
		if (!isLoggedIn()) {
			errorMessage = 'Please connect your wallet to vote';
			return;
		}
		if (amountStx === 0 || amountStx < 1) {
			errorMessage = 'Minimum voting power is 1 STX';
			return;
		}
		if (amountStx > totalBalanceUstx) {
			errorMessage =
				'Maximum voting power is ' + balanceAtHeightF + ' STX (your balance when voting opened)';
			amountStx = totalBalanceUstx;
			return;
		}
		let forCV = trueCV();
		if (!vfor) {
			forCV = falseCV();
		}
		// const amountUSTX = ChainUtils.toOnChainAmount(amount)
		const amountUSTX = ChainUtils.toOnChainAmount(amountStx);
		const amountCV = uintCV(amountUSTX);
		const proposalCV = contractPrincipalCV(
			proposal.proposal.split('.')[0],
			proposal.proposal.split('.')[1]
		);
		await showContractCall({
			network: getStacksNetwork(getConfig().VITE_NETWORK),
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: deployer,
			contractName: proposal.votingContract.split('.')[1],
			functionName: 'vote',
			functionArgs: [amountCV, forCV, proposalCV],
			onFinish: (data) => {
				txId = data.txId;
				localStorage.setItem('VOTED_FLAG' + getAddressId(), JSON.stringify(proposal.proposal));
				localStorage.setItem('VOTED_TXID_3' + getAddressId(), JSON.stringify({ txId }));
				//goto(`/dao/proposals/${proposal.proposal}/badge`);
				//window.location.reload();
				onTxVote(txId);
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	};

	if (totalBalanceUstx === 0 || totalBalanceUstx < 1) {
		canVote = false;
	}
	const lookupTransaction = async (txId: string) => {
		return await getTransaction(getConfig().VITE_STACKS_API, txId);
	};

	onMount(async () => {
		if (localStorage.getItem('VOTED_TXID_3' + getAddressId())) {
			const txIdObj = localStorage.getItem('VOTED_TXID_3' + getAddressId());
			if (txIdObj) {
				const potentialTxId = JSON.parse(txIdObj).txId;
				const tx = await lookupTransaction(potentialTxId);
				if (
					tx &&
					tx.tx_status === 'pending' &&
					tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress
				) {
					txId = potentialTxId;
				} else {
					if (tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) {
						localStorage.removeItem('VOTED_TXID_3' + getAddressId());
					}
				}
			}
		}
		amountStx = fmtMicroToStx(totalBalanceUstx);
	});
</script>

<div>
	<div class="flex flex-col gap-y-4">
		<div class="text-xl">Snapshot balance</div>
		{#if txId}
			<div class="mb-3 max-w-xl">
				<Banner
					bannerType={'warning'}
					message={'Your vote is in the mempool and should be confirmed soon. See <a href="' +
						explorerUrl +
						'" target="_blank">explorer!</a>'}
				/>
			</div>
		{:else}
			<div class="mb-3 max-w-xl">
				<Banner
					bannerType={'warning'}
					message={'No STX will be spent by voting but you will pay a gas fee.'}
				/>
			</div>
			<div class="flex w-full flex-col justify-start">
				<input
					class="w-1/2 rounded-lg border-gray-800 p-2 text-black"
					bind:value={amountStx}
					type="number"
					id="Contribution"
					aria-describedby="Contribution"
				/>
				<p class="mt-5 text-sm">
					Your snapshot balance at block <span class="text-bold"
						>{FormatUtils.fmtNumber(proposal.proposalData?.startBlockHeight)}</span
					>
					was <span class="text-bold">{balanceAtHeightF}</span> STX.
				</p>
			</div>
			<div class="flex w-full justify-start gap-x-4">
				<button
					on:click={() => {
						errorMessage = undefined;
						castVote(true);
					}}
					class="w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
				>
					VOTE YES
				</button>
				<button
					on:click={() => {
						errorMessage = undefined;
						castVote(false);
					}}
					class="w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
				>
					VOTE NO
				</button>
			</div>
			{#if errorMessage}
				<div class="flex w-full justify-start gap-x-4">
					{errorMessage}
				</div>
			{/if}
		{/if}
	</div>
</div>
