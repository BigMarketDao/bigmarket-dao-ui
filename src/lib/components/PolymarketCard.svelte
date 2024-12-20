<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRightAltOutline } from 'flowbite-svelte-icons';

	export let title: string;
	export let description: string;
	export let target: string;
	export let label: string;
	export let selected: number;
</script>

<div
	class="col-span-1 p-5 border border-gray-300 rounded-lg cursor-pointer hover:bg-sand-200 hover:text-sand-800"
	on:focus
	on:mouseover={() => selected}
	role="button"
	tabindex="0"
>
	<div class="font-semibold text-primary-400 pb-2">{title}</div>
	<div class="text-sm font-mono">{description}</div>
	<div class="text-sm font-mono text-center text-secondary-500">
		{#if selected === 0}
			<div class="w-full mt-8 flex justify-center">
				<button
					on:click={() => goto(target)}
					class="bg-primary-500 hover:bg-primary-600 text-black font-semibold py-2 px-6 rounded transition duration-200"
				>
					<ArrowRightAltOutline class="inline" />
					{label}
				</button>
			</div>
		{/if}
	</div>
</div>
