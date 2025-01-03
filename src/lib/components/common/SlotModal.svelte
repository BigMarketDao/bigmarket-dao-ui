<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let onClose: () => void;

	function closeModal() {
		if (onClose) {
			onClose();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}

	onMount(async () => {
		window.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeyDown);
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
	style="@apply animate-fade-in"
	on:click={closeModal}
>
	<div
		class="relative h-1/2 w-2/3 overflow-auto rounded-lg border border-white bg-black p-8 text-white shadow-lg transition-transform duration-300"
		on:click|stopPropagation
	>
		<slot name="modalBody"></slot>

		<button
			on:click={closeModal}
			class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
		>
			&times;
		</button>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fade-in 0.3s ease-in-out;
	}
</style>
