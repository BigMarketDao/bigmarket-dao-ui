import { getConfig } from '$stores/store_helpers';

export async function fetchExchangeRates() {
	//const path = `${getConfig().VITE_BRIDGE_API}/rates/v1/tx/rates`;
	const path = `https://api.stx.eco/bridge-api/rates/v1/tx/rates`;
	try {
		const response = await fetch(path);
		const res = await response.json();
		return res;
	} catch (err) {
		return undefined;
	}
}
