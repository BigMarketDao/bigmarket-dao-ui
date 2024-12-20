<script>
	import PolymarketCard from './PolymarketCard.svelte';

	$: selected = 0;
</script>

<!-- IntroPage.svelte -->
<div
	class="min-h-screen flex flex-col justify-start mt-10 items-center bg-transparent text-white p-6"
>
	<!-- Header Section -->
	<h1 class="text-4xl font-bold mb-4 text-primary-500">Big Market</h1>
	<p class="text-lg mb-2 text-gray-300 text-center max-w-3xl">
		Pitch your wits against your community
	</p>

	<!-- Data Collection Explanation -->
	<div class="bg-gray-900 rounded-lg shadow-lg p-6 max-w-3xl w-full">
		<!-- <h2 class="w-full text-2xl font-semibold mb-4 text-primary-500">What to prove?</h2> -->
		<div class="grid md:grid-cols-3 grid-cols-1 space-4 gap-4">
			<PolymarketCard
				target={'/proofs/voting'}
				label={'Continue'}
				title={'Market 1'}
				description={"Prove you're elligible to what and the voting power you own"}
				selected={0}
			/>
			<PolymarketCard
				target={'/proofs/keys'}
				label={'Coming soon!'}
				title={'Market 2'}
				description={'Sign messages to provide proof of ownership of your accounts and assets'}
				selected={1}
			/>
			<PolymarketCard
				target={'/proofs/keys'}
				label={'Coming soon!'}
				title={'Market 3'}
				description={'Prove your over a certain age without revealing your actual age or date of birth'}
				selected={1}
			/>
		</div>
	</div>
</div>
