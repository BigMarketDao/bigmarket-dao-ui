// walletStore.ts
import { writable } from 'svelte/store';
import type { Wallet, WalletAccount } from '@mysten/wallet-standard';

export const storedWallet = writable<Wallet | null>(null);
export const storedAccount = writable<WalletAccount | null>(null);
export const storedAccounts = writable<WalletAccount[]>([]);
