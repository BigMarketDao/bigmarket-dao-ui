import { openStructuredDataSignatureRequestPopup } from '@stacks/connect';
import { ChainId, STACKS_DEVNET } from '@stacks/network';
import { appDetails } from '$lib/config';
import { stringAsciiCV, tupleCV, uintCV } from '@stacks/transactions';
import { getConfig } from '$stores/store_helpers';
import type { OpinionPoll } from '$types/polling_types';
import { hashSha256Sync } from '@stacks/encryption';
import { bytesToHex } from '@stacks/common';
import { domain, domainCV, getStxNetwork } from './stacks-connect';

function messageCV(poll: OpinionPoll) {
	return tupleCV({
		message: stringAsciiCV(
			'please sign this message to authorise setting up a new opinion poll - your signature authorises you to administer the poll.'
		),
		name: stringAsciiCV(poll.name),
		description: stringAsciiCV(poll.description),
		admin: stringAsciiCV(poll.admin)
	});
}

export async function signNewPoll(poll: OpinionPoll, callback: any) {
	openStructuredDataSignatureRequestPopup({
		message: messageCV(poll),
		domain: domainCV(domain),
		network: getStxNetwork(),
		appDetails: {
			name: appDetails.name,
			icon: window.location.origin + appDetails.icon
		},
		onFinish(data) {
			callback(data);
		}
	});
}

export function createHashForPoll(originalPoll: OpinionPoll): string {
	const hashablePoll = {
		createdAt: originalPoll.createdAt,
		startBitcoinHeight: originalPoll.startBitcoinHeight,
		stopBitcoinHeight: originalPoll.stopBitcoinHeight,
		name: originalPoll.name,
		description: originalPoll.description,
		admin: originalPoll.admin,
		social: {
			twitter: {
				projectHandle: originalPoll.social.twitter.projectHandle
			},
			discord: {
				serverId: originalPoll.social.discord.serverId
			},
			website: {
				url: originalPoll.social.website.url
			}
		}
	};

	const sortedObject = JSON.stringify(hashablePoll, Object.keys(hashablePoll).sort());
	const encoder = new TextEncoder();
	const encodedBytes = encoder.encode(sortedObject);
	const hash = bytesToHex(hashSha256Sync(encodedBytes));
	return hash;
}
