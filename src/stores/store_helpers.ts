import { get } from 'svelte/store';
import { configStore } from '$stores/stores_config';
import type { Config } from '$lib/config';
import type { SuiSessionStore } from '$types/sui_types';
import { suiSessionStore } from './stores';
import { storedAccount, storedAccounts, storedWallet } from './wallet';
import type { Wallet, WalletAccount } from '@mysten/wallet-standard';

export function getConfig(): Config {
	return get(configStore);
}

export function getSession(): SuiSessionStore {
	return get(suiSessionStore);
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
