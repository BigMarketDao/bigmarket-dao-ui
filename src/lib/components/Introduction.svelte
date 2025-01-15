<script>
	import ProposalListPublic from '$lib/dao/manager/proposals/ProposalListPublic.svelte';
	import PollListPublic from '$lib/polling/polls/PollListPublic.svelte';
	import { configDaoStore } from '$stores/stores_config_dao';
	import PolymarketCard from './common/PolymarketCard.svelte';
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
		<div class="my-5">
			<PolymarketCard
				target={'/polling/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bde021-opinion-polling'}
				label={'New Poll'}
				description={'Get your communities input!'}
				title={'Opinion Polling'}
				selected={0}
			>
				<div slot="longDescription">
					<PollListPublic />
				</div>
			</PolymarketCard>
		</div>
		<div class="my-5">
			<PolymarketCard
				target={'/dao/manager/propose/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.bitcoin-dao'}
				label={'Propose Something'}
				description={'Something to propose to improve the DAO?'}
				title={'Make a Proposal'}
				selected={0}
			>
				<div slot="longDescription">
					<div>
						<ProposalListPublic />
					</div>
				</div>
			</PolymarketCard>
		</div>
		<div class="space-4 flex min-h-[300px] justify-around gap-5">
			<!-- <PolymarketCard
				target={'https://stx.eco'}
				label={'Vote Now'}
				title={'SIPs'}
				description={'Stacks Improvement Proposals'}
				selected={0}
			/> -->
			<div class="w-full">
				<PolymarketCard
					target={'/dao/launcher'}
					label={'Continue'}
					title={'DAO'}
					description={'Launch a dao to support your project'}
					selected={0}
				/>
			</div>
			<div class="w-full">
				<PolymarketCard
					target={'/dao/manager'}
					label={'Manage DAO'}
					title={'Manage DAO'}
					description={'Find and manage your DAO'}
					selected={0}
				/>
			</div>
		</div>
	</div>
</div>
