<script lang="ts">
	import { onMount } from 'svelte';
	import { type SignatureData } from '@stacks/connect';
	import { sessionStore } from '$stores/stores';
	import {
		dataHashSip18Vote,
		verifySip18VoteSignature,
		type VoteMessage,
		type VotingEventProposeProposal
	} from '@mijoco/stx_helpers/dist/index';
	import { getTransaction } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig } from '$stores/store_helpers';
	import { domain, explorerTxUrl, getAddressId, getStxAddress } from '$lib/stacks/stacks-connect';
	import Banner from '$lib/components/ui/Banner.svelte';
	import FormatUtils from '$lib/dao/FormatUtils';
	import { fmtMicroToStxFormatted } from '$lib/utils';
	import { newVoteMessage, postVoteMessage, signProposal } from '$lib/dao/voting_sip18';
	import { verifySignature, verifySignedStructuredData } from '$lib/dao/dao_api';

	export let proposal: VotingEventProposeProposal;
	export let totalBalanceUstx: number = 0;
	export let onSip18Vote;
	let progress = 0;

	let errorMessage: string | undefined;
	let txId: string;
	let canVote = true;
	$: explorerUrl = explorerTxUrl(txId);

	$: amountStx = totalBalanceUstx;
	const balanceAtHeightF = fmtMicroToStxFormatted(totalBalanceUstx);

	const castVote = async (forVote: boolean) => {
		const voteMessage: VoteMessage = await newVoteMessage(
			proposal,
			forVote,
			amountStx,
			getStxAddress()
		);
		await signProposal(voteMessage, async function (signature: SignatureData) {
			console.log('Signature of the message', signature.signature);
			const hash = dataHashSip18Vote(
				getConfig().VITE_NETWORK,
				getConfig().VITE_PUBLIC_APP_NAME,
				getConfig().VITE_PUBLIC_APP_VERSION,
				voteMessage
			);
			console.log('domain:', domain);
			console.log('hash:' + hash);
			const sigres = verifySip18VoteSignature(
				getConfig().VITE_NETWORK,
				getConfig().VITE_PUBLIC_APP_NAME,
				getConfig().VITE_PUBLIC_APP_VERSION,
				voteMessage,
				signature.publicKey,
				signature.signature
			);
			if (!sigres) {
				//throw new Error('Signature is not valid');
			}
			const valid = await verifySignature(
				voteMessage,
				hash,
				signature.signature,
				proposal.votingContract
			);
			//voteMessage.timestamp = new Date().getTime(); - proove false is returned!
			const valid2 = await verifySignedStructuredData(
				voteMessage,
				hash,
				signature.signature,
				proposal.votingContract
			);
			const result = await postVoteMessage(hash, { message: voteMessage, signature });

			console.log('Post result:', result);
			onSip18Vote({ result, voteMessage });
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
					message={`Voting power at block <span class="text-bold">${FormatUtils.fmtNumber(proposal.proposalData?.startBlockHeight)}</span> is <span class="text-bold">${balanceAtHeightF}</span> STX.`}
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
