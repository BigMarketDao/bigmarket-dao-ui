<script>
	import { Progressbar } from 'flowbite-svelte';

	export let startBurnHeight;
	export let stopBurnHeight;
	export let currentBurnHeight;

	// Calculate the progress percentage
	$: progress = (() => {
		if (currentBurnHeight < startBurnHeight) {
			return 0;
		} else if (currentBurnHeight >= startBurnHeight && currentBurnHeight < stopBurnHeight) {
			return ((currentBurnHeight - startBurnHeight) / (stopBurnHeight - startBurnHeight)) * 100;
		} else {
			return 100;
		}
	})();

	// Determine the state for styling purposes
	$: state = (() => {
		if (currentBurnHeight < startBurnHeight) {
			return 'bg-gray-200'; // Not started
		} else if (currentBurnHeight >= startBurnHeight && currentBurnHeight < stopBurnHeight) {
			return 'bg-bitcoinorange'; // In progress
		} else {
			return 'bg-green-600'; // Completed
		}
	})();
</script>

<!-- Progress Bar Display -->
<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
	<div class={`h-2.5 rounded-full ${state}`} style="width: {progress}%"></div>
</div>
