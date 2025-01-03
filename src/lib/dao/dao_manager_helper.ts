import { getConfig, getDaoConfig } from '$stores/store_helpers';
import { fetchDataVar, lookupContract } from '@mijoco/stx_helpers/dist/index';
import {
	cvToJSON,
	deserializeCV,
	type ClarityValue,
	type StringUtf8CV
} from '@stacks/transactions';

export async function getContractDeploymentTxId(
	contractAddress: string
): Promise<string | undefined> {
	let txId: string | undefined;
	try {
		const path = `${getConfig().VITE_STACKS_API}`;
		const c = await lookupContract(path, `${contractAddress}`);
		if (c && c.tx_id) {
			txId = c.tx_id;
		}
	} catch (err: any) {}
	return txId;
}

export async function isDaoConstructed(contractAddress: string): Promise<boolean> {
	let constructed = false;
	try {
		let result = await fetchDataVar(
			getConfig().VITE_STACKS_API,
			contractAddress.split('.')[0],
			contractAddress.split('.')[1],
			'executive'
		);
		if (result && result.data) {
			const clarityValue = deserializeCV(result.data);
			// executive is only given a value by the construct call
			if (clarityValue && clarityValue.type === 'contract') constructed = true;
		}
	} catch (err: any) {}
	return constructed;
}

export async function isExecutiveTeamMember(
	coreExecuteContractId: string | undefined,
	stxAddress: string
): Promise<{ executiveTeamMember: boolean }> {
	let path = `${getConfig().VITE_BIGMARKET_API}/dao/events/extensions/is-core-team-member/${stxAddress}`;
	if (coreExecuteContractId)
		path = `${getConfig().VITE_BIGMARKET_API}/dao/events/extensions/is-core-team-member/${coreExecuteContractId}/${stxAddress}`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}

export async function isExtension(extensionAddress: string): Promise<{ result: boolean }> {
	if (!extensionAddress) return { result: false };
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/events/extensions/is-extension/${extensionAddress}`;
	const response = await fetch(path);
	const res = await response.json();
	return res;
}
