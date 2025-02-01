import { getConfig } from '$stores/store_helpers';
import {
	callContractReadOnly,
	voteMessageToTupleCV,
	type Auth,
	type ContractBalances,
	type DaoOverview,
	type PredictionContractData,
	type ProposalData,
	type VoteMessage,
	type VotingEventProposeProposal,
	type VotingEventVoteOnProposal
} from '@mijoco/stx_helpers/dist/index';
import { hexToBytes } from '@stacks/common';
import { bufferCV, contractPrincipalCV, principalCV, serializeCV } from '@stacks/transactions';

export const NAKAMOTO_VOTE_START_HEIGHT = 829750 + 100;
export const NAKAMOTO_VOTE_STOPS_HEIGHT = 833950;
export const daoVotingSupported = true;

export async function getDaoOverview(): Promise<DaoOverview> {
	const path = `${getConfig().VITE_BIGMARKET_API}/pm/market-dao-data`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}

export async function findDaoVotes(proposalId: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/votes/${proposalId}`;
	const response = await fetch(path);
	const res = await response.json();
	return res || [];
}
export type VoteSummary = {
	stxFor: number;
	stxAgainst: number;
	accountsFor: number;
	accountsAgainst: number;
	inFavour: string;
	passed: boolean;
	customMajority: number;
};
export function summarizeVotes(votes: Array<VotingEventVoteOnProposal>, proposalData: ProposalData): VoteSummary {
	const summary = votes.reduce(
		(acc, vote) => {
			if (vote.for) {
				acc.stxFor += vote.amount;
				acc.accountsFor.add(vote.voter);
			} else {
				acc.stxAgainst += vote.amount;
				acc.accountsAgainst.add(vote.voter);
			}
			return acc;
		},
		{
			stxFor: 0,
			stxAgainst: 0,
			accountsFor: new Set(),
			accountsAgainst: new Set()
		}
	);

	// Calculate percentage in favour
	const totalStx = summary.stxFor + summary.stxAgainst;
	const inFavour = totalStx === 0 ? 0 : (summary.stxFor / totalStx) * 100;

	// Return the final summary
	return {
		stxFor: proposalData.votesFor,
		stxAgainst: proposalData.votesAgainst,
		accountsFor: summary.accountsFor.size,
		accountsAgainst: summary.accountsAgainst.size,
		inFavour: inFavour.toFixed(4),
		passed: proposalData.passed,
		customMajority: proposalData.customMajority
	};
}

// export async function verifySignedStructuredData(
// 	vote: VoteMessage,
// 	hash: string,
// 	signature: string,
// 	votingContract: string
// ): Promise<{ result: boolean }> {
// 	const functionArgs = [
// 		`0x${serializeCV(voteMessageToTupleCV(vote))}`,
// 		`0x${serializeCV(bufferCV(hexToBytes(signature)))}`,
// 		`0x${serializeCV(principalCV(vote.voter))}`
// 	];

// 	const data = {
// 		contractAddress: votingContract.split('.')[0],
// 		contractName: votingContract.split('.')[1],
// 		functionName: 'verify-signed-tuple',
// 		functionArgs
// 	};
// 	let res: { value: boolean; type: string };
// 	try {
// 		res = await callContractReadOnly(getConfig().VITE_STACKS_API, data);
// 		return { result: res.value };
// 	} catch (e) {
// 		return { result: false };
// 	}
// }

export async function verifySignature(vote: VoteMessage, hash: string, signature: string, votingContract: string): Promise<{ result: boolean }> {
	const functionArgs = [`0x${serializeCV(bufferCV(hexToBytes(hash)))}`, `0x${serializeCV(bufferCV(hexToBytes(signature)))}`, `0x${serializeCV(principalCV(vote.voter))}`];

	const data = {
		contractAddress: votingContract.split('.')[0],
		contractName: votingContract.split('.')[1],
		functionName: 'verify-signature',
		functionArgs
	};
	let res: { value: boolean; type: string };
	try {
		res = await callContractReadOnly(getConfig().VITE_STACKS_API, data);
		return { result: res.value };
	} catch (e) {
		return { result: false };
	}
}

export async function readBaseDaoEvents(daoContract: string, auth: Auth) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/events/extensions/${daoContract}`;
	const response = await fetch(path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(auth)
	});
	if (response.status >= 400 && response.status < 500) return 'not allowed';
	else if (response.status >= 500) return 'error on server';
	const res = await response.json();
	return res;
}

export async function fetchExtensions(daoContract: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/events/extensions/${daoContract}`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
