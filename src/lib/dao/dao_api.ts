import { appDetails } from '$lib/config';
import { domain, domainCV, getStxAddress, getStxNetwork } from '$lib/stacks/stacks-connect';
import { getConfig } from '$stores/store_helpers';
import { openStructuredDataSignatureRequestPopup, type SignatureData } from '@stacks/connect';
import { stringAsciiCV, tupleCV, uintCV } from '@stacks/transactions';

export const NAKAMOTO_VOTE_START_HEIGHT = 829750 + 100;
export const NAKAMOTO_VOTE_STOPS_HEIGHT = 833950;
export const ADMIN_MESSAGE = 'please sign this message to authorise DAO management task.';
export const daoVotingSupported = true;
export type BaseAdminMessage = {
	message: string;
	timestamp: number;
	admin: string;
};
export type Auth = {
	message: BaseAdminMessage;
	signature: SignatureData;
};
function messageCV(message: BaseAdminMessage) {
	return tupleCV({
		message: stringAsciiCV(message.message),
		timestamp: uintCV(message.timestamp),
		admin: stringAsciiCV(message.admin)
	});
}

export async function findDaoVotes(proposalId: string) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/proposals/votes/${proposalId}`;
	const response = await fetch(path);
	const res = await response.json();
	return res || [];
}

export async function signAdminMessage(callback: any) {
	const adminMessage: BaseAdminMessage = {
		message: ADMIN_MESSAGE,
		timestamp: new Date().getTime(),
		admin: getStxAddress()
	};
	const message = messageCV(adminMessage);
	openStructuredDataSignatureRequestPopup({
		message,
		domain: domainCV(domain),
		network: getStxNetwork(),
		appDetails: {
			name: appDetails.name,
			icon: window.location.origin + appDetails.icon
		},
		onFinish(signature) {
			callback({ message: adminMessage, signature });
		}
	});
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
