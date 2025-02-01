import { contractPrincipalCV, cvToHex, PostConditionMode, someCV, stringAsciiCV, tupleCV, uintCV } from '@stacks/transactions';
import { getConfig } from '$stores/store_helpers';
import { ChainId } from '@stacks/network';
import { openStructuredDataSignatureRequestPopup, showContractCall, type SignatureData } from '@stacks/connect';
import { domain, domainCV, getStxAddress, getStxNetwork } from '$lib/stacks/stacks-connect';
import { appDetails } from '$lib/config';
import { request } from 'sats-connect';
import {
	ADMIN_MESSAGE,
	adminMessageToTupleCV,
	getStacksNetwork,
	verifyBaseAdminSignature,
	voteMessageToTupleCV,
	votesToClarityValue,
	type BaseAdminMessage,
	type PollCreateEvent,
	type PollVoteMessage,
	type StoredVoteMessage,
	type VoteMessage,
	type VotingEventProposeProposal
} from '@mijoco/stx_helpers/dist/index';

export async function fetchTimestamp() {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/sip18-voting/timestamp`;
	const response = await fetch(path);
	const res = await response.json();
	return res.serverTime;
}

export async function fetchSip18Votes(proposal: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/sip18-voting/votes/${proposal}`;
	const response = await fetch(path);
	if (response.status === 404) return 'not found';
	const res = await response.json();
	return res;
}

export async function submitSip18Votes(proposal: VotingEventProposeProposal, votes: Array<StoredVoteMessage>) {
	let args;
	const votingContractName = proposal.votingContract.split('.')[1];
	if (votingContractName === 'bde001-proposal-voting-tokenised') {
		args = votesToClarityValue(proposal.proposal, votes); // pass reclaim prop if one
	} else {
		args = votesToClarityValue(proposal.proposal, votes);
	}

	await showContractCall({
		network: getStacksNetwork(getConfig().VITE_NETWORK),
		postConditions: [],
		postConditionMode: PostConditionMode.Deny,
		contractAddress: proposal.votingContract.split('.')[0],
		contractName: votingContractName,
		functionName: 'batch-vote',
		functionArgs: [args.votesCV],
		onFinish: (data) => {
			console.log('finished contract call!', data);
			return data.txId;
		},
		onCancel: () => {
			console.log('popup closed!');
		}
	});
}

export async function postVoteMessage(hash: string, auth: { message: VoteMessage; signature: SignatureData }) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/sip18-voting/votes/${hash}`;
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

export async function signAdminMessage(callback: any) {
	const adminMessage: BaseAdminMessage = {
		message: ADMIN_MESSAGE,
		timestamp: new Date().getTime(),
		admin: getStxAddress()
	};
	const chainId = getConfig().VITE_NETWORK === 'mainnet' ? ChainId.Mainnet : ChainId.Testnet;

	console.log('domainCV: ', domainCV);
	console.log('chainId: ', chainId);
	//const message = messageCV(adminMessage);

	openStructuredDataSignatureRequestPopup({
		message: tupleCV({
			message: stringAsciiCV(adminMessage.message),
			timestamp: uintCV(adminMessage.timestamp),
			admin: stringAsciiCV(adminMessage.admin)
		}),
		domain: tupleCV({
			name: stringAsciiCV(getConfig().VITE_PUBLIC_APP_NAME),
			version: stringAsciiCV(getConfig().VITE_PUBLIC_APP_VERSION),
			'chain-id': uintCV(chainId)
		}),
		network: getStxNetwork(),
		appDetails: {
			name: appDetails.name,
			icon: (window?.location?.origin || '') + appDetails.icon
		},
		onFinish(signature) {
			const network = getConfig().VITE_NETWORK;
			const appName = getConfig().VITE_PUBLIC_APP_NAME;
			const appVersion = getConfig().VITE_PUBLIC_APP_VERSION;
			console.log('/votes: network: ' + getConfig().VITE_NETWORK);
			console.log('/votes: publicAppName: ' + getConfig().VITE_PUBLIC_APP_NAME);
			console.log('/votes: publicAppVersion: ' + getConfig().VITE_PUBLIC_APP_VERSION);
			console.log('/votes: signature: ' + signature.signature);
			console.log('/votes: publicKey: ' + signature.publicKey);
			console.log('/votes: message: ', adminMessage);
			let res = verifyBaseAdminSignature(network, appName, appVersion, adminMessage, signature.signature, signature.publicKey);
			callback({ message: adminMessage, signature });
		}
	});
}
export async function signAdminMessageXverse() {
	const adminMessage: BaseAdminMessage = {
		message: ADMIN_MESSAGE,
		timestamp: 1736281142366, //new Date().getTime(),
		admin: getStxAddress()
	};
	const response = await request('stx_signStructuredMessage', {
		message: cvToHex(adminMessageToTupleCV(adminMessage)).slice(2), // remove 0x,
		domain: cvToHex(
			tupleCV({
				name: stringAsciiCV('sats-connect-example'),
				version: stringAsciiCV('1.2.3'),
				'chain-id': uintCV(getConfig().VITE_NETWORK === 'mainnet' ? ChainId.Mainnet : ChainId.Testnet)
			})
		).slice(2)
	});
	if (response.status === 'success') {
		alert('Success! Check the console for the response.');
		console.log(response.result);
	} else {
		console.error('Something went wrong. Check the console for the response.');
		console.error(response);
	}
	return response;
}

export async function newVoteMessage(proposal: VotingEventProposeProposal, vote: boolean, amount: number, voter: string): Promise<VoteMessage> {
	const ts = await fetchTimestamp();
	return {
		attestation: vote ? 'I vote in favour of the proposal' : 'I vote against the proposal',
		proposal: proposal.proposal,
		timestamp: ts,
		vote,
		voter,
		voting_power: amount
	};
}

export async function signProposal(voteMessage: VoteMessage, callback: any) {
	openStructuredDataSignatureRequestPopup({
		message: voteMessageToTupleCV(voteMessage),
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
