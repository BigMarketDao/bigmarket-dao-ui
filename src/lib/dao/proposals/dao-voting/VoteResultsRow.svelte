<script lang="ts">
	import tick from '$lib/assets/tick.png';
	import cross from '$lib/assets/cross.svg';
	import { fmtMicroToStx, fmtNumber } from '$lib/utils';

	export let accountsFor = 0;
	export let accountsAgainst = 0;
	export let stxFor = 0;
	export let stxAgainst = 0;
</script>

<div class="mb-8 space-y-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
	<div class="items-stretch rounded-2xl p-8">
		<h3 class="mb-8 text-3xl text-white">Voting power</h3>
		<h3 class="text-1xl text-white">
			{fmtNumber(Math.floor(Number(fmtMicroToStx(stxFor + stxAgainst))))} stacks voted
		</h3>
	</div>
	<div class="relative rounded-2xl bg-primary-01 p-8">
		<div class="mb-5 flex justify-between">
			<div><img alt="correct" src={tick} /></div>
			<div>
				<span class="text-3xl font-extrabold"
					>{fmtNumber(Math.floor(Number(fmtMicroToStx(stxFor))))}</span
				> <span class="text-2xl font-bold">stacks</span>
			</div>
		</div>
		<div class="flex justify-between">
			<div><span class="text-1xl font-extrabold">Yes</span></div>
			<div><span class="text-1xl font-extrabold">{accountsFor} accounts</span></div>
		</div>
	</div>
	<div class="relative rounded-2xl bg-primary-02 p-8">
		<div class="mb-5 flex justify-between">
			<div><img alt="correct" src={cross} class="bg-transparent" /></div>
			<div>
				<span class="text-3xl font-extrabold"
					>{fmtNumber(Math.floor(Number(fmtMicroToStx(stxAgainst))))}</span
				> <span class="text-2xl font-bold">stacks</span>
			</div>
		</div>
		<div class="flex justify-between">
			<div><span class="text-1xl font-extrabold">No</span></div>
			<div><span class="text-1xl font-extrabold">{accountsAgainst} accounts</span></div>
		</div>
	</div>
</div>
