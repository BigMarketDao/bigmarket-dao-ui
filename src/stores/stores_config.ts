import { writable } from 'svelte/store';
import { config } from '$lib/config';
import { switchDaoConfig } from './stores_config_dao';

const initialConfig = config.mainnet;

export let configStore = writable(initialConfig);

export function switchConfig(env: string) {
	switchDaoConfig(env);
	configStore.set(config[env]);
}

export function setConfigByUrl(search: URLSearchParams) {
	const newNetwork = search.get('chain');
	if (newNetwork) {
		switchConfig(newNetwork);
	} else {
		switchConfig('devnet');
	}
}
