<script lang="ts">
	import { sessionStore } from '$stores/stores';
	import { onMount } from 'svelte';
	import { configStore } from '$stores/stores_config';
	import {
		bufferCV,
		noneCV,
		Pc,
		PostConditionMode,
		principalCV,
		someCV,
		tupleCV,
		uintCV
	} from '@stacks/transactions';
	import {
		dataHashSip18,
		getStacksNetwork,
		opinionPollToTupleCV,
		type Auth,
		type OpinionPoll,
		type StoredOpinionPoll
	} from '@mijoco/stx_helpers/dist/index';
	import { openContractCall } from '@stacks/connect';
	import { postCreatePollMessage } from '$lib/polling/polling';
	import { getStxAddress, isLoggedIn, loginStacksFromHeader } from '$lib/stacks/stacks-connect';
	import { fmtMicroToStx } from '$lib/utils';
	import Gating from './Gating.svelte';
	import { getConfig } from '$stores/store_helpers';
	import { hexToBytes } from '@stacks/common';
	import { signAdminMessage } from '$lib/dao/voting_sip18';

	export let pollContract: string;
	export let onPollSubmit;
	let inited = false;
	let startDelay = 5;
	let endDelay = 500;
	let pollSetupFee = $configStore.VITE_POLL_PAYMENT_USTX;
	let merkelRoot: string | undefined;
	let contractIds: Array<string> | undefined;

	let errorMessage: string = '';
	let result: string | undefined = undefined;
	let pollMessage: any;
	$: explorerUrl = `${$configStore.VITE_STACKS_API}/txid/${result}?chain=${$configStore.VITE_NETWORK}`;

	let template: OpinionPoll = {
		proposer: getStxAddress(),
		logo: '',
		social: {
			twitter: {
				projectHandle: undefined
			},
			discord: {
				serverId: undefined
			},
			website: {
				url: undefined
			}
		},
		createdAt: 0,
		startBurnHeight: 0,
		endBurnHeight: 0,
		name: '',
		description: ''
	};

	let examplePoll: OpinionPoll = {
		name: 'Best Chain?',
		description: 'Whats the chain to build on in 2025?',
		logo: '',
		social: {
			twitter: {
				projectHandle: 'Stacks'
			},
			discord: {
				serverId: '1306302974515089510'
			},
			website: {
				url: 'https://www.stacks.co/'
			}
		},
		createdAt: new Date().getTime(),
		startBurnHeight: ($sessionStore?.poxInfo?.current_burnchain_block_height || 0) + startDelay,
		endBurnHeight: ($sessionStore?.poxInfo?.current_burnchain_block_height || 0) + endDelay,
		proposer: getStxAddress()
	};

	let txId: string;

	const login = async () => {
		loginStacksFromHeader(document);
	};

	const getSignature = async () => {
		examplePoll.createdAt = new Date().getTime();
		pollMessage = opinionPollToTupleCV(
			examplePoll.name,
			examplePoll.description,
			examplePoll.proposer,
			examplePoll.createdAt,
			examplePoll.startBurnHeight,
			examplePoll.endBurnHeight
		);
		const dataHash = dataHashSip18(
			getConfig().VITE_NETWORK,
			getConfig().VITE_PUBLIC_APP_NAME,
			getConfig().VITE_PUBLIC_APP_VERSION,
			pollMessage
		);
		await signAdminMessage(async function (auth: Auth) {
			const poll: StoredOpinionPoll = {
				...examplePoll,
				objectHash: dataHash,
				processed: false,
				signature: auth.signature.signature,
				publicKey: auth.signature.publicKey,
				merkelRoot: merkelRoot,
				contractIds: contractIds
			};
			const result = await postCreatePollMessage(poll, auth);
			if (typeof result === 'string') {
				errorMessage = result;
			} else {
				confirmPoll(dataHash);
			}
		});
	};

	const handleGenerateRoot = (
		newMerkelRoot: string | undefined,
		newContractIds: Array<string> | undefined
	) => {
		merkelRoot = newMerkelRoot;
		contractIds = newContractIds;
	};

	const confirmPoll = async (dataHash: string) => {
		const metadataHash = bufferCV(hexToBytes(dataHash)); // Assumes the hash is a string of 32 bytes in hex format
		const merkel = merkelRoot ? someCV(bufferCV(hexToBytes(merkelRoot))) : noneCV();
		const pollData = tupleCV({
			'end-burn-height': uintCV(template.endBurnHeight),
			'start-burn-height': uintCV(template.startBurnHeight)
		});

		const postCondition = Pc.principal(getStxAddress())
			.willSendEq($configStore.VITE_POLL_PAYMENT_USTX)
			.ustx();
		await openContractCall({
			network: getStacksNetwork($configStore.VITE_NETWORK),
			postConditions: [postCondition],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: pollContract.split('.')[0],
			contractName: pollContract.split('.')[1],
			functionName: 'add-opinion-poll',
			functionArgs: [metadataHash, pollData, merkel],
			onFinish: (data: any) => {
				txId = data.txId;
				console.log('finished contract call!', data);
				onPollSubmit(txId);
			},
			onCancel: () => {
				console.log('popup closed!');
			}
		});
	};

	onMount(async () => {
		template = examplePoll;
		inited = true;
	});
</script>

<div class=" py-6 text-white">
	{#if inited}
		<div class="my-8 flex w-full flex-row gap-x-3">
			<div class="order-2 flex w-[350px] flex-col gap-y-5">
				<h1 class="text-2xl">Bitcoin-Dao</h1>
				<p>
					A charge of <span class="text-bitcoinorange">{fmtMicroToStx(pollSetupFee)} STX</span> is required
					to set up an opinion polls.
				</p>
				<p>
					Fees are disbursed to the Bitcoin DAO treasury and used to support ongoing development
					efforts on Stacks / Bitcoin layer 2 DAO community.
				</p>
				<ul class="ms-5">
					<li class="list-disc">Free for end users</li>
					<li class="list-disc">Free social integrations</li>
				</ul>
			</div>
			<div class="w-full rounded-lg border border-white p-2 py-10">
				<div class="mb-4">
					<h2 class="text-2xl">New Opinion Poll</h2>
				</div>
				<div class="">
					<div>
						<div class="flex flex-col gap-y-4">
							<div class="">
								<h2 class="text-1xl font-bold">Poll info</h2>
								<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
									<label for="project-name" class="">name of poll</label>
									<input
										id="project-name"
										class="rounded-lg border-gray-800 p-2 text-black"
										bind:value={template.name}
										type="text"
										aria-describedby="projectName"
									/>
								</div>
								<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
									<label for="project-name" class="">enter short description</label>
									<input
										id="project-name"
										class="rounded-lg border-gray-800 p-2 text-black"
										bind:value={template.description}
										type="text"
										aria-describedby="projectName"
									/>
								</div>
							</div>
							<div class="">
								<h2 class="text-1xl font-bold">Start / end</h2>
								<p class="text-sm font-extralight">polls run in bitcoin block times</p>
								<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
									<label for="project-start-height" class=""
										>Start height (now plus {startDelay})</label
									>
									<input
										id="project-start-height"
										class="rounded-lg border-gray-800 p-2 text-black"
										bind:value={template.startBurnHeight}
										type="text"
										aria-describedby="project-start-height"
									/>
								</div>
								<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
									<label for="project-end-height" class="">End height (now plus {endDelay})</label>
									<input
										id="project-end-height"
										class="rounded-lg border-gray-800 p-2 text-black"
										bind:value={template.endBurnHeight}
										type="text"
										aria-describedby="project-end-height"
									/>
								</div>
							</div>
							<div class="">
								<Gating onGenerateRoot={handleGenerateRoot} />
							</div>
							<div class="">
								<h2 class="text-1xl font-bold">Social Integrations</h2>
								<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
									<label for="project-handle" class="">X project handle</label>
									<input
										id="project-handle"
										class="rounded-lg border-gray-800 p-2 text-black"
										bind:value={template.social.twitter.projectHandle}
										type="text"
										aria-describedby="project-handle"
									/>
								</div>
								<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
									<label for="project-name" class="">Discord server Id</label>
									<input
										id="project-serverId"
										class="rounded-lg border-gray-800 p-2 text-black"
										bind:value={template.social.discord.serverId}
										type="text"
										aria-describedby="project-serverId"
									/>
								</div>
								<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
									<label for="project-name" class="">Website Url</label>
									<input
										id="project-website"
										class="rounded-lg border-gray-800 p-2 text-black"
										bind:value={template.social.website.url}
										type="text"
										aria-describedby="project-website"
									/>
								</div>
							</div>
							<div class="flex w-full justify-start gap-x-4">
								{#if isLoggedIn()}
									<button
										on:click={() => {
											errorMessage = '';
											getSignature();
										}}
										class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-bitcoinorange bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
									>
										Create Poll
									</button>
								{:else}
									<button
										on:click={() => {
											errorMessage = '';
											login();
										}}
										class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-bitcoinorange bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
									>
										Connect Wallet
									</button>
								{/if}
							</div>
							{#if errorMessage}
								<div class="flex w-full justify-start gap-x-4">
									{@html errorMessage}
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
