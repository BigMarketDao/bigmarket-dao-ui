// global.d.ts
interface WalletProvider {
	get: (walletName: string) => Wallet | undefined;
}

interface Wallet {
	features: {
		'standard:connect'?: {
			connect: () => Promise<{ accounts: Array<{ address: string }> }>;
		};
		'standard:disconnect'?: {
			disconnect: () => Promise<void>;
		};
	};
}

declare global {
	interface Window {
		wallets: WalletProvider;
	}
}

export {};
