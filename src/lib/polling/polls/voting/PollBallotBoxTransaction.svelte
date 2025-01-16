<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PostConditionMode,
		boolCV,
		bufferCV,
		falseCV,
		listCV,
		noneCV,
		trueCV
	} from '@stacks/transactions';
	import { showContractCall } from '@stacks/connect';
	import { sessionStore } from '$stores/stores';
	import type { PollCreateEvent } from '@mijoco/stx_helpers/dist/index';
	import { getStacksNetwork, getTransaction } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import { explorerTxUrl, getAddressId, isLoggedIn } from '$lib/stacks/stacks-connect';
	import Banner from '$lib/components/ui/Banner.svelte';
	import { hexToBytes } from '@stacks/common';

	export let onTxPollVote;
	export let poll: PollCreateEvent;

	let errorMessage: string | undefined;
	let txId: string;
	let canVote = true;
	$: explorerUrl = explorerTxUrl(txId);

	const castVote = async (vfor: boolean) => {
		const deployer = poll.daoContract.split('.')[0];
		if (!isLoggedIn()) {
			errorMessage = 'Please connect your wallet to vote';
			return;
		}
		let forCV = trueCV();
		if (!vfor) {
			forCV = falseCV();
		}
		await showContractCall({
			network: getStacksNetwork(getConfig().VITE_NETWORK),
			postConditions: [],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: poll.votingContract.split('.')[0],
			contractName: poll.votingContract.split('.')[1],
			functionName: 'vote',
			functionArgs: [
				bufferCV(hexToBytes(poll.metadataHash)), // poll-id (poll ID)
				boolCV(vfor),
				noneCV(), // nft-contract for gating
				noneCV(), // ft-contract for gating
				noneCV(), // token-id for gating
				listCV([]) // proof (empty proof for no gating)
			],
			onFinish: (data) => {
				txId = data.txId;
				localStorage.setItem('VOTED_FLAG' + getAddressId(), JSON.stringify(poll.votingContract));
				localStorage.setItem('VOTED_TXID_3' + getAddressId(), JSON.stringify({ txId }));
				onTxPollVote({ txId, error: false, message: 'vote sent to contract' });
			},
			onCancel: () => {
				console.log('popup closed!');
				onTxPollVote({ error: true, message: 'user cancelled operation' });
			}
		});
	};

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
	});
</script>

<div>
	<div class="flex flex-col gap-y-4">
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
			<div class="flex w-full justify-start gap-x-4">
				<button
					on:click={() => {
						errorMessage = undefined;
						castVote(true);
					}}
					class="w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-bitcoinorange bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
				>
					I AGREE
				</button>
				<button
					on:click={() => {
						errorMessage = undefined;
						castVote(false);
					}}
					class="w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-bitcoinorange bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
				>
					I DISAGREE
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
