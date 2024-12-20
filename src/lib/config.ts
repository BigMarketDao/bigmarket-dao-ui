export const appDetails = {
	name: 'stxeco-zk-vote',
	icon: '/img/stx_eco_logo_icon_white.png'
};
export interface Config {
	VITE_PUBLIC_APP_NAME: string;
	VITE_PUBLIC_APP_VERSION: string;
	VITE_NETWORK: string;
	VITE_BIGMARKET_API: string;
	VITE_SUI_API: string;
}

export const config: { [key: string]: Config } = {
	devnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket Devnet',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'devnet',
		VITE_BIGMARKET_API: 'http://localhost:3020/bigmarket-api',
		VITE_SUI_API: 'http://localhost:9001'
	},
	testnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket Devnet',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'devnet',
		VITE_BIGMARKET_API: 'https://api.brightblock.org/bigmarket-api',
		VITE_SUI_API: 'http://localhost:9001'
	},
	mainnet: {
		VITE_PUBLIC_APP_NAME: 'BigMarket Devnet',
		VITE_PUBLIC_APP_VERSION: '1.0.0',
		VITE_NETWORK: 'devnet',
		VITE_BIGMARKET_API: 'https://api.brightblock.org/bigmarket-api',
		VITE_SUI_API: 'http://localhost:9001'
	}
};
