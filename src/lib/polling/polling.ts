import { openStructuredDataSignatureRequestPopup, showContractCall, type SignatureData } from '@stacks/connect';
import { appDetails } from '$lib/config';
import { PostConditionMode, type ClarityValue, type TupleCV, type TupleData } from '@stacks/transactions';
import { hashSha256Sync } from '@stacks/encryption';
import { MerkleTree } from 'merkletreejs';
import { domain, domainCV, getStxAddress, getStxNetwork } from '../stacks/stacks-connect';
import { type Auth, type PollCreateEvent, type OpinionPoll, type PollVoteMessage, pollVoteMessageToTupleCV, type StoredPollVoteMessage, getStacksNetwork, pollVotesToClarityValue } from '@mijoco/stx_helpers/dist/index';
import { bytesToHex } from '@stacks/common';
import { getConfig, getSession } from '$stores/store_helpers';
import { sha256 } from '@noble/hashes/sha256';
import { fetchTimestamp } from '$lib/dao/voting_sip18';

export async function getCreatePollEvent(pollId: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/polling/polls/${pollId}`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function getAllOpinionPolls() {
	const path = `${getConfig().VITE_BIGMARKET_API}/polling/polls`;
	const response = await fetch(path);
	if (response.status === 404) return [];
	const res = await response.json();
	return res;
}

export async function fetchSip18PollVotes(pollId: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/polling/sip18-votes/${pollId}`;
	const response = await fetch(path);
	if (response.status === 404) return 'not found';
	const res = await response.json();
	return res;
}

export async function submitSip18PollVotes(pollContract: string, votes: Array<StoredPollVoteMessage>) {
	const args = pollVotesToClarityValue(votes);
	await showContractCall({
		network: getStacksNetwork(getConfig().VITE_NETWORK),
		postConditions: [],
		postConditionMode: PostConditionMode.Deny,
		contractAddress: pollContract.split('.')[0],
		contractName: pollContract.split('.')[1],
		functionName: 'batch-vote',
		functionArgs: [args.pollVotesCV],
		onFinish: (data) => {
			console.log('finished contract call!', data);
			return data.txId;
		},
		onCancel: () => {
			console.log('popup closed!');
		}
	});
}

export function isAdministrator(poll: PollCreateEvent) {
	return poll.startBurnHeight === getStxAddress();
}

export function isPollActive(poll: PollCreateEvent) {
	const burn_block_height = getSession().stacksInfo.burn_block_height;
	return burn_block_height >= poll.startBurnHeight && burn_block_height < poll.endBurnHeight;
}

export async function postCreatePollMessage(poll: OpinionPoll, auth: Auth) {
	const path = `${getConfig().VITE_BIGMARKET_API}/polling/polls`;
	const response = await fetch(path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: '' },
		body: JSON.stringify({ poll, auth })
	});
	if (response.status >= 400 && response.status < 500) return 'not allowed';
	else if (response.status >= 500) return 'error on server';
	const res = await response.json();
	return res;
}

export async function signNewPoll(poll: TupleCV<TupleData<ClarityValue>>, callback: any) {
	openStructuredDataSignatureRequestPopup({
		message: poll,
		domain: domainCV(domain),
		network: getStxNetwork(),
		appDetails: {
			name: appDetails.name,
			icon: window?.location?.origin || '' + appDetails.icon
		},
		onFinish(signature) {
			callback(signature);
		}
	});
}

export async function newPollVoteMessage(poll: PollCreateEvent, vote: boolean, voter: string): Promise<PollVoteMessage> {
	const ts = await fetchTimestamp();
	return {
		attestation: vote ? 'I agree with the statement' : 'I disagree with the statement',
		'poll-id': poll.pollId,
		'market-data-hash': poll.metadataHash,
		timestamp: ts,
		vote,
		voter,
		nftContract: undefined,
		ftContract: undefined,
		tokenId: undefined,
		proof: undefined
	};
}
// (attestation (string-ascii 100))
// (poll-id (buff 32))
// (timestamp uint)
// (vote bool)
// (voter principal)
// (nft-contract (optional <nft-trait>))
// (ft-contract (optional <ft-trait>))
// (token-id (optional uint))
// (proof (list 10 (buff 32)))),

export async function signPollVoteMessage(pollVoteMessage: PollVoteMessage, callback: any) {
	openStructuredDataSignatureRequestPopup({
		message: pollVoteMessageToTupleCV(pollVoteMessage),
		domain: domainCV(domain),
		network: getStxNetwork(),
		appDetails: {
			name: appDetails.name,
			icon: (window?.location?.origin || '') + appDetails.icon
		},
		onFinish(data) {
			callback(data);
		}
	});
}

export async function postPollVoteMessage(pollVoteObjectHash: string, auth: { message: PollVoteMessage; signature: SignatureData }) {
	const path = `${getConfig().VITE_BIGMARKET_API}/polling/sip18-votes/${pollVoteObjectHash}`;
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
