import { getConfig } from '$stores/store_helpers';
import type { VotingEventVoteOnProposal } from '@mijoco/stx_helpers/dist/index';

export async function getDaoVotesByProposal(proposal: string) {
	const url = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/votes/${proposal}`;
	const response = await fetch(url);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getDaoVotesByProposalAndVoter(proposal: string, stxAddress: string) {
	const url = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/votes/${proposal}/${stxAddress}`;
	const response = await fetch(url);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getDaoVotesByVoter(stxAddress: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao-voting/v1/votes/voter/${stxAddress}`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getDaoSummary(proposal: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao-voting/v1/summary/${proposal}`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}
