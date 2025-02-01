<script lang="ts">
	import { sessionStore } from '$stores/stores';
	import { openContractDeploy } from '@stacks/connect';
	import { lookupContract, type InFlight } from '@mijoco/stx_helpers/dist/index';
	import type { DaoStore, FundingData, VotingEventProposeProposal } from '@mijoco/stx_helpers/dist/index';
	import { getConfig } from '$stores/store_helpers';
	import { onMount } from 'svelte';
	import { configStore } from '$stores/stores_config';
	import { configDaoStore } from '$stores/stores_config_dao';
	import { page } from '$app/state';
	import type { DaoConfig } from '$lib/config_dao';
	import Banner from '$lib/components/ui/Banner.svelte';
	import { getStxAddress } from '$lib/stacks/stacks-connect';
	import FundingSubmission from './FundingSubmission.svelte';
	import CoreSubmission from './CoreSubmission.svelte';
	import ProposalDeploymentForm from './ProposalDeploymentForm.svelte';
	import { fetchProposedProposals, getProposalLatest } from '$lib/dao/proposals';

	const account = $sessionStore.keySets[$configStore.VITE_NETWORK];
	export let daoContractAddress: string;
	let contractId: string;
	let fundingData: FundingData | undefined;
	let contract: any | undefined;
	let fundedSubmission = true;
	let submission: string = '';
	const fundedSubmissionContractId = `${daoContractAddress}.${$configDaoStore.VITE_DOA_FUNDED_SUBMISSION_EXTENSION}`;
	const coreSubmissionContractId = `${daoContractAddress}.${'bde003-core-proposals-tokenised'}`;
	let txId: string | undefined;

	let message: string | undefined;

	const lookup = async () => {
		message = undefined;
		if (!contractId) return;
		const potentialProp = await getProposalLatest(contractId);
		if (potentialProp && potentialProp.proposal) {
			message = 'This proposal has already been proposed.';
			return;
		}
		message = 'Processing this proposal and adding to DAO';
		contract = await lookupContract($configStore.VITE_STACKS_API, contractId);
		message = 'contract found: ' + contract.tx_id;
		if (contract && contract.statusCode > 200) {
			contract = undefined;
			message = 'contract not found: ';
		}
	};

	const processProposal = async (fundedSubmission: boolean) => {
		if (!contract) {
			message = 'Contract not found - please deploy your proposal';
			return;
		}
		if (fundedSubmission) submission = 'public';
		else submission = 'core';
		message = 'Processing this proposal and adding to DAO';
		if (contract) {
			if (contract && !contract.error) {
				fundingData = {
					funding: 0,
					parameters: {
						fundingCost: 500000,
						proposalDuration: 72,
						proposalStartDelay: 6
					}
				};
				message = undefined;
			} else {
				message = 'Contract not found';
			}
		}
	};

	let canSubmit = true; //$settings.userProperties?.find((o) => o.functionName === 'edg-has-percentage-balance')?.value?.value || false;
	if (!canSubmit) {
		canSubmit = getStxAddress() === daoContractAddress;
	}
	let showNoop = false;
	const contractSource = `
    ;; DAO: Bitcoin DAO
    ;; Title: <title>
    ;; Author: <author>
    ;; Synopsis: <synopsis>
    ;; Description: <description>

    (impl-trait '${daoContractAddress}.proposal-trait.proposal-trait)

    (define-public (execute (sender principal))
            (ok true)
    )
    `;
	let newProposal: VotingEventProposeProposal;
	let showDeployButton = false;
	let updated = false;
	let replacedSource = contractSource;
	let contractName = '';
	const addNewPoll = (e: {
		detail: {
			contractName: string;
			title: string;
			author: string;
			synopsis: string;
			description: string;
		};
	}) => {
		contractName = e.detail.contractName;
		newProposal = {
			proposalMeta: {
				title: e.detail.title,
				author: '',
				dao: 'Ecosystem',
				description: '',
				synopsis: ''
			},
			proposer: getStxAddress(),
			funding: {
				funding: 0,
				parameters: { fundingCost: 0, proposalDuration: 0, proposalStartDelay: 0 }
			},
			status: { name: 'deploying', color: '', colorCode: '' },
			contractId: getStxAddress() + '.' + contractName,
			contract: {
				source: replacedSource,
				publish_height: 0
			}
		} as unknown as VotingEventProposeProposal;
		replacedSource = contractSource.replace('<title>', e.detail.title);
		replacedSource = replacedSource.replace('<author>', e.detail.author);
		replacedSource = replacedSource.replace('<synopsis>', e.detail.synopsis);
		replacedSource = replacedSource.replace('<description>', e.detail.description);
		showDeployButton = true;
		updated = true;
	};

	const fileLoaded = (e: { detail: { contractName: string; source: string } }) => {
		replacedSource = e.detail.source;
		contractName = e.detail.contractName;
		showDeployButton = true;
		newProposal = {
			proposalMeta: {
				title: contractName,
				author: '',
				dao: 'Ecosystem',
				description: '',
				synopsis: ''
			},
			proposer: getStxAddress(),
			funding: {
				funding: 0,
				parameters: { fundingCost: 0, proposalDuration: 0, proposalStartDelay: 0 }
			},
			status: { name: 'deploying', color: '', colorCode: '' },
			contractId: getStxAddress() + '.' + contractName,
			contract: {
				source: replacedSource,
				publish_height: 0
			}
		} as unknown as VotingEventProposeProposal;
	};

	const deployContract = async () => {
		await openContractDeploy({
			codeBody: replacedSource,
			contractName: contractName,
			onFinish: (data) => {
				configDaoStore.update((conf: DaoConfig) => {
					//if (!conf.daoData) conf.daoData = {} as InFlight;
					// conf.daoData = {
					// 	name: 'Deploy',
					// 	txid: data.txId
					// };
					return conf;
				});
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	};

	$: newSource = replacedSource;
	$: newSourceValid = replacedSource.indexOf(daoContractAddress + '.proposal-trait.proposal-trait') > -1 || getStxAddress() === daoContractAddress;
	$: explorerUrl = $configStore.VITE_STACKS_EXPLORER + '/txid/' + txId + '?chain=' + $configStore.VITE_NETWORK;

	onMount(async () => {
		const tempId = page.url.searchParams.get('tentativeCId');
		if (tempId) {
			contractId = tempId;
			await lookup();
			processProposal(true);
		}
	});
</script>

<svelte:head>
	<title>Bitcoin DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="w-full">
	<div class="flex w-full flex-col gap-y-4">
		<p>Enter proposal contract id</p>
		<input bind:value={contractId} on:keyup={() => lookup()} type="text" id="propose-contract" class="w-full rounded-md border p-3 text-black" />
		{#if message}
			<div class="my-3">
				<Banner bannerType={'info'} {message} />
			</div>
		{/if}
		{#if contractId && contract}
			<div><h1>Choose proposal submission type</h1></div>
			<div class="flex">
				<div class="w-1/4">
					<input
						type="radio"
						name="public"
						value={submission}
						checked={submission === 'public'}
						on:click={() => {
							processProposal(true);
						}}
					/>
					<label for="submit1">Public proposal</label>
				</div>
				{#if $sessionStore.userSettings.executiveTeamMember}
					<div class="w-1/4">
						<input
							type="radio"
							name="core"
							value={submission}
							checked={submission === 'core'}
							on:click={() => {
								processProposal(false);
							}}
						/>
						<label for="submit1">Core team proposal</label>
					</div>
				{/if}
			</div>
		{/if}
		{#if contract && contractId && fundingData}
			{#if submission === 'public'}
				<FundingSubmission {contractId} {fundingData} submissionContractId={fundedSubmissionContractId} />
			{:else if submission === 'core'}
				<CoreSubmission {contractId} submissionContractId={coreSubmissionContractId} />
			{/if}
		{/if}
	</div>

	<div class="flex flex-col gap-y-5">
		{#if showNoop}
			<div class="flex flex-col">
				<div>
					<pre class="source-code">{newSource}</pre>
				</div>
				<div>
					{#if !showDeployButton}
						<ProposalDeploymentForm on:addNewPoll={addNewPoll} />
					{:else if txId}
						<div>
							<a href={explorerUrl} target="_blank">View on explorer</a>
						</div>
					{:else}
						<div class="mt-5 text-center">
							{#if newSourceValid}
								<p>Contract ready to be deployed - once its fully deployed crowd fund support for this proposal</p>
								<button
									class="btn btn-warning rounded"
									on:click|preventDefault={() => {
										deployContract();
									}}>Deploy proposal</button
								>
							{:else}
								<p class="bg-danger p-3">Contract is not ready to be deployed - please check the contract implements the trait correctly - using the full address given above.</p>
								<button disabled class="btn text-danger rounded">Proposal Trait Invalid</button>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/if}
		<div>
			{#if txId}
				<div>
					<a href={explorerUrl} target="_blank">View on explorer</a>
				</div>
			{/if}
		</div>
	</div>
</div>
