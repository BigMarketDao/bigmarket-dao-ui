import { get } from 'svelte/store';
import { configStore } from '$stores/stores_config';
import type { Config } from '$lib/config';
import { sessionStore } from './stores';
import { storedAccount, storedAccounts, storedWallet } from './wallet';
import type { Wallet, WalletAccount } from '@mysten/wallet-standard';
import type { DaoConfig } from '$lib/config_dao';
import { configDaoStore } from './stores_config_dao';
import type { SessionStore } from '@mijoco/stx_helpers/dist/index';

export function getDaoConfig(): DaoConfig {
	return get(configDaoStore);
}

export function getConfig(): Config {
	return get(configStore);
}

export function getSession(): SessionStore {
	return get(sessionStore);
}

export function getStoredWallet(): Wallet | null {
	return get(storedWallet);
}

export function getStoredAccount(): WalletAccount | null {
	return get(storedAccount);
}
export function getStoredAccounts(): Array<WalletAccount> | null {
	return get(storedAccounts);
}
