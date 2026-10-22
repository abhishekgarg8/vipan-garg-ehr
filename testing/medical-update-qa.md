# Medical Record Update QA - 2026-10-22

## Scope

- Added 15 reports, bringing the archive to 51 (29 primary and 22 secondary).
- Replaced the PGI bundle with 37 original laboratory pages: all 28 previously published source pages plus nine additional pages; omitted the derived summary page.
- Updated all six charts, source-linked result tables, timeline, treatment history, concerns, profile attribution, and report count.
- Preserved reporting limits, uncertain results, units, specimen dates, and final-report dates. No missing measurements or treatment-response classifications were inferred.
- Published only the three relevant original discharge pages. Duplicate interim panels, administrative forms, consent scans, and unrelated documents were excluded.

## Checks

- `npm test`: 44 passing tests, including comparisons with text extracted from the actual PDF source pages.
- `npx tsc --noEmit --incremental false`: passed.
- `npm run build`: passed.
- `git diff --check`: passed.
- `node testing/verify-report-http.mjs http://127.0.0.1:3000`: all 51 PDF URLs returned PDFs; all 16 new or replaced asset hashes matched.
- Existing Chrome session: exercised all 51 report selections, verifying the single selected state, viewer URL, open link, and title. The final 13 checks resumed after a browser-tool timeout.
- Desktop and 390 x 844 mobile: all six charts rendered through October 2, no page-wide horizontal overflow, source links present, and report selection scrolled to the mobile viewer.
- Browser console: no errors observed during the checked flows.
- July panel: all 13 paginated pages visually checked; all 3,157 extracted text tokens match the original long-page PDF.
- Discharge PDF: published pages are pixel-identical to the relevant original pages.
- Independent reviewer checked final panels, PGI platelet values, historical reporting limits, documented doses, and source-page links; no remaining blocking findings.

## Browser Evidence

- [Desktop charts](charts-desktop-local.png)
- [Mobile charts](charts-mobile-local.png)
- [Mobile source-linked results](markers-mobile-local.png)
- [Mobile August PDF](reports-august-mobile-local.png)
- [Paginated July PDF](reports-july-paginated-local.png)

Production verification is performed after merging with `node testing/verify-report-http.mjs https://vipangarg.vercel.app` and a fresh Chrome visit. Local checks above do not by themselves confirm deployment.
