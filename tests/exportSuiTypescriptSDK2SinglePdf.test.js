import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// List of GitBook URLs to export
const gitBookPages = [
	'https://sdk.mystenlabs.com/typescript',
	'https://sdk.mystenlabs.com/typescript/install',
	'https://sdk.mystenlabs.com/typescript/hello-sui',
	'https://sdk.mystenlabs.com/typescript/faucet',
	'https://sdk.mystenlabs.com/typescript/sui-client',
	'https://sdk.mystenlabs.com/typescript/graphql',
	'https://sdk.mystenlabs.com/typescript/transaction-building/basics',
	'https://sdk.mystenlabs.com/typescript/transaction-building/gas',
	'https://sdk.mystenlabs.com/typescript/transaction-building/sponsored-transactions',
	'https://sdk.mystenlabs.com/typescript/transaction-building/offline',
	'https://sdk.mystenlabs.com/typescript/transaction-building/intents',
	'https://sdk.mystenlabs.com/typescript/cryptography/keypairs',
	'https://sdk.mystenlabs.com/typescript/cryptography/multisig',
	'https://sdk.mystenlabs.com/typescript/utils',
	'https://sdk.mystenlabs.com/typescript/bcs',
	'https://sdk.mystenlabs.com/typescript/zklogin',
	'https://sdk.mystenlabs.com/typescript/executors',
	'https://sdk.mystenlabs.com/typescript/plugins',
	'https://sdk.mystenlabs.com/typescript/owned-object-pool',
	'https://sdk.mystenlabs.com/typescript/owned-object-pool/overview',
	'https://sdk.mystenlabs.com/typescript/owned-object-pool/local-development',
	'https://sdk.mystenlabs.com/typescript/owned-object-pool/custom-split-strategy',
	'https://sdk.mystenlabs.com/typescript/owned-object-pool/examples',
	'https://sdk.mystenlabs.com/typescript/migrations/sui-1.0'
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

	const combinedPDFPath = path.join(exportDir, 'sui-typescript-docs.pdf');

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
