import type { DaoTemplate } from '@mijoco/stx_helpers/dist/dao';
import { getConfig } from '$stores/store_helpers';

export async function launchDao(template: DaoTemplate) {
	const path = `${getConfig().VITE_BIGMARKET_API}/dao/v1/launch`;
	const response = await fetch(path, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: '' },
		body: JSON.stringify(template)
	});

	if (response.status !== 200) {
		return {
			error: 'Error broadcasting',
			status: response.status
		};
	}
	return await response.json();
}

export const deployer_roles = [
	{
		stx_address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST3PF13W7Z0RRM42A8VZRVFQ75SV1K26RXEP8YGKJ',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'ST3NBRSFKX28FQ2ZJ1MAKX58HKHSDGNV5N7R21XCP',
		deployed: false,
		constructed: false
	},
	{
		stx_address: 'STNHKEPYEPJ8ET55ZZ0M5A34J0R3N5FM2CMMMAZ6',
		deployed: false,
		constructed: false
	}
];
