<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { suiSessionStore } from '../stores/stores';
	import { configStore, setConfigByUrl } from '../stores/stores_config';
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/common/Footer.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	// import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	// const queryClient = new QueryClient({
	// 	defaultOptions: {
	// 		queries: {
	// 			enabled: browser
	// 		}
	// 	}
	// });

	const unsubscribe1 = suiSessionStore.subscribe(() => {});
	const unsubscribe3 = configStore.subscribe(() => {});

	onDestroy(async () => {
		unsubscribe1();
		unsubscribe3();
	});

	setConfigByUrl($page.url.searchParams);

	onMount(async () => {});
</script>

<div
	class="bg-gray-1000 min-h-screen bg-[url('$lib/assets/bg-lines.svg')] bg-cover font-extralight text-white"
>
	<div class="mx-auto min-h-[calc(100vh-160px)] px-6">
		<div class="relative flex min-h-screen flex-col">
			<div class="w-full"><Header /></div>
			<div class=" relative grow px-6">
				<!-- <QueryClientProvider client={queryClient}> -->
				<slot></slot>
				<!-- </QueryClientProvider> -->
			</div>
			<div class="w-full"><Footer /></div>
		</div>
	</div>
</div>
