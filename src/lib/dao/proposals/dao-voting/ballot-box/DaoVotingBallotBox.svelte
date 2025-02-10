<script lang="ts">
	import { onMount } from 'svelte';
	import { Cl, Pc, PostConditionMode, contractPrincipalCV, falseCV, noneCV, someCV, trueCV, uintCV } from '@stacks/transactions';
	import { showContractCall } from '@stacks/connect';
	import { sessionStore } from '$stores/stores';
	import type { VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getStacksNetwork, getTransaction } from '@mijoco/stx_helpers/dist/stacks-node';
	import { getConfig, getDaoConfig } from '$stores/store_helpers';
	import { explorerTxUrl, getAddressId, getStxAddress, isLoggedIn } from '$lib/stacks/stacks-connect';
	import ChainUtils from '$lib/dao/ChainUtils';
	import Banner from '$lib/components/ui/Banner.svelte';
	import { fmtMicroToStx, fmtMicroToStxFormatted } from '$lib/utils';

	export let onTxVote;
	export let proposal: VotingEventProposeProposal;
	export let votingPower: number = 0;

	let amountStx = fmtMicroToStx(votingPower);
	const balanceAtHeightF = fmtMicroToStxFormatted(votingPower);

	let errorMessage: string | undefined;
	let txId: string;
	let canVote = true;
	$: explorerUrl = explorerTxUrl(txId);

	$: amountStx = fmtMicroToStx(votingPower);
	const castVote = async (vfor: boolean) => {
		const deployer = proposal.daoContract.split('.')[0];
		if (!isLoggedIn()) {
			errorMessage = 'Please connect your wallet';
			return;
		}
		// if (amountStx === 0 || amountStx < 1) {
		// 	errorMessage = 'Minimum voting power is 1 STX';
		// 	return;
		// }
		if (amountStx > votingPower) {
			errorMessage = 'Maximum voting power is ' + balanceAtHeightF + ' STX';
			amountStx = votingPower;
			return;
		}
		let forCV = trueCV();
		if (!vfor) {
			forCV = falseCV();
		}
		// const amountUSTX = ChainUtils.toOnChainAmount(amount)
		const amountUSTX = ChainUtils.toOnChainAmount(amountStx);
		const amountCV = uintCV(amountUSTX);
		const votingContractName = proposal.votingContract.split('.')[1];
		const proposalCV = contractPrincipalCV(proposal.proposal.split('.')[0], proposal.proposal.split('.')[1]);
		const reclaimProposalCV = someCV(contractPrincipalCV(proposal.proposal.split('.')[0], proposal.proposal.split('.')[1]));
		let functionArgs;
		if (votingContractName === 'bde001-proposal-voting-tokenised') {
			functionArgs = [amountCV, forCV, proposalCV, noneCV()];
		} else {
			functionArgs = [amountCV, forCV, proposalCV];
		}

		const postConditions = [];
		const formattedToken = (getDaoConfig().VITE_DOA_DEPLOYER + '.' + getDaoConfig().VITE_DAO_GOVERNANCE_TOKEN) as `${string}.${string}`;
		const postConditionFt = Pc.principal(getStxAddress()).willSendEq(amountUSTX).ft(formattedToken, 'bdg-token');
		postConditions.push(postConditionFt);

		await showContractCall({
			network: getStacksNetwork(getConfig().VITE_NETWORK),
			postConditions,
			postConditionMode: PostConditionMode.Deny,
			contractAddress: deployer,
			contractName: proposal.votingContract.split('.')[1],
			functionName: 'vote',
			functionArgs,
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

	if (votingPower === 0 || votingPower < 1) {
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
				if (tx && tx.tx_status === 'pending' && tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) {
					txId = potentialTxId;
				} else {
					if (tx.sender_address === $sessionStore.keySets[getConfig().VITE_NETWORK].stxAddress) {
						localStorage.removeItem('VOTED_TXID_3' + getAddressId());
					}
				}
			}
		}
		amountStx = fmtMicroToStx(votingPower);
	});
</script>

<div>
	<div class="flex flex-col gap-y-4">
		{#if txId}
			<div class="mb-3 max-w-xl">
				<Banner bannerType={'warning'} message={'Your vote is in the mempool and should be confirmed soon. See <a href="' + explorerUrl + '" target="_blank">explorer!</a>'} />
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
					VOTE YES
				</button>
				<button
					on:click={() => {
						errorMessage = undefined;
						castVote(false);
					}}
					class="w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-bitcoinorange bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
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
