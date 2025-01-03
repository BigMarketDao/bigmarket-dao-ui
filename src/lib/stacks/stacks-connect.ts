import { AppConfig, showConnect, UserSession } from '@stacks/connect';
import { storedStacksWallet } from '$stores/wallet';
import { getConfig, getSession } from '$stores/store_helpers';
import { ChainId, STACKS_DEVNET, STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { stringAsciiCV, tupleCV, uintCV } from '@stacks/transactions';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export const domain = {
	name: getConfig().VITE_PUBLIC_APP_NAME,
	version: getConfig().VITE_PUBLIC_APP_VERSION,
	'chain-id': getConfig().VITE_NETWORK === 'mainnet' ? ChainId.Mainnet : ChainId.Testnet
};
export function domainCV(domain: any) {
	return tupleCV({
		name: stringAsciiCV(domain.name),
		version: stringAsciiCV(domain.version),
		'chain-id': uintCV(domain['chain-id'])
	});
}

export async function handlePendingSignin() {
	if (userSession.isSignInPending()) {
		userSession.handlePendingSignIn().then((userData) => {
			storedStacksWallet.set(userData);
		});
	} else if (userSession.isUserSignedIn()) {
		// Handle case in which user is already authenticated
	}
}

export function getUserData() {
	return isLoggedIn() ? userSession.loadUserData() : undefined;
}

export async function authenticate(callback: any) {
	showConnect({
		appDetails: {
			name: 'My App',
			icon: window.location.origin + '/my-app-logo.svg'
		},
		redirectTo: '/',
		onFinish: () => {
			let userData = userSession.loadUserData();
			storedStacksWallet.set(userData);
			if (callback) callback();
		},
		userSession
	});
}

export function isLoggedIn() {
	return userSession && userSession.isUserSignedIn();
}

export function getStxAddress() {
	if (!isLoggedIn()) return;
	const ud = userSession.loadUserData();
	if (getConfig().VITE_NETWORK === 'testnet' || getConfig().VITE_NETWORK === 'devnet') {
		return ud.profile.stxAddress['testnet'];
	}
	return ud.profile.stxAddress['mainnet'];
}

export function getStxNetwork() {
	if (getConfig().VITE_NETWORK === 'devnet') {
		return STACKS_DEVNET;
	} else if (getConfig().VITE_NETWORK === 'testnet') {
		return STACKS_TESTNET;
	} else {
		return STACKS_MAINNET;
	}
}

export function loginStacksFromHeader(document: any) {
	const el = document.getElementById('connect-wallet');
	if (el) return document.getElementById('connect-wallet').click();
	else return false;
}

export function logUserOut() {
	return userSession.signUserOut('/');
}

export const coordinators = [
	{ stxAddress: 'SPSEBFRZZEZSHGRKRR1Z55RX5AWHER3CYM0H9BMW', btcAddress: '' }, // mitchel
	{ stxAddress: 'ST2SACH111M97FZWN2Z8XMJ1FCKSJM3NGE35S6ZKN', btcAddress: 'xverse testnet' }, // devnet + electrum bob
	{ stxAddress: 'SP2SACH111M97FZWN2Z8XMJ1FCKSJM3NGE37MGXAT', btcAddress: 'xverse mainnet' }, // devnet + electrum bob
	{ stxAddress: 'SP2F0DP9Z3KSS0DABDBJN0DA0SHMCVWHXPVTH3PJJ', btcAddress: '' }, // devnet + electrum bob
	{ stxAddress: 'ST3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNZN9J752', btcAddress: '' }, // devnet + electrum bob
	{
		stxAddress: 'ST1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28G8HXK9G5',
		btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0'
	}, // devnet + electrum bob
	{
		stxAddress: 'ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT',
		btcAddress: 'bc1qkj5yxgm3uf78qp2fdmgx2k76ccdvj7rx0qwhv0'
	}, // devnet + electrum bob
	{
		stxAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
		btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e'
	}, // devnet + electrum bob
	{
		stxAddress: 'SP3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSQP2HGT6',
		btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e'
	}, // mijoco staging + electrum bob
	{
		stxAddress: 'ST3N4AJFZZYC4BK99H53XP8KDGXFGQ2PRSPNET8TN',
		btcAddress: 'tb1q6ue638m4t5knwxl4kwhwyuffttlp0ffee3zn3e'
	}, // mijoco production + electrum bob
	{ stxAddress: 'STS4B251PP2HDR9M6TCRCMJ7S908H8GP9QNKJPAQ', btcAddress: '' }, // max
	{ stxAddress: 'SP1PHAGEQ5RWM8G84DFGMRPENKQGFC4QJ9YWXAYKF', btcAddress: '' }, // acrossfire
	{ stxAddress: 'ST306HDPY54T81RZ7A9NGA2F03B8NRGW6Y59ZRZSD', btcAddress: '' }, // coordinator
	{ stxAddress: 'ST3RBZ4TZ3EK22SZRKGFZYBCKD7WQ5B8FFRS57TT6', btcAddress: '' }, // coordinator
	{ stxAddress: 'ST167Z6WFHMV0FZKFCRNWZ33WTB0DFBCW9M1FW3AY', btcAddress: '' }, // coordinator
	{ stxAddress: 'SP1R1061ZT6KPJXQ7PAXPFB6ZAZ6ZWW28GBQA1W0F', btcAddress: '' }, // coordinator
	{ stxAddress: 'SP3JP0N1ZXGASRJ0F7QAHWFPGTVK9T2XNXDB908Z', btcAddress: '' }, // marten
	{ stxAddress: 'SPSEBFRZZEZSHGRKRR1Z55RX5AWHER3CYM0H9BMW', btcAddress: '' } // mitchell
];

export function isCoordinator(address: string | undefined) {
	if (!address || !isLoggedIn()) return false;
	const index = coordinators.findIndex((o) => o.stxAddress === address);
	return index > -1;
}

export function explorerAddressUrl(addr: string) {
	if (getConfig().VITE_NETWORK === 'devnet') {
		return `${getConfig().VITE_STACKS_EXPLORER}/txid/${addr}?chain=testnet&api=http://localhost:3999`;
	} else if (getConfig().VITE_NETWORK === 'testnet') {
		return `${getConfig().VITE_STACKS_EXPLORER}/txid/${addr}?chain=testnet`;
	} else {
		return `${getConfig().VITE_STACKS_EXPLORER}/txid/${addr}?chain=mainnet`;
	}
}
export function explorerBtcTxUrl(txid: string | undefined) {
	if (!txid) return '?';
	if (txid.startsWith('0x')) txid = txid.split('x')[1];
	return getConfig().VITE_MEMPOOL_API + '/tx/' + txid;
}

export function explorerBtcAddressUrl(address: string | undefined) {
	if (!address) return '';
	return getConfig().VITE_MEMPOOL_API + '/address/' + address;
}
export function explorerTxUrl(txid: string) {
	if (getConfig().VITE_NETWORK === 'devnet') {
		return `${getConfig().VITE_STACKS_EXPLORER}/txid/${txid}?chain=testnet&api=http://localhost:3999`;
	} else if (getConfig().VITE_NETWORK === 'testnet') {
		return `${getConfig().VITE_STACKS_EXPLORER}/txid/${txid}?chain=testnet`;
	} else {
		return `${getConfig().VITE_STACKS_EXPLORER}/txid/${txid}?chain=mainnet`;
	}
}
export function getAddressId() {
	return getStxAddress().substring(0, 5);
}
