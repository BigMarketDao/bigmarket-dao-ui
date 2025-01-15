<script lang="ts">
	import { onMount } from 'svelte';
	import { fmtMicroToStx, fmtMicroToStxFormatted } from '$lib/utils';
	import { Icon, PencilSquare } from 'svelte-hero-icons';
	import BannerSlot from '$lib/components/ui/BannerSlot.svelte';

	export let onVotingPowerChange;
	export let onVotingTypeChange;
	export let totalBalanceUstx: number = 0;
	export let votingPower: number = 0;
	export let txVoting = false;
	$: message = txVoting
		? `Vote by sending a Stacks transaction - you will need enough STX pay the gas fee.  <a href="/" on:click|preventDefault=${() => (txVoting = !txVoting)}>change</a>`
		: `Vote by signing a message - voting is free. <a href="/" on:click|preventDefault=${() => (txVoting = !txVoting)}>change</a>`;

	let amountStx = 0;
	let editing = false;
	const balanceAtHeightF = fmtMicroToStxFormatted(totalBalanceUstx);

	const updateTxVoting = () => {
		onVotingTypeChange(!txVoting);
	};

	onMount(async () => {
		if (votingPower === 0) votingPower = totalBalanceUstx;
		amountStx = fmtMicroToStx(totalBalanceUstx);
	});
</script>

<div class="">
	<BannerSlot bannerType={'warning'}>
		<div class="flex w-full justify-between">
			<div>
				<a
					class="font-medium text-black underline"
					href="/"
					on:click|preventDefault={() => updateTxVoting()}
					><Icon src={PencilSquare} class="mb-1 inline h-5 w-5" aria-hidden="true" />
					{#if txVoting}
						Vote by sending a Stacks transaction - you will need enough STX to pay the gas fee
					{:else}
						Vote by signing a message - voting is free
					{/if}
				</a>
			</div>
		</div>
	</BannerSlot>
</div>

<div class="my-5 max-w-xl">
	<div class="flex flex-col gap-y-5 rounded-md">
		<div class="text-white">
			<div>
				<div class="start">
					<a href="/" on:click|preventDefault={() => (editing = !editing)}
						><Icon src={PencilSquare} class="mb-1 inline h-5 w-5" aria-hidden="true" />
						<span class="underline">Voting power is {fmtMicroToStxFormatted(votingPower)} STX</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

{#if editing}
	<div class="mb-5 flex w-full flex-col justify-start">
		<input
			class="w-1/2 rounded-lg border-gray-800 p-2 text-black"
			bind:value={amountStx}
			on:keyup={onVotingPowerChange(amountStx)}
			type="number"
			id="Contribution"
			aria-describedby="Contribution"
		/>
	</div>
{/if}
