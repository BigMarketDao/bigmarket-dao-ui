<script lang="ts">
	import { onMount } from 'svelte';

	export let logo: string;

	onMount(async () => {});
</script>

{#if logo}
	<img src={logo} alt="logo for poll" />
{/if}
