import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// List of GitBook URLs to export
const gitBookPages = [
	'https://github.com/Clarity-Innovation-Lab/executor-dao',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/executor-dao.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/traits/extension-trait.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/traits/governance-token-trait.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/traits/ownable-trait.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/traits/proposal-trait.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/traits/sip010-ft-trait.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/extensions/ede000-governance-token.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/extensions/ede001-proposal-voting.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/extensions/ede002-proposal-submission.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/extensions/ede003-emergency-proposals.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/extensions/ede004-emergency-execute.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/extensions/ede005-dev-fund.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/external/nft-escrow.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/proposals/edp000-bootstrap.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/proposals/edp001-dev-fund.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/proposals/edp002-kill-emergency-execute.clar',
	'https://github.com/Clarity-Innovation-Lab/executor-dao/blob/main/contracts/proposals/edp003-allowlist-escrow-nft.clar'
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/bitcoin-dao.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/extensions/bde000-governance-token.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/extensions/bde001-proposal-voting.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/extensions/bde002-proposal-submission.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/extensions/bde003-core-proposals.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/extensions/bde004-core-execute.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/extensions/bde006-treasury.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/extensions/bde020-resource-manager.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/proposals/mainnnet/bdp000-bootstrap.clar',
	// 'https://github.com/radicleart/bitcoin-dao/blob/main/contracts/traits/resource-provider-trait.clar',
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

	const combinedPDFPath = path.join(exportDir, 'executor-dao-docs.pdf');

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
