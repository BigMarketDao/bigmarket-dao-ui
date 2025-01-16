<script lang="ts">
	import { onMount } from 'svelte';
	import { type SignatureData } from '@stacks/connect';
	import { sessionStore } from '$stores/stores';
	import { getTransaction } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import { domain, explorerTxUrl, getAddressId, getStxAddress } from '$lib/stacks/stacks-connect';
	import Banner from '$lib/components/ui/Banner.svelte';
	import {
		dataHashSip18,
		pollVoteMessageToTupleCV,
		type PollCreateEvent,
		type PollVoteMessage
	} from '@mijoco/stx_helpers/dist/index';
	import {
		newPollVoteMessage,
		postPollVoteMessage,
		signPollVoteMessage
	} from '$lib/polling/polling';

	export let poll: PollCreateEvent;
	export let onSip18PollVote;

	let errorMessage: string | undefined;
	let txId: string;
	let canVote = true;
	$: explorerUrl = explorerTxUrl(txId);

	const castVote = async (forVote: boolean) => {
		const pollVoteMessage: PollVoteMessage = await newPollVoteMessage(
			poll,
			forVote,
			getStxAddress()
		);
		await signPollVoteMessage(pollVoteMessage, async function (signature: SignatureData) {
			console.log('Signature of the message', signature.signature);
			const pollVoteObjectHash = dataHashSip18(
				getConfig().VITE_NETWORK,
				getConfig().VITE_PUBLIC_APP_NAME,
				getConfig().VITE_PUBLIC_APP_VERSION,
				pollVoteMessageToTupleCV(pollVoteMessage)
			);
			console.log('domain:', domain);
			console.log('hash:' + pollVoteObjectHash);
			// const sigres = verifySip18VoteSignature(
			// 	getConfig().VITE_NETWORK,
			// 	getConfig().VITE_PUBLIC_APP_NAME,
			// 	getConfig().VITE_PUBLIC_APP_VERSION,
			// 	pollVoteMessage,
			// 	signature.publicKey,
			// 	signature.signature
			// );
			// if (!sigres) {
			// 	//throw new Error('Signature is not valid');
			// }
			// const valid = await verifySignature(
			// 	pollVoteMessage,
			// 	hash,
			// 	signature.signature,
			// 	poll.votingContract
			// );
			// //voteMessage.timestamp = new Date().getTime(); - proove false is returned!
			const result = await postPollVoteMessage(pollVoteObjectHash, {
				message: pollVoteMessage,
				signature
			});

			console.log('Post result:', result);
			if (typeof result === 'string') {
				onSip18PollVote({ error: true, message: 'account already voted' });
			} else {
				onSip18PollVote({
					error: false,
					pollVoteMessage,
					message: 'Vote will ne batched and sent to contract'
				});
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
