<script lang="ts">
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import {
		Icon,
		Wifi,
		InformationCircle,
		XCircle,
		ExclamationCircle,
		CheckCircle
	} from 'svelte-hero-icons';

	export let message: string;
	export let bannerType = 'info';
	let clazz = '';
	export { clazz as class };

	let bannerClassList = '';
	onMount(async () => {
		if (bannerType === 'warning') {
			bannerClassList = clazz + ' bg-yellow-400';
		} else if (bannerType === 'danger') {
			bannerClassList = clazz + ' bg-error-400';
		} else if (bannerType === 'success') {
			bannerClassList = clazz + ' bg-success-400';
		} else if (bannerType === 'waiting' || bannerType === 'checking') {
			bannerClassList = clazz + ' bg-lightpurple/60';
		} else {
			bannerClassList = clazz + ' bg-sand-500/60';
		}
	});
</script>

<div class="flex rounded-md px-4 py-3 text-base text-black {bannerClassList}">
	<div class="flex items-center gap-2">
		<div class="self-start">
			{#if bannerType === 'warning'}
				<Icon src={ExclamationCircle} class="h-5 w-5 text-black" aria-hidden="true" />
			{:else if bannerType === 'danger'}
				<Icon src={XCircle} class="h-5 w-5 text-black" aria-hidden="true" />
			{:else if bannerType === 'success'}
				<Icon src={CheckCircle} class="h-5 w-5 text-black" aria-hidden="true" />
			{:else if bannerType === 'waiting'}
				<Spinner color="blue" class="mb-0.5 h-4 w-4" aria-hidden="true" />
			{:else if bannerType === 'checking'}
				<Icon src={Wifi} class="h-5 w-5 text-black" aria-hidden="true" />
			{:else}
				<Icon src={InformationCircle} class="h-5 w-5 text-black" aria-hidden="true" />
			{/if}
		</div>
		<div>
			<slot name="message">{@html message}</slot>
		</div>
	</div>
</div>
