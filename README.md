# vipan-garg-ehr

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_kTKTB1iIkkWyuIzp0bJbdxd2ATjo)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Clinical Records and Verification

- `lib/reports.ts` is the shared PDF catalog for the archive and home-page count.
- `lib/clinical-data.ts` preserves specimen/requisition dates, reported dates, raw values, units, qualifiers, and source-page links. Do not turn reporting limits into numeric measurements or infer missing results.
- `testing/report-sources.json` records PDF hashes and transformations. The July 2026 panel was paginated without changing its report text; the PGI bundle contains original lab pages only, and the original discharge card contains the three relevant source pages.
- `testing/prepare-report-assets.py` reproduces the reviewed assets from their original Downloads filenames. It requires Python with `pypdf` and the `pdftotext` command. Do not run it against changed source PDFs without reviewing them again.
- Raw review files, administrative forms, identity documents, and unrelated Downloads files must not be published.

```bash
npm test
npx tsc --noEmit --incremental false
npm run build
```

The PDF source tests require Poppler (`pdfinfo` and `pdftotext`). Browser verification evidence is saved in `testing/`. Historical month-only chart summaries are retained as such; new source results use exact documented dates. Current medication use and treatment-response categories are not inferred from laboratory trends.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/abhishekgarg8/vipan-garg-ehr" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
