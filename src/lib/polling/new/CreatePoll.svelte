<script lang="ts">
	import { sessionStore } from '$stores/stores';
	import { onMount } from 'svelte';
	import { configStore } from '$stores/stores_config';
	import { Cl, Pc, PostConditionMode } from '@stacks/transactions';
	import { getStacksNetwork } from '@mijoco/stx_helpers/dist/index';
	import { openContractCall, type SignatureData } from '@stacks/connect';
	import Banner from '../../components/ui/Banner.svelte';
	import { storedWallet } from '$stores/wallet';
	import type { OpinionPoll } from '$types/polling_types';
	import { createHashForPoll, signNewPoll } from '$lib/polling/polling';
	import { getStxAddress, isLoggedIn, loginStacksFromHeader } from '$lib/stacks/stacks-connect';
	import { configDaoStore } from '$stores/stores_config_dao';

	let inited = false;
	let progress = 0;

	let errorMessage: string = '';
	let result: string | undefined = undefined;
	const account = $storedWallet?.accounts[0];
	$: explorerUrl = `${$configStore.VITE_STACKS_API}/txid/${result}?chain=${$configStore.VITE_NETWORK}`;

	let template: OpinionPoll = {
		admin: getStxAddress(),
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
		startBitcoinHeight: 0,
		stopBitcoinHeight: 0,
		name: '',
		description: ''
	};

	let examplePoll: OpinionPoll = {
		name: 'Best Chain?',
		description: 'Whats the chain to build on in 2025?',
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
		startBitcoinHeight: ($sessionStore?.poxInfo?.current_burnchain_block_height || 0) + 50,
		stopBitcoinHeight: ($sessionStore?.poxInfo?.current_burnchain_block_height || 0) + 450,
		admin: getStxAddress()
	};

	let txId: string;

	const login = async () => {
		loginStacksFromHeader(document);
	};

	const getSignature = async () => {
		examplePoll.hash = createHashForPoll(examplePoll);
		await signNewPoll(examplePoll, function (sigData: SignatureData) {
			console.log('Signature of the message', sigData.signature);
			console.log('Use public key:', sigData.publicKey);
			progress++;
		});
	};

	const confirmPoll = async () => {
		const postCondition = Pc.principal(getStxAddress())
			.willSendEq($configStore.VITE_POLL_PAYMENT_USTX)
			.ustx();
		await openContractCall({
			network: getStacksNetwork($configStore.VITE_NETWORK),
			postConditions: [postCondition],
			postConditionMode: PostConditionMode.Deny,
			contractAddress: $configDaoStore.VITE_DOA_DEPLOYER,
			contractName: $configDaoStore.VITE_DOA,
			functionName: 'add-poll',
			functionArgs: [Cl.bufferFromHex(examplePoll.hash!)],
			onFinish: (data: any) => {
				txId = data.txId;
				console.log('finished contract call!', data);
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

<svelte:head>
	<title>Create a new poll</title>
	<meta
		name="description"
		content="Quickly create an opinion poll to gauge the temerature of your community"
	/>
</svelte:head>

<div class="relative mx-[50px] py-6 text-black md:px-6">
	{#if inited}
		<div class="my-8 flex w-full flex-col rounded-2xl bg-[#F4F3F0]">
			<div
				class="relative overflow-hidden py-10 md:grid md:auto-cols-auto md:grid-flow-col md:gap-12"
			>
				<div class="bg-warning-01 flex flex-col gap-y-2">
					<div class="mb-4">
						<h2 class="text-2xl text-[#131416]">Create a Poll</h2>
					</div>
					<div class="min-w-xl relative mb-4 space-y-3 rounded-lg bg-[#E6E4E2] px-6 py-6">
						<div>
							<div class="flex flex-col gap-y-4">
								{#if progress === 1}
									<div class="max-w-xl">
										<Banner
											bannerType={'warning'}
											message={'Click confirm to transfer payment and to setup your opinion poll.'}
										/>
									</div>
									<button
										on:click={() => {
											errorMessage = '';
											confirmPoll();
										}}
										class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
									>
										Confirm Poll
									</button>
								{:else if progress === 2}
									<div class="max-w-xl">
										<Banner
											bannerType={'warning'}
											message={'Your contracts are being deployed. See <a href="' +
												explorerUrl +
												'" target="_blank">explorer!</a>' +
												result}
										/>
									</div>
								{:else}
									<h2 class="text-1xl font-bold text-[#131416]">Poll info</h2>
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
									<h2 class="text-1xl font-bold text-[#131416]">Start / end</h2>
									<p class="text-sm font-extralight">polls run in bitcoin block times</p>
									<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
										<label for="project-start-height" class="">Start height</label>
										<input
											id="project-start-height"
											class="rounded-lg border-gray-800 p-2 text-black"
											bind:value={template.startBitcoinHeight}
											type="text"
											aria-describedby="project-start-height"
										/>
									</div>
									<div class="bottom-1 mb-2 flex w-full flex-col justify-start">
										<label for="project-end-height" class="">End height</label>
										<input
											id="project-end-height"
											class="rounded-lg border-gray-800 p-2 text-black"
											bind:value={template.stopBitcoinHeight}
											type="text"
											aria-describedby="project-end-height"
										/>
									</div>
									<h2 class="text-1xl font-bold text-[#131416]">Social Integrations</h2>
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
									<div class="flex w-full justify-start gap-x-4">
										{#if isLoggedIn()}
											<button
												on:click={() => {
													errorMessage = '';
													getSignature();
												}}
												class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
											>
												Create Poll
											</button>
										{:else}
											<button
												on:click={() => {
													errorMessage = '';
													login();
												}}
												class="bg-success-01 w-[150px] items-center justify-center gap-x-1.5 rounded-xl border border-black bg-black px-4 py-2 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500/50 md:inline-flex"
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
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
