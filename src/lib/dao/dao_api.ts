import { getConfig } from '$stores/store_helpers';
import {
	callContractReadOnly,
	voteMessageToTupleCV,
	type Auth,
	type VoteMessage,
	type VotingEventProposeProposal
} from '@mijoco/stx_helpers/dist/index';
import { hexToBytes } from '@stacks/common';
import { bufferCV, contractPrincipalCV, principalCV, serializeCV } from '@stacks/transactions';

export const NAKAMOTO_VOTE_START_HEIGHT = 829750 + 100;
export const NAKAMOTO_VOTE_STOPS_HEIGHT = 833950;
export const daoVotingSupported = true;

export async function findDaoVotes(proposalId: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/votes/${proposalId}`;
	const response = await fetch(path);
	const res = await response.json();
	return res || [];
}

export async function verifySignedStructuredData(
	vote: VoteMessage,
	hash: string,
	signature: string,
	votingContract: string
): Promise<{ result: boolean }> {
	const functionArgs = [
		`0x${serializeCV(voteMessageToTupleCV(vote))}`,
		`0x${serializeCV(bufferCV(hexToBytes(signature)))}`,
		`0x${serializeCV(principalCV(vote.voter))}`
	];

	const data = {
		contractAddress: votingContract.split('.')[0],
		contractName: votingContract.split('.')[1],
		functionName: 'verify-signed-tuple',
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

export async function verifySignature(
	vote: VoteMessage,
	hash: string,
	signature: string,
	votingContract: string
): Promise<{ result: boolean }> {
	const functionArgs = [
		`0x${serializeCV(bufferCV(hexToBytes(hash)))}`,
		`0x${serializeCV(bufferCV(hexToBytes(signature)))}`,
		`0x${serializeCV(principalCV(vote.voter))}`
	];

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
		headers: { 'Content-Type': 'application/json', Authorization: '' },
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
