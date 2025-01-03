import {
	type TentativeProposal,
	type VotingEventProposeProposal
} from '@mijoco/stx_helpers/dist/index';
import { getConfig, getDaoConfig, getSession } from '$stores/store_helpers';
import { isLoggedIn } from '../stacks/stacks-connect';

export function isFunding() {
	return false;
}

export function getProposalColor(proposal: VotingEventProposeProposal) {
	if (isProposedPreVoting(proposal)) {
		return 'warning';
	} else if (isVoting(proposal)) {
		return 'green';
	} else {
		return 'danger';
	}
}

export function isProposedPreVoting(proposal: VotingEventProposeProposal) {
	const sess = getSession();
	const currentHeight =
		proposal.submissionContract.indexOf('008') > -1
			? sess.stacksInfo.stacks_tip_height
			: sess.stacksInfo?.burn_block_height || 0;
	return currentHeight < proposal.proposalData.burnStartHeight;
}

export function isVoting(proposal: VotingEventProposeProposal) {
	const sess = getSession();
	//if (window.location.href.indexOf('localhost') > -1) return true;

	const currentHeight =
		proposal.submissionContract.indexOf('008') > -1
			? sess.stacksInfo.stacks_tip_height
			: sess.stacksInfo?.burn_block_height || 0;
	const res = currentHeight >= proposal.proposalData.burnStartHeight;
	return res && currentHeight < proposal.proposalData.burnEndHeight;
}

export function isConclusionPending(proposal: VotingEventProposeProposal) {
	return isPostVoting(proposal) && !proposal.proposalData.concluded;
}

export function isPostVoting(proposal: VotingEventProposeProposal) {
	const sess = getSession();
	const currentHeight =
		proposal.submissionContract.indexOf('008') > -1
			? sess.stacksInfo.stacks_tip_height
			: sess.stacksInfo?.burn_block_height || 0;
	return currentHeight >= proposal.proposalData.burnEndHeight;
}

export async function getFunding(submissionContract: string, proposalContract: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/proposals/v1/get-funding/${submissionContract}/${proposalContract}`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getAllProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/proposals/v1/all-proposals`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getActiveProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/proposals/v1/active-proposals`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getTentativeProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/proposals/v1/tentative-proposals`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getConcludedProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/proposals/v1/concluded-proposals`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getProposalLatest(proposal: string): Promise<VotingEventProposeProposal> {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/proposal/${proposal}`;
	const response = await fetch(path);
	if (response.status === 404) throw new Error('not found ' + proposal);
	const res = await response.json();
	return res;
}

export async function getTentativeProposal(
	proposalId: string
): Promise<TentativeProposal | undefined> {
	const path = `${getConfig().VITE_BIGMARKET_API}/proposals/v1/get-tentative-proposal/${proposalId}`;
	const response = await fetch(path);
	if (response.status === 404) return;
	const res = await response.json();
	return res;
}

export async function getBaseDaoExecutedProposalEvents(daoContract: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/proposals/v1/get-executed-proposals/${daoContract}`;
	const response = await fetch(path);
	if (response.status === 404) return;
	const res = await response.json();
	return res;
}

export function getCurrentProposalLink(name: string): { name: string; address: string } {
	return { name: 'Proposal is loading', address: '/' };
}

export function getProposalNotFoundLink(): { name: string; address: string } {
	return { name: 'Proposal not found', address: '/' };
}

export async function fetchExecutedProposalsByDao(daoContract: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/executed/${daoContract}`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
export async function fetchExecutedProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/executed`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
export async function fetchProposedProposalsByDao(daoContract: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/proposed/${daoContract}`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
export async function fetchProposedProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/proposed`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
export async function fetchAllProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
export async function fetchBootstrapProposals() {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/bootstrap`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
