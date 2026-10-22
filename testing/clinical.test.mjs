import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ts from "typescript"

const source = readFileSync(new URL("../lib/clinical-data.ts", import.meta.url), "utf8")
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText
const clinical = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`)
const { panelDates, panelResults, inpatientResults, clinicalResults, latestResults, clinicalSources, exactValue, chartValue, chartSeries, resultHref, shortDate } = clinical
const pageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
const pageAst = ts.createSourceFile("page.tsx", pageSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
// Exercise the actual tooltip and chart data without loading the Next page or a browser.
const uiNames = ["immunoglobulinData", "immunoglobulinChartData", "ClinicalTooltip"]
const uiSource = pageAst.statements.filter(statement =>
  ts.isFunctionDeclaration(statement) ? uiNames.includes(statement.name?.text) :
    ts.isVariableStatement(statement) && statement.declarationList.declarations.some(declaration => uiNames.includes(declaration.name.getText(pageAst)))
).map(statement => statement.getText(pageAst)).join("\n")
const uiCompiled = ts.transpileModule(uiSource, { compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2022 } }).outputText
const { immunoglobulinChartData, ClinicalTooltip } = new Function("React", ...Object.keys(clinical), `${uiCompiled}; return { immunoglobulinChartData, ClinicalTooltip };`)(React, ...Object.values(clinical))
function tooltip(row, keys) {
  return renderToStaticMarkup(React.createElement(ClinicalTooltip, { active: true, label: row.date, payload: keys.map(key => ({ dataKey: key, name: key, value: row[key], payload: row })) }))
}

// Independently read from the final PDFs, not generated from application data.
// Pages are printed/source pages; the July export originally has one physical page.
const panels = [
  ["may", "2026-05-28", "09:18:00", "2026-05-30", "15:17:21", {
    kappa: ["130.32", 11], lambda: ["22.81", 11], ratio: ["5.713", 11], egfr: ["34", 5],
    IgG: ["748.00", 10], IgA: ["93.90", 10], IgM: ["<21.0", 10],
    hemoglobin: ["11.60", 1], anc: ["3.51", 1], platelets: ["110", 2],
    creatinine: ["2.08", 5], beta2: ["7669", 9], mSpike: ["0.30", 6],
  }],
  ["july", "2026-07-30", "09:02:00", "2026-08-01", "16:00:59", {
    kappa: ["120.39", 11], lambda: ["1.35", 11], ratio: ["89.178", 11], egfr: ["46", 5],
    IgG: ["826.00", 9], IgA: ["<33.0", 10], IgM: ["<21.0", 9],
    hemoglobin: ["12.70", 1], anc: ["5.10", 1], platelets: ["107", 2],
    creatinine: ["1.60", 5], beta2: ["8708", 9], mSpike: ["0.50", 6],
  }],
  ["august", "2026-08-28", "07:49:00", "2026-08-31", "13:06:35", {
    kappa: ["1.27", 5], lambda: ["< 1.32", 5], egfr: ["52", 11],
    ratio: ["Kappa lambda ratio cannot be calculated as the value of lambda is < 1.32.", 5],
    IgG: ["986.00", 12], IgA: ["<15.0", 12], IgM: ["<8.0", 12],
    hemoglobin: ["12.30", 7], anc: ["1.70", 7], platelets: ["175", 8],
    creatinine: ["1.44", 11], beta2: ["9933", 4], mSpike: ["0.60", 1],
  }],
  ["october", "2026-10-02", "09:01:00", "2026-10-05", "12:33:39", {
    kappa: ["< 0.56", 11], lambda: ["1.37", 11], egfr: ["53", 5],
    ratio: ["Kappa lambda ratio cannot be calculated as the value of Kappa is < 0.56.", 11],
    IgG: ["890.00", 9], IgA: ["<33.0", 10], IgM: ["<21.0", 9],
    hemoglobin: ["12.80", 1], anc: ["0.91", 1], platelets: ["175", 2],
    creatinine: ["1.43", 5], beta2: ["8450", 9], mSpike: ["? 0.4", 6],
  }],
]
const units = { kappa: "mg/L", lambda: "mg/L", ratio: "", egfr: "mL/min/1.73m2", IgG: "mg/dL", IgA: "mg/dL", IgM: "mg/dL", hemoglobin: "g/dL", anc: "thou/mm3", platelets: "thou/mm3", creatinine: "mg/dL", beta2: "ng/mL", mSpike: "g/dL" }
function oneResult(results, sourceId, date, analyte) {
  const matches = results.filter(result => result.sourceId === sourceId && result.date === date && result.analyte === analyte)
  assert.equal(matches.length, 1, `${sourceId} ${date} ${analyte} must appear exactly once`)
  return matches[0]
}

for (const [sourceId, date, specimenTime, reportedDate, reportedTime, metrics] of panels) {
  test(`${sourceId}: final panel dates, values, units, qualifiers and source pages`, () => {
    assert.deepEqual(panelDates.find(panel => panel.sourceId === sourceId), { sourceId, specimenDate: date, specimenTime, reportedDate, reportedTime, status: "Final" })
    for (const [analyte, [raw, page]] of Object.entries(metrics)) {
      const result = oneResult(panelResults, sourceId, date, analyte)
      const qualifier = raw.startsWith("<") ? "<" : raw.startsWith("?") ? "uncertain" : Number.isNaN(Number(raw)) ? "text" : "exact"
      assert.deepEqual([result.raw, result.value, result.unit, result.qualifier], [raw, qualifier === "exact" ? Number(raw) : null, units[analyte], qualifier], analyte)
      assert.deepEqual([result.specimenDate, result.reportedDate, result.dateBasis], [date, reportedDate, "specimen"], analyte)
      assert.deepEqual([result.sourcePage, result.publishedPage, result.sourcePhysicalPage], [page, page, sourceId === "july" ? 1 : page], analyte)
    }
  })
}

// PGI primary chemistry/CBC pages 31-67 are published as pages 1-37, excluding p30's derived summary.
// Date, original CBC page, Hb, platelet count, ANC, original chemistry page, Cr, K, Ca, phosphorus.
const inpatient = [
  ["2026-06-27", 66, "11.3", "152", "-", 43, "1.63", "4.50", "7.96", "2.37"],
  ["2026-06-30", 65, "11.1", "139", "4.47", 42, "1.44", "5.11", "7.92", "1.95"],
  ["2026-07-01", 64, "11.1", "26", "7.8", 41, "1.71", "4.65", "8.56", "2.20"],
  ["2026-07-02", 63, "10.7", "111", "4.08", 40, "1.89", "4.46", "7.68", "1.75"],
  ["2026-07-03", 62, "11.2", "94", "3.9", 39, "1.86", "4.36", "7.99", "2.12"],
  ["2026-07-04", 61, "11.4", "108", "7.7", 38, "1.68", "4.51", "8.48", "2.64"],
  ["2026-07-06", 60, "12.0", "102", "3.8", 37, "2.17", "3.97", "9.14", "3.50"],
  ["2026-07-07", 59, "12.9", "102", "4.1", 36, "2.16", "4.30", "9.62", "4.08"],
  ["2026-07-09", 58, "11.5", "107", "5.08", 35, "2.47", "4.10", "8.69", "3.76"],
  ["2026-07-10", 57, "11.6", "107", "5.12", 34, "2.12", "4.05", "8.33", "3.07"],
  ["2026-07-11", 56, "11.5", "100", "-", 33, "1.86", "4.23", "7.98", "2.66"],
  ["2026-07-13", 55, "10.6", "90", "3.59", 32, "1.37", "4.58", "7.94", "2.34"],
  ["2026-07-14", 54, "11.1", "75", "3.9", 31, "1.35", "4.43", "8.00", "2.06"],
]
for (const [date, cbcPage, hb, plt, anc, chemistryPage, cr, k, ca, phos] of inpatient) {
  test(`PGI ${date}: primary results, requisition date and repaginated citations`, () => {
    for (const [analyte, raw, page, unit] of [
      ["hemoglobin", hb, cbcPage, "gm/dL"], ["platelets", plt, cbcPage, "x10^9/L"], ["anc", anc, cbcPage, "x10^9/L"],
      ["creatinine", cr, chemistryPage, "mg/dL"], ["potassium", k, chemistryPage, "mmol/L"], ["calcium", ca, chemistryPage, "mg/dl"], ["phosphorus", phos, chemistryPage, "mg/dL"],
    ]) {
      const result = oneResult(inpatientResults, "pgi", date, analyte)
      assert.deepEqual([result.raw, result.value, result.unit, result.qualifier], [raw, raw === "-" ? null : Number(raw), unit, raw === "-" ? "not-reported" : "exact"], analyte)
      assert.deepEqual([result.dateBasis, result.specimenDate, result.reportedDate], ["requisition", null, page === cbcPage ? date : null], analyte)
      assert.deepEqual([result.sourcePage, result.sourcePhysicalPage, result.publishedPage], [page, page, page - 30], analyte)
      assert.equal(resultHref(result), `/reports/2026-june-pgi-reports.pdf#page=${page - 30}`)
    }
  })
}

test("censored, uncertain, missing and textual results never become exact numerical measurements", () => {
  for (const raw of ["<21.0", "< 0.56", "<33.0", "<15.0", "<8.0", "? 0.4", "-", "cannot calculate", "", " ", "NaN", "Infinity", "12 mg/dL"]) assert.equal(exactValue(raw), null, raw)
  for (const [raw, value] of [["0", 0], ["0.91", 0.91], ["12.80", 12.8], [" 53 ", 53]]) assert.equal(exactValue(raw), value)
  for (const result of clinicalResults.filter(result => result.qualifier !== "exact")) {
    assert.equal(result.value, null, `${result.analyte}: ${result.raw}`)
    assert.equal(chartValue(result), null)
  }
})

test("ANC and platelet units are compatible without introducing a 1000-fold error", () => {
  const latestAnc = oneResult(panelResults, "october", "2026-10-02", "anc")
  const latestPlatelets = oneResult(panelResults, "october", "2026-10-02", "platelets")
  assert.equal(chartValue(latestAnc), 0.91)
  assert.equal(chartValue(latestPlatelets), 175)
  assert.equal(chartValue(oneResult(inpatientResults, "pgi", "2026-07-01", "platelets")), 26)
  for (const [raw, normalized] of [[1.71, 171], [1.10, 110], [1.33, 133]]) assert.ok(Math.abs(chartValue({ value: raw, unit: "Lacs/mm3" }) - normalized) < 1e-10)
  assert.equal(chartValue({ value: null, unit: "Lacs/mm3" }), null)
})

test("lab-specific references and PGI source annotations remain intact", () => {
  for (const panel of panels) {
    assert.equal(oneResult(panelResults, panel[0], panel[1], "anc").reference, "2.00 - 7.00")
    assert.equal(oneResult(panelResults, panel[0], panel[1], "platelets").reference, "150.00 - 410.00")
  }
  assert.equal(oneResult(inpatientResults, "pgi", "2026-07-14", "anc").reference, "1.8 - 7.7")
  assert.equal(oneResult(inpatientResults, "pgi", "2026-07-14", "platelets").reference, "150 - 450")
  for (const date of ["2026-07-01", "2026-07-03"]) assert.match(oneResult(inpatientResults, "pgi", date, "creatinine").note, /Corr\.clini\.\/Rpt/)
  assert.equal(inpatientResults.some(result => result.analyte === "egfr"), false, "Do not derive an unreported PGI eGFR")
})

test("all six chart metrics include every panel once, in specimen-date order", () => {
  for (const analyte of ["kappa", "egfr", "IgG", "IgA", "IgM", "hemoglobin", "anc", "platelets"]) {
    const series = chartSeries(analyte, [{ date: "Apr 2026", value: 1 }])
    const dates = series.map(point => point.sortKey)
    assert.deepEqual(dates, [...dates].sort())
    for (const [sourceId, date] of panels) {
      const points = series.filter(point => point.result?.sourceId === sourceId)
      assert.equal(points.length, 1, `${sourceId} ${analyte}`)
      const result = oneResult(panelResults, sourceId, date, analyte)
      assert.equal(points[0].sortKey, date)
      assert.equal(points[0].value, result.value)
      assert.equal(points[0].result, result)
    }
  }
  assert.equal(chartSeries("anc", []).find(point => point.result?.sourceId === "pgi" && point.sortKey === "2026-07-11").value, null)
})

test("clinical records have unique identities, valid chronology and resolvable PDF links", () => {
  const identities = clinicalResults.map(result => `${result.sourceId}:${result.date}:${result.analyte}`)
  assert.equal(new Set(identities).size, identities.length)
  assert.deepEqual(clinicalResults.map(result => result.date), clinicalResults.map(result => result.date).sort())
  assert.ok(latestResults.length > 0)
  assert.ok(latestResults.every(result => result.sourceId === "october" && result.date === "2026-10-02" && result.reportedDate === "2026-10-05"))
  for (const source of Object.values(clinicalSources)) assert.equal(readFileSync(new URL(`../public${source.href}`, import.meta.url)).subarray(0, 5).toString(), "%PDF-", source.href)
  for (const result of clinicalResults) {
    assert.ok(Number.isInteger(result.publishedPage) && result.publishedPage > 0)
    assert.match(resultHref(result), /^\/reports\/[^/]+\.pdf#page=\d+$/)
    if (result.reportedDate) assert.ok(result.reportedDate >= result.date)
  }
  assert.equal(shortDate("2026-10-02"), "2 Oct 2026")
})

test("historical Ig limits are explicitly keyed by date and analyte, with primary-page provenance", () => {
  const expected = [
    ["Dec 2024", "IgM", "<21.0", "2024-11-29", "2024-12-04", "/reports/2024-nov-myeloma-panel-post-aki.pdf", 7],
    ["Dec 2024", "IgA", "<33.0", "2024-11-29", "2024-12-04", "/reports/2024-nov-myeloma-panel-post-aki.pdf", 7],
    ["Feb 2025", "IgM", "<21.0", "2025-02-07", "2025-02-10", "/reports/2025-feb-myeloma-panel-mrd.pdf", 5],
    ["Aug 2025", "IgM", "<21.0", "2025-08-20", "2025-08-21", "/reports/2025-aug-myeloma-screening-panel.pdf", 10],
    ["Apr 2026", "IgM", "<21.0", "2026-04-13", "2026-04-15", "/reports/2026-apr-latest-myeloma-followup.pdf", 8],
  ]
  assert.deepEqual(clinical.historicalIgLimits.map(({ legacyLabel, analyte, raw, specimenDate, reportedDate, file, page }) => [legacyLabel, analyte, raw, specimenDate, reportedDate, file, page]), expected)
  for (const [date, analyte, raw] of expected) {
    assert.equal(clinical.historicalIgChartValue(date, analyte, Number(raw.slice(1))), null)
    assert.equal(immunoglobulinChartData.find(row => row.date === date)[analyte], null)
  }
  assert.equal(clinical.historicalIgChartValue("May 2025", "IgM", 21), 21, "A numerical coincidence must not censor an unrelated measurement")
  assert.equal(clinical.historicalIgChartValue("Dec 2024", "IgG", 33), 33)
  assert.equal(immunoglobulinChartData.find(row => row.date === "May 2025").IgM, 28.4)
})

test("historical tooltips preserve exact Ig qualifiers and specimen/report dates", () => {
  const html = tooltip(immunoglobulinChartData.find(row => row.date === "Dec 2024"), ["IgG", "IgA", "IgM"])
  for (const text of ["IgG: 684", "IgA: &lt;33.0 mg/dL", "IgM: &lt;21.0 mg/dL", "Specimen: 2024-11-29", "source p. 7", "reported 2024-12-04"]) assert.ok(html.includes(text), text)
  assert.doesNotMatch(html, /Below reporting limit/)
})

test("current tooltips preserve below-limit results and distinguish requisition from specimen dates", () => {
  const august = immunoglobulinChartData.find(row => row.date === "28 Aug 2026")
  assert.deepEqual([august.IgG, august.IgA, august.IgM], [986, null, null])
  const igHtml = tooltip(august, ["IgG", "IgA", "IgM"])
  for (const text of ["IgG: 986.00 mg/dL", "IgA: &lt;15.0 mg/dL", "IgM: &lt;8.0 mg/dL", "source p. 12", "reported 2026-08-31"]) assert.ok(igHtml.includes(text), text)
  const kappa = oneResult(panelResults, "october", "2026-10-02", "kappa")
  assert.match(tooltip({ date: "2 Oct 2026", value: null, result: kappa }, ["value"]), /Kappa FLC: &lt; 0\.56 mg\/L/)
  const pgi = oneResult(inpatientResults, "pgi", "2026-07-01", "platelets")
  const pgiHtml = tooltip({ date: "1 Jul 2026", value: 26, result: pgi }, ["value"])
  assert.match(pgiHtml, /Platelets: 26 x10\^9\/L/)
  assert.match(pgiHtml, /Requisition: 2026-07-01; source p\. 34/)
  assert.equal(renderToStaticMarkup(React.createElement(ClinicalTooltip, { active: false })), "")
  assert.equal(renderToStaticMarkup(React.createElement(ClinicalTooltip, { active: true, payload: [] })), "")
  assert.match(pageSource, /filterNull=\{false\}/)
  assert.match(pageSource, /connectNulls=\{false\}/)
})

test("teclistamab doses match the signed original p3 and exclude later planned entries", () => {
  assert.deepEqual(clinical.teclistamabRecord.documentedDoses, [
    { date: "2026-06-30", mgPerKg: "0.06", mg: "4.5" },
    { date: "2026-07-03", mgPerKg: "0.3", mg: "22.5" },
    { date: "2026-07-07", mgPerKg: "1.5", mg: "112.5" },
    { date: "2026-07-14", mgPerKg: "1.5", mg: "112.5" },
  ])
  assert.deepEqual(clinical.teclistamabRecord.sourcePages, [1, 2, 3])
  assert.equal(clinical.teclistamabRecord.sourceId, "discharge")
  assert.equal(clinical.teclistamabRecord.admissionDate, "2026-06-27")
  assert.equal(clinical.teclistamabRecord.dischargeDate, "2026-07-15")
  assert.equal(clinicalSources.discharge.href, "/reports/2026-july-pgi-discharge-original.pdf")
  assert.match(clinical.teclistamabRecord.laterDoses, /planned doses only; administration is not established/)
})

test("age is attributed and new narrative does not turn dated evidence into a current assessment", () => {
  assert.match(pageSource, /Age \(2 Oct 2026 report\).*clinicalSources\.october\.href \+ "#page=1".*69 years/)
  for (const text of ["not a current-day assessment", "do not establish marrow MRD status or a treatment-response category", "No new disease stage is assigned", "Current medications and later planned teclistamab administrations are not confirmed"]) assert.ok(pageSource.includes(text), text)
  assert.doesNotMatch(pageSource, /Active Concerns as of May 2026|Not repeated since/)
})
