import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

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

	const combinedPDFPath = path.join(exportDir, 'sui-dapp-kit.pdf');

	// Create a new PDF document
	const combinedPdfDoc = await PDFDocument.create();

	for (let i = 0; i < gitBookPages.length; i++) {
		const url = gitBookPages[i];
		console.log(`Navigating to: ${url}`);

		await page.goto(url, { waitUntil: 'networkidle2' });

		// Generate PDF buffer for current page
		const pdfBuffer = await page.pdf({
			format: 'A4',
			printBackground: true
		});

		// Load the buffer as a PDFDocument and copy its pages
		const currentPdfDoc = await PDFDocument.load(pdfBuffer);
		const copiedPages = await combinedPdfDoc.copyPages(
			currentPdfDoc,
			currentPdfDoc.getPageIndices()
		);

		copiedPages.forEach((page) => combinedPdfDoc.addPage(page));
		console.log(`Page ${i + 1} added to combined PDF.`);
	}

	// Write the final combined PDF to a file
	const combinedPdfBytes = await combinedPdfDoc.save();
	fs.writeFileSync(combinedPDFPath, combinedPdfBytes);

	await browser.close();
	console.log(`Combined PDF saved to: ${combinedPDFPath}`);
	expect(fs.existsSync(combinedPDFPath)).toBeTruthy();
}, 120000);
