import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { execFileSync } from "node:child_process"
import test from "node:test"
import ts from "typescript"

const source = readFileSync(new URL("./clinical-data.ts", import.meta.url), "utf8")
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } })
const data = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`)
const result = (id, analyte) => data.panelResults.find(row => row.sourceId === id && row.analyte === analyte)

test("final panels retain specimen and finalization dates separately", () => {
  assert.deepEqual(data.panelDates.map(p => [p.specimenDate, p.reportedDate]), [["2026-05-28", "2026-05-30"], ["2026-07-30", "2026-08-01"], ["2026-08-28", "2026-08-31"], ["2026-10-02", "2026-10-05"]])
  for (const row of data.panelResults) assert.equal(row.date, row.specimenDate)
})

test("reporting limits, unreported results and uncertain values never become numbers", () => {
  for (const raw of ["< 0.56", "<21.0", "<8.0", "? 0.4", "-", "", "not calculable", "1.2 mg/L"]) assert.equal(data.exactValue(raw), null)
  for (const row of data.clinicalResults.filter(r => r.qualifier !== "exact")) assert.equal(data.chartValue(row), null)
  assert.equal(result("october", "kappa").raw, "< 0.56")
  assert.equal(result("august", "lambda").raw, "< 1.32")
  assert.match(result("august", "ratio").raw, /cannot be calculated.*lambda is < 1.32/)
  assert.match(result("october", "ratio").raw, /cannot be calculated.*Kappa is < 0.56/)
  assert.equal(result("october", "mSpike").raw, "? 0.4")
})

test("all six updated chart inputs match the four final panels", () => {
  for (const [key, values] of Object.entries({ kappa: [130.32, 120.39, 1.27, null], egfr: [34, 46, 52, 53], IgG: [748, 826, 986, 890], hemoglobin: [11.6, 12.7, 12.3, 12.8], anc: [3.51, 5.10, 1.70, 0.91], platelets: [110, 107, 175, 175] })) {
    assert.deepEqual(["may", "july", "august", "october"].map(id => result(id, key).value), values)
  }
  assert.deepEqual(["may", "july", "august", "october"].map(id => result(id, "IgM").raw), ["<21.0", "<21.0", "<8.0", "<21.0"])
  assert.deepEqual(["july", "august", "october"].map(id => result(id, "IgA").raw), ["<33.0", "<15.0", "<33.0"])
})

test("PGI uses individual source pages, requisition dates and unmodified printed counts", () => {
  assert.equal(data.inpatientResults.some(row => row.analyte === "egfr"), false)
  for (const row of data.inpatientResults) {
    assert.equal(row.dateBasis, "requisition")
    assert.equal(row.specimenDate, null)
    assert.ok(row.sourcePage >= 31 && row.sourcePage <= 67)
    assert.equal(row.publishedPage, row.sourcePage - 30)
  }
  assert.deepEqual(data.inpatientResults.filter(r => r.analyte === "anc" && r.value === null).map(r => r.date), ["2026-06-27", "2026-07-11"])
  const july1 = data.inpatientResults.find(r => r.date === "2026-07-01" && r.analyte === "platelets")
  assert.deepEqual([july1.raw, july1.sourcePage, july1.publishedPage], ["26", 64, 34])
  assert.equal(data.inpatientResults.find(r => r.date === "2026-07-14" && r.analyte === "platelets").value, 75)
})

test("older platelet units convert explicitly and month-only history is retained", () => {
  const row = data.olderResults.find(r => r.sourceId === "dec2024" && r.analyte === "platelets")
  assert.equal(row.raw, "1.71")
  assert.equal(row.unit, "Lacs/mm3")
  assert.equal(data.chartValue(row), 171)
  const legacy = [{ date: "May 2025", value: 39 }]
  const series = data.chartSeries("egfr", legacy)
  assert.equal(series.find(r => r.legacy).date, "May 2025")
  assert.ok(series.some(r => r.result?.date === "2025-05-21" && r.value === 37))
  assert.deepEqual(legacy, [{ date: "May 2025", value: 39 }])
  assert.equal(data.chartSeries("kappa", []).at(-1).value, null)
})

test("every source result has a valid published source page; July keeps physical/printed distinction", () => {
  const pageCounts = new Map()
  for (const row of data.clinicalResults) {
    const file = "public" + data.clinicalSources[row.sourceId].href
    assert.ok(existsSync(file), file)
    if (!pageCounts.has(file)) pageCounts.set(file, Number(execFileSync("pdfinfo", [file], { encoding: "utf8" }).match(/^Pages:\s+(\d+)/m)[1]))
    assert.ok(row.publishedPage > 0 && row.publishedPage <= pageCounts.get(file), `${row.sourceId} p${row.publishedPage}`)
    assert.match(data.resultHref(row), /#page=\d+$/)
    if (row.sourceId === "july") assert.equal(row.sourcePhysicalPage, 1)
  }
})

test("numeric and censored clinical strings are present on the cited primary PDF page", () => {
  const pages = new Map()
  for (const row of data.clinicalResults.filter(r => ["exact", "<", "uncertain"].includes(r.qualifier))) {
    const key = `${row.sourceId}:${row.publishedPage}`
    if (!pages.has(key)) pages.set(key, execFileSync("pdftotext", ["-f", String(row.publishedPage), "-l", String(row.publishedPage), "-layout", "public" + data.clinicalSources[row.sourceId].href, "-"], { encoding: "utf8" }).replace(/\s+/g, ""))
    assert.ok(pages.get(key).includes(row.raw.replace(/\s+/g, "")), `${key}: ${row.analyte} ${row.raw}`)
  }
})

test("documented teclistamab schedule does not claim later planned administrations", () => {
  assert.deepEqual(data.teclistamabRecord.documentedDoses.map(r => r.date), ["2026-06-30", "2026-07-03", "2026-07-07", "2026-07-14"])
  assert.equal(data.teclistamabRecord.admissionDate, "2026-06-27")
  assert.equal(data.teclistamabRecord.dischargeDate, "2026-07-15")
  assert.match(data.teclistamabRecord.laterDoses, /planned.*not established/)
})

test("historical Ig gaps have explicit primary reporting-limit evidence, not threshold inference", () => {
  for (const limit of data.historicalIgLimits) {
    const text = execFileSync("pdftotext", ["-f", String(limit.page), "-l", String(limit.page), "-layout", "public" + limit.file, "-"], { encoding: "utf8" })
    const line = text.split("\n").find(line => line.includes(`Immunogloublin ${limit.analyte},`))
    assert.ok(line.includes(limit.raw), `${limit.file}: ${limit.analyte}`)
    assert.equal(data.historicalIgChartValue(limit.legacyLabel, limit.analyte, Number(limit.raw.slice(1))), null)
  }
  assert.equal(data.historicalIgChartValue("May 2025", "IgM", 28.4), 28.4)
  assert.equal(data.historicalIgChartValue("Unverified date", "IgM", 21), 21)
})
