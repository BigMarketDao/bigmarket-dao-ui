import type { AddressObject, DaoOverview, ExchangeRate, PoxInfo, SbtcUserSettingI, StacksBalance, StacksInfo, TokenPermissionEvent } from '@mijoco/stx_helpers/dist/index';
import { persisted } from 'svelte-local-storage-store';

export const sessionStore = persisted('sessionStore', {} as BitcoinDaoSessionStore);
export type BitcoinDaoSessionStore = {
	name: string;
	loggedIn: boolean;
	balances?: StacksBalance;
	keySets: { [key: string]: AddressObject };
	userSettings: SbtcUserSettingI;
	poxInfo: PoxInfo;
	exchangeRates: Array<ExchangeRate>;
	stacksInfo: StacksInfo;
	tokens: Array<TokenPermissionEvent>;
	daoOverview: DaoOverview;
};
