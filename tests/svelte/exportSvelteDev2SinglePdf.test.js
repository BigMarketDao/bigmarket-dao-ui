import { test, expect } from 'vitest';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

// List of GitBook URLs to export
const gitBookPages = [
	'https://svelte.dev/docs/kit/introduction',
	'https://svelte.dev/docs/kit/creating-a-project',
	'https://svelte.dev/docs/kit/project-structure',
	'https://svelte.dev/docs/kit/web-standards',
	'https://svelte.dev/docs/kit/routing',
	'https://svelte.dev/docs/kit/load',
	'https://svelte.dev/docs/kit/form-actions',
	'https://svelte.dev/docs/kit/page-options',
	'https://svelte.dev/docs/kit/state-management',
	'https://svelte.dev/docs/kit/building-your-app',
	'https://svelte.dev/docs/kit/adapters',
	'https://svelte.dev/docs/kit/adapter-auto',
	'https://svelte.dev/docs/kit/adapter-node',
	'https://svelte.dev/docs/kit/adapter-static',
	'https://svelte.dev/docs/kit/single-page-apps',
	'https://svelte.dev/docs/kit/adapter-cloudflare',
	'https://svelte.dev/docs/kit/adapter-cloudflare-workers',
	'https://svelte.dev/docs/kit/adapter-netlify',
	'https://svelte.dev/docs/kit/adapter-vercel',
	'https://svelte.dev/docs/kit/writing-adapters',
	'https://svelte.dev/docs/kit/advanced-routing',
	'https://svelte.dev/docs/kit/hooks',
	'https://svelte.dev/docs/kit/errors',
	'https://svelte.dev/docs/kit/link-options',
	'https://svelte.dev/docs/kit/service-workers',
	'https://svelte.dev/docs/kit/server-only-modules',
	'https://svelte.dev/docs/kit/snapshots',
	'https://svelte.dev/docs/kit/shallow-routing',
	'https://svelte.dev/docs/kit/packaging',
	'https://svelte.dev/docs/kit/auth',
	'https://svelte.dev/docs/kit/performance',
	'https://svelte.dev/docs/kit/images',
	'https://svelte.dev/docs/kit/accessibility',
	'https://svelte.dev/docs/kit/faq',
	'https://svelte.dev/docs/kit/integrations',
	'https://svelte.dev/docs/kit/debugging',
	'https://svelte.dev/docs/kit/migrating-to-sveltekit-2',
	'https://svelte.dev/docs/kit/migrating',
	'https://svelte.dev/docs/kit/additional-resources',
	'https://svelte.dev/docs/kit/glossary',
	'https://svelte.dev/docs/kit/seo',
	'https://svelte.dev/docs/kit/@sveltejs-kit',
	'https://svelte.dev/docs/kit/@sveltejs-kit-hooks',
	'https://svelte.dev/docs/kit/@sveltejs-kit-node-polyfills',
	'https://svelte.dev/docs/kit/@sveltejs-kit-node',
	'https://svelte.dev/docs/kit/@sveltejs-kit-vite',
	'https://svelte.dev/docs/kit/$app-environment',
	'https://svelte.dev/docs/kit/$app-forms',
	'https://svelte.dev/docs/kit/$app-navigation',
	'https://svelte.dev/docs/kit/$app-paths',
	'https://svelte.dev/docs/kit/$app-server',
	'https://svelte.dev/docs/kit/$app-state',
	'https://svelte.dev/docs/kit/$app-stores',
	'https://svelte.dev/docs/kit/$env-dynamic-private',
	'https://svelte.dev/docs/kit/$env-dynamic-public',
	'https://svelte.dev/docs/kit/$env-static-private',
	'https://svelte.dev/docs/kit/$lib',
	'https://svelte.dev/docs/kit/$service-worker',
	'https://svelte.dev/docs/kit/configuration',
	'https://svelte.dev/docs/kit/cli',
	'https://svelte.dev/docs/kit/types'
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

	const combinedPDFPath = path.join(exportDir, 'svelte-dev.pdf');

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
