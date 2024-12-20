import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// List of GitBook URLs to export
const gitBookPages = [
	'https://docs.sui.io/guides',
	'https://docs.sui.io/guides/developer/getting-started/sui-install',
	'https://docs.sui.io/guides/developer/getting-started/connect',
	'https://docs.sui.io/guides/developer/getting-started/local-network',
	'https://docs.sui.io/guides/developer/getting-started/get-address',
	'https://docs.sui.io/guides/developer/getting-started/get-coins',
	'https://docs.sui.io/guides/developer/getting-started/graphql-rpc',
	'https://docs.sui.io/guides/developer/first-app/write-package',
	'https://docs.sui.io/guides/developer/first-app/build-test',
	'https://docs.sui.io/guides/developer/first-app/publish',
	'https://docs.sui.io/guides/developer/first-app/debug',
	'https://docs.sui.io/guides/developer/first-app/client-tssdk',
	'https://docs.sui.io/guides/developer/sui-101/shared-owned',
	'https://docs.sui.io/guides/developer/sui-101/using-events',
	'https://docs.sui.io/guides/developer/sui-101/access-time',
	'https://docs.sui.io/guides/developer/sui-101/sign-and-send-txn',
	'https://docs.sui.io/guides/developer/sui-101/sponsor-txn',
	'https://docs.sui.io/guides/developer/sui-101/building-ptb',
	'https://docs.sui.io/guides/developer/sui-101/coin-mgt',
	'https://docs.sui.io/guides/developer/coin/regulated',
	'https://docs.sui.io/guides/developer/coin/in-game-token',
	'https://docs.sui.io/guides/developer/sui-101/simulating-refs',
	'https://docs.sui.io/guides/developer/coin/loyalty',
	'https://docs.sui.io/guides/developer/stablecoins',
	'https://docs.sui.io/guides/developer/nft',
	'https://docs.sui.io/guides/developer/nft/nft-rental',
	'https://docs.sui.io/guides/developer/nft/asset-tokenization',
	'https://docs.sui.io/guides/developer/cryptography',
	'https://docs.sui.io/guides/developer/cryptography/signing',
	'https://docs.sui.io/guides/developer/cryptography/groth16',
	'https://docs.sui.io/guides/developer/cryptography/hashing',
	'https://docs.sui.io/guides/developer/cryptography/ecvrf',
	'https://docs.sui.io/guides/developer/cryptography/multisig',
	'https://docs.sui.io/guides/developer/cryptography/ecvrf',
	'https://docs.sui.io/guides/developer/cryptography/zklogin-integration',
	'https://docs.sui.io/guides/developer/cryptography/zklogin-integration/developer-account',
	'https://docs.sui.io/guides/developer/cryptography/zklogin-integration/zklogin-example',
	'https://docs.sui.io/guides/developer/cryptography/zklogin-integration/developer-account',
	'https://docs.sui.io/guides/developer/advanced',
	'https://docs.sui.io/guides/developer/advanced/move-2024-migration',
	'https://docs.sui.io/guides/developer/advanced/custom-indexer',
	'https://docs.sui.io/guides/developer/advanced/randomness-onchain',
	'https://docs.sui.io/guides/developer/advanced/graphql-migration',
	'https://docs.sui.io/guides/developer/app-examples',
	'https://docs.sui.io/guides/developer/app-examples/e2e-counter',
	'https://docs.sui.io/guides/developer/app-examples/trustless-swap',
	'https://docs.sui.io/guides/developer/app-examples/coin-flip',
	'https://docs.sui.io/guides/developer/app-examples/reviews-rating',
	'https://docs.sui.io/guides/developer/app-examples/blackjack',
	'https://docs.sui.io/guides/developer/app-examples/plinko',
	'https://docs.sui.io/guides/developer/app-examples/tic-tac-toe',
	'https://docs.sui.io/guides/developer/app-examples/oracle',
	'https://docs.sui.io/guides/developer/app-examples/weather-oracle',
	'https://docs.sui.io/guides/developer/dev-cheat-sheet',
	'https://docs.sui.io/guides/operator',
	'https://docs.sui.io/guides/operator/sui-full-node',
	'https://docs.sui.io/guides/operator/genesis',
	'https://docs.sui.io/guides/operator/monitoring',
	'https://docs.sui.io/guides/operator/updates',
	'https://docs.sui.io/guides/operator/data-management',
	'https://docs.sui.io/guides/operator/snapshots',
	'https://docs.sui.io/guides/operator/archives',
	'https://docs.sui.io/guides/operator/node-tools',
	'https://docs.sui.io/guides/operator/exchange-integration',
	'https://docs.sui.io/guides/operator/bridge-node-configuration',
	'https://docs.sui.io/guides/operator/validator-committee',
	'https://docs.sui.io/guides/operator/validator-tasks'
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

	const combinedPDFPath = path.join(exportDir, 'sui-docs.pdf');

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
}, 240000);
