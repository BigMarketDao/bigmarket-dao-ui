<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowRightAltOutline } from 'flowbite-svelte-icons';

	export let title: string;
	export let description: string | undefined;
	export let target: string;
	export let label: string;
	export let selected: number;

	const gotoLink = async () => {
		if (target.startsWith('https')) {
			typeof window !== 'undefined' ? window.location.replace(target) : '';
		} else {
			goto(target);
		}
	};
</script>

<div
	class="col-span-1 cursor-pointer items-stretch rounded-lg border border-gray-300 p-5 hover:bg-black hover:text-white"
	on:focus
	on:mouseover={() => selected}
	role="button"
	tabindex="0"
>
	<div class="pb-2 text-2xl font-semibold text-primary-400">{title}</div>
	{#if description}
		<div class="pb-2 font-semibold text-white">{description}</div>
	{/if}
	<div class="content-stretch items-stretch font-mono text-sm">
		<slot name="longDescription"></slot>
	</div>
	<div class="text-secondary-500 self-stretch text-center font-mono text-sm">
		{#if selected === 0}
			<div class="mt-8 flex w-full justify-center">
				<button
					on:click={() => gotoLink()}
					class="rounded bg-bitcoinorange px-6 py-2 font-semibold text-black transition duration-200 hover:bg-primary-600"
				>
					<ArrowRightAltOutline class="inline" />
					{label}
				</button>
			</div>
		{/if}
	</div>
</div>
