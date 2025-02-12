<script lang="ts">
	import { onMount } from 'svelte';
	import { getDaoConfig } from '$stores/store_helpers';
	import type { DaoHandle } from '$types/dao_types';
	import { configDaoStore } from '$stores/stores_config_dao';
	import { ArrowRightAltOutline } from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';

	let daos: Array<DaoHandle> = [
		{
			name: $configDaoStore.VITE_DOA_DEPLOYER + '.' + $configDaoStore.VITE_DOA,
			address: $configDaoStore.VITE_DOA_DEPLOYER + '.' + $configDaoStore.VITE_DOA
		}
	];
	let daoHandle: string;
	const gotoLink = async () => {
		goto('/dao/manager/' + daoHandle);
	};

	onMount(async () => {});
</script>

<svelte:head>
	<title>BigMarket DAO</title>
	<meta name="description" content="Governance of the Stacks Blockchain, Smart Contracts on Bitcoin" />
</svelte:head>

<div class="w-full py-4">
	<div class="my-2 flex w-full flex-col">
		<h2>Dao Manager</h2>
		{#if daos.length > 0}
			<p>Choose a DAO</p>
			<div class="mb-5 flex w-full flex-col justify-start text-blue-800">
				<label for="deployer">Select DAO</label>
				<select class="h-10 w-full rounded-lg border px-3 text-black" bind:value={daoHandle}>
					{#each daos as dao}
						<option value={dao.address}>{dao.name}</option>
					{/each}
				</select>
			</div>

			<div class="mt-8 flex w-full justify-center">
				<button on:click={() => gotoLink()} class="rounded bg-primary-500 px-6 py-2 font-semibold text-black transition duration-200 hover:bg-primary-600">
					<ArrowRightAltOutline class="inline" />
					Manage DAO
				</button>
			</div>
		{:else}
			<p>no daos</p>
		{/if}
	</div>
</div>
