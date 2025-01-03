// walletStore.ts
import { writable } from 'svelte/store';
import type { Wallet, WalletAccount } from '@mysten/wallet-standard';
import type { UserData } from '@stacks/connect';

export const storedStacksWallet = writable<UserData | null>(null);
export const storedWallet = writable<Wallet | null>(null);
export const storedAccount = writable<WalletAccount | null>(null);
export const storedAccounts = writable<WalletAccount[]>([]);
