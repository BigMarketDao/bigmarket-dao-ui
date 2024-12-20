import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// List of GitBook URLs to export
const gitBookPages = [
	'https://docs.sui.io/standards',
	'https://docs.sui.io/standards/coin',
	'https://docs.sui.io/standards/closed-loop-token',
	'https://docs.sui.io/standards/closed-loop-token/action-request',
	'https://docs.sui.io/standards/closed-loop-token/token-policy',
	'https://docs.sui.io/standards/closed-loop-token/spending',
	'https://docs.sui.io/sui-api-ref#suix_gettotalsupply',
	'https://docs.sui.io/standards/closed-loop-token/rules',
	'https://docs.sui.io/standards/closed-loop-token/coin-token-comparison',
	'https://docs.sui.io/standards/kiosk',
	'https://docs.sui.io/standards/kiosk-apps',
	'https://docs.sui.io/standards/deepbook',
	'https://docs.sui.io/standards/deepbookv3',
	'https://docs.sui.io/standards/deepbookv3/design',
	'https://docs.sui.io/standards/deepbookv3/balance-manager',
	'https://docs.sui.io/standards/display',
	'https://docs.sui.io/standards/wallet-standard'
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

	const combinedPDFPath = path.join(exportDir, 'sui-standards.pdf');

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
