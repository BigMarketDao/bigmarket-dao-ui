import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// List of GitBook URLs to export
const gitBookPages = [
	'https://docs.sui.io/references/sui-api',
	'https://docs.sui.io/references/sui-graphql',
	'https://docs.sui.io/sui-api-ref#suix_getcoinmetadata',
	'https://docs.sui.io/sui-api-ref#suix_getallbalances',
	'https://docs.sui.io/sui-api-ref#suix_getallcoins',
	'https://docs.sui.io/sui-api-ref#suix_getbalance',
	'https://docs.sui.io/sui-api-ref#suix_gettotalsupply',
	'https://docs.sui.io/references/cli/cheatsheet',
	'https://docs.sui.io/references/cli/client',
	'https://docs.sui.io/references/cli/ptb',
	'https://docs.sui.io/references/cli/console',
	'https://docs.sui.io/references/cli/keytool',
	'https://docs.sui.io/references/cli/move',
	'https://docs.sui.io/references/cli/validator',
	'https://docs.sui.io/references/ide/move',
	'https://docs.sui.io/references/ide/debugger',
	'https://sdk.mystenlabs.com/zksend',
	'https://sdk.mystenlabs.com/zksend/dapp',
	'https://sdk.mystenlabs.com/zksend/link-builder',
	'https://docs.sui.io/sui-glossary',
	'https://docs.sui.io/references/contribute/sui-environment',
	'https://docs.sui.io/references/ide/move'
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

	const combinedPDFPath = path.join(exportDir, 'sui-cli-docs.pdf');

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
