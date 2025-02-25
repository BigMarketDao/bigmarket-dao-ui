# bigmarket-dao-ui

BigMarket DAO UI. For raising and tracking proposals, voting and more.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Html 2 Pdf

The test/ directory contains a utility for converting up to date info into pdf to be fed to chat gpt.

To use addd your links to the `links.js` file. edit the filename by changing line 23: `const combinedPDFPath = path.join(exportDir, 'sui-typescript-docs.pdf');`

Run the script (install npx first if need be);

```sh
npx vitest tests/export2Pdf.test.js
```
