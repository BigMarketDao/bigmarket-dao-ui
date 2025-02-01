<script lang="ts">
	import { truncate } from '$lib/utils';
	import Banner from '../ui/Banner.svelte';

	export let daoContractId: string;
</script>

{#if daoContractId}
	<div class="mb-8 mt-0">
		<Banner bannerType={'warning'} message={'Dao contract: ' + truncate(daoContractId.split('.')[0]) + '.' + daoContractId.split('.')[1]} />
	</div>
{/if}
