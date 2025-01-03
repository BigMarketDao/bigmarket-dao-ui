<script lang="ts">
	import { truncate } from '$lib/utils';
	import Banner from '../ui/Banner.svelte';

	export let contractId: string;
</script>

{#if contractId}
	<div class="mb-8 mt-0">
		<Banner
			bannerType={'warning'}
			message={'Dao contract: ' +
				truncate(contractId.split('.')[0]) +
				'.' +
				contractId.split('.')[1]}
		/>
	</div>
{/if}
