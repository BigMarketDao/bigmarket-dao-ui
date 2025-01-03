<script>
	import ProposalList from '$lib/dao/manager/proposals/ProposalList.svelte';
	import ProposalListPublic from '$lib/dao/manager/proposals/ProposalListPublic.svelte';
	import PolymarketCard from './PolymarketCard.svelte';

	$: selected = 0;
</script>

<!-- IntroPage.svelte -->
<div
	class="mt-10 flex min-h-screen flex-col items-center justify-start bg-transparent p-6 text-white"
>
	<!-- Header Section -->
	<h1 class="mb-4 text-4xl font-bold text-primary-500">Big Market</h1>
	<p class="mb-2 max-w-3xl text-center text-lg text-gray-300">Al things DAO start here!</p>

	<!-- Data Collection Explanation -->
	<div class="w-full max-w-3xl rounded-lg p-6 shadow-lg">
		<!-- <h2 class="w-full text-2xl font-semibold mb-4 text-primary-500">What to prove?</h2> -->
		<div class="space-4 grid min-h-[300px] grid-cols-1 gap-4 md:grid-cols-3">
			<!-- <PolymarketCard
				target={'https://stx.eco'}
				label={'Vote Now'}
				title={'SIPs'}
				description={'Stacks Improvement Proposals'}
				selected={0}
			/> -->
			<PolymarketCard
				target={'/dao/manager/propose/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bitcoin-dao'}
				label={'Continue'}
				title={'Make a Proposal'}
				description={'Something to propose to improve the DAO?'}
				selected={0}
			/>
			<PolymarketCard
				target={'/dao/launcher'}
				label={'Continue'}
				title={'DAO'}
				description={'Launch a dao to support your project'}
				selected={0}
			/>
			<PolymarketCard
				target={'/polling'}
				label={'Opinion Poll'}
				title={'Opinion Poll'}
				description={'Run polls, tap inot the wisdom of the crowd'}
				selected={0}
			/>
			<PolymarketCard
				target={'/dao/manager'}
				label={'Manage DAO'}
				title={'Manage DAO'}
				description={'Find and manage your DAO'}
				selected={0}
			/>
		</div>
	</div>
	<div class="w-full max-w-3xl rounded-lg p-6 shadow-lg">
		<div>
			<ProposalListPublic />
		</div>
	</div>
</div>
