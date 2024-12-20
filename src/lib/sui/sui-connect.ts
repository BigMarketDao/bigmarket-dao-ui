import { SuiClient } from '@mysten/sui/client';
import { generateNonce, generateRandomness } from '@mysten/sui/zklogin';
import { Ed25519Keypair, Ed25519PublicKey } from '@mysten/sui/keypairs/ed25519';
import { getConfig, getSession, getStoredAccount, getStoredWallet } from '$stores/store_helpers';
import { suiSessionStore } from '$stores/stores';
import { parseZkLoginSignature } from '@mysten/sui/zklogin';
import { getWallets } from '@mysten/wallet-standard';
import type { Wallet } from '@mysten/wallet-standard';
import { storedAccounts, storedAccount, storedWallet } from '$stores/wallet';

let suiClient: SuiClient;
let unsubscribe: any;

export async function fetchWallets() {
	const wallets: Array<Wallet> = [];
	const availableWallets = getWallets().get();
	if (availableWallets) {
		availableWallets.filter(async (o) => {
			const chains = o.features['sui:signTransaction'];
			if (chains) {
				wallets.push(o);
			} else {
				//wallets.push(o);
			}
		});
	}
	return wallets;
}

function eventHandler(e: any) {
	console.log('Wallet event: ', e);
}

export async function connectWallet(wallet: Wallet) {
	let result = false;
	try {
		const res = await (wallet.features['standard:connect'] as any).connect();
		console.log('Connect response:', res);
		if (res && res.accounts && res.accounts.length > 0) {
			storedAccounts.set(res.accounts);
			storedAccount.set(res.accounts[0]);
			storedWallet.set(wallet);
			result = true;
			unsubscribe = (wallet.features['standard:events'] as any).on('change', eventHandler);
		}
	} catch (err: any) {
		console.log('connectWallet: ', err);
	}
}

export async function disconnectWallet() {
	const wallet = getStoredWallet();
	if (!wallet) return;
	if (!wallet.features) {
		storedWallet.set(null);
		return;
	}
	try {
		const res = await (wallet.features['standard:connect'] as any).disconnect();
		console.log('Connect response:', res);
	} catch (err: any) {
		console.log('disconnectWallet: ', err);
	}
	storedWallet.set(null);
}

export async function suiGetNonce() {
	const FULLNODE_URL = `https://fullnode.${getConfig().VITE_NETWORK}.sui.io`; // replace with the RPC URL you want to use
	suiClient = new SuiClient({ url: FULLNODE_URL });
	const { epoch, epochDurationMs, epochStartTimestampMs } =
		await suiClient.getLatestSuiSystemState();
	const maxEpoch = Number(epoch) + 2; // this means the ephemeral key will be active for 2 epochs from now.
	const ephemeralKeyPair = new Ed25519Keypair();
	const randomness = generateRandomness();
	const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);
	suiSessionStore.update((conf) => {
		return conf;
	});
	return nonce;
}

export async function decodeJwt() {
	//const decodedJwt = jwt_decode(encodedJWT) as JwtPayload;
	const s = getSession();
	if (!s.jwtToken) return;
	const parsedSignature = await parseZkLoginSignature(s.jwtToken);
}

export async function getFunds(owner: string) {
	await suiClient.getCoins({
		owner
	});
}
