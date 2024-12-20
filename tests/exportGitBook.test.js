import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// List of GitBook URLs to export
const gitBookPages = [
	'https://sdk.mystenlabs.com/dapp-kit',
	'https://sdk.mystenlabs.com/dapp-kit/create-dapp',
	'https://sdk.mystenlabs.com/dapp-kit/sui-client-provider',
	'https://sdk.mystenlabs.com/dapp-kit/rpc-hooks',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-provider',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-components/ConnectButton',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-components/ConnectModal',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useWallets',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useAccounts',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useCurrentWallet',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useCurrentAccount',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useAutoConnectWallet',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useConnectWallet',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useDisconnectWallet',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useSwitchAccount',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useSignPersonalMessage',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useSignTransaction',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useSignAndExecuteTransaction',
	'https://sdk.mystenlabs.com/dapp-kit/wallet-hooks/useReportTransactionEffects',
	'https://sdk.mystenlabs.com/dapp-kit/stashed',
	'https://sdk.mystenlabs.com/dapp-kit/themes'
];

// Test suite
test('Export GitBook pages to PDF', async () => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	// Ensure the exports directory exists
	const exportDir = path.resolve('./exports');
	if (!fs.existsSync(exportDir)) {
		fs.mkdirSync(exportDir, { recursive: true });
		console.log(`Created directory: ${exportDir}`);
	}

	for (let i = 0; i < gitBookPages.length; i++) {
		const url = gitBookPages[i];
		console.log(`Exporting ${url}...`);

		await page.goto(url, { waitUntil: 'networkidle2' }); // Wait for the page to load completely

		// Export to PDF
		const filePath = path.join(exportDir, `page-${i + 1}.pdf`);
		await page.pdf({
			path: filePath,
			format: 'A4',
			printBackground: true
		});

		console.log(`Saved PDF: ${filePath}`);
		expect(fs.existsSync(filePath)).toBeTruthy(); // Check if the file was created
	}

	await browser.close();
	console.log('PDF export complete!');
}, 120000);
