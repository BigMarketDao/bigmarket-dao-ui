export const appDetails = {
	name: 'bitcoin-dao',
	icon: '/img/stx_eco_logo_icon_white.png'
};

export interface Config {
	VITE_PUBLIC_APP_NAME: string;
	VITE_PUBLIC_APP_VERSION: string;
	VITE_NETWORK: string;
	VITE_POLL_PAYMENT_USTX: number;
	VITE_BIGMARKET_API: string;
	VITE_SUI_API: string;
	VITE_BRIDGE_API: string;
	VITE_STACKS_API: string;
	VITE_STACKS_EXPLORER: string;
	VITE_MEMPOOL_API: string;
}

export const config: { [key: string]: Config } = {
	devnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'devnet',
		VITE_BIGMARKET_API: 'http://localhost:3020/bigmarket-api',
		VITE_SUI_API: 'http://localhost:9001',
		VITE_BRIDGE_API: 'http://localhost:3020/bridge-api',
		VITE_STACKS_API: 'http://localhost:3999',
		VITE_STACKS_EXPLORER: 'http://localhost:8000',
		VITE_MEMPOOL_API: 'http://localhost:8001',
		VITE_POLL_PAYMENT_USTX: 50000000
	},
	testnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'testnet',
		VITE_BIGMARKET_API: 'https://api.brightblock.org/bigmarket-api',
		VITE_STACKS_API: 'https://api.testnet.hiro.so',
		VITE_STACKS_EXPLORER: 'https://explorer.hiro.so/sandbox/deploy?chain=testnet',
		VITE_BRIDGE_API: 'https://api.stx.eco/bridge-api',
		VITE_SUI_API: 'http://localhost:9001',
		VITE_MEMPOOL_API: 'https://mempool.space/api',
		VITE_POLL_PAYMENT_USTX: 50000000
	},
	mainnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'mainnet',
		VITE_BIGMARKET_API: 'https://api.brightblock.org/bigmarket-api',
		VITE_STACKS_API: 'https://api.hiro.so',
		VITE_STACKS_EXPLORER: 'https://explorer.hiro.so',
		VITE_BRIDGE_API: 'https://api.stx.eco/bridge-api',
		VITE_SUI_API: 'http://localhost:9001',
		VITE_MEMPOOL_API: 'https://mempool.space/api',
		VITE_POLL_PAYMENT_USTX: 50000000
	}
};
