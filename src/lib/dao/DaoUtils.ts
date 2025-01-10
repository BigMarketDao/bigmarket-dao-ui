import { getStxAddress } from '$lib/stacks/stacks-connect';
import { getConfig, getSession } from '$stores/store_helpers';
import {
	getBalanceAtHeight,
	type ExtensionType,
	type VotingEventProposeProposal
} from '@mijoco/stx_helpers/dist/index';

const DaoUtils = {
	fullBalance: async function (proposal: VotingEventProposeProposal) {
		const cf = getConfig();
		const ss = getSession();
		let totalBalanceAtHeight = 0;
		try {
			// note the latter is the proposal deploy height but we'd like it to the height that corresponds to the bitcoin start height.
			const startStacksBlock = proposal.proposalData.startBlockHeight;
			const stxAddress = getStxAddress();
			const response = await getBalanceAtHeight(cf.VITE_STACKS_API, stxAddress, startStacksBlock);
			totalBalanceAtHeight = Number(response.stx?.balance || 0);
			return totalBalanceAtHeight;
		} catch (e: any) {
			totalBalanceAtHeight = ss.keySets[cf.VITE_NETWORK].walletBalances?.stacks.amount || 0;
		}
		return totalBalanceAtHeight;
	},
	sortProposals: function (
		proposals: VotingEventProposeProposal[] | undefined,
		asc: boolean,
		sortField: string
	) {
		if (!proposals) return [];
		proposals = proposals.sort(function compare(
			a: VotingEventProposeProposal,
			b: VotingEventProposeProposal
		) {
			let nameA: string | number = a.proposal.split('.')[1].toUpperCase(); // ignore upper and lowercase
			let nameB: string | number = b.proposal.split('.')[1].toUpperCase(); // ignore upper and lowercase
			if (sortField === 'status') {
				nameA = a.proposalData?.burnStartHeight || 0;
				nameB = b.proposalData?.burnStartHeight || 0;
			}
			if (nameA > nameB) {
				if (asc) {
					return -1;
				} else {
					return 1;
				}
			}
			if (nameA < nameB) {
				if (asc) {
					return 1;
				} else {
					return -1;
				}
			}
			// names must be equal
			return 0;
		});
		return proposals;
	},
	dynamicSort: function (property: any) {
		let sortOrder = 1;
		if (property[0] === '-') {
			sortOrder = -1;
			property = property.substring(1);
		}
		return function (a: any, b: any) {
			/* next line works with strings and numbers,
			 * and you may want to customize it to your needs
			 */
			const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
			return result * sortOrder;
		};
	},
	sortExtensions: function (extensions: ExtensionType[], asc: boolean, sortField: string) {
		if (!extensions) return [];
		extensions = extensions.sort(function compare(a: ExtensionType, b: ExtensionType) {
			let nameA = a.contractId.split('.')[1].toUpperCase(); // ignore upper and lowercase
			let nameB = b.contractId.split('.')[1].toUpperCase(); // ignore upper and lowercase
			if (sortField === 'status') {
				nameA = a.valid ? 'active' : 'inactive';
				nameB = b.valid ? 'active' : 'inactive';
			}
			if (nameA > nameB) {
				if (asc) {
					return -1;
				} else {
					return 1;
				}
			}
			if (nameA < nameB) {
				if (asc) {
					return 1;
				} else {
					return -1;
				}
			}
			// names must be equal
			return 0;
		});
		return extensions;
	}
};
export default DaoUtils;
