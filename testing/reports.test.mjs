import assert from "node:assert/strict"
import { readFileSync, statSync } from "node:fs"
import { createHash } from "node:crypto"
import test from "node:test"
import ts from "typescript"

const source = readFileSync(new URL("../app/reports/page.tsx", import.meta.url), "utf8")
const catalog = readFileSync(new URL("../lib/reports.ts", import.meta.url), "utf8")
const page = ts.createSourceFile("reports.ts", catalog, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
const declarations = page.statements.filter(ts.isVariableStatement).flatMap((statement) => statement.declarationList.declarations)

// Inspect the actual page data without evaluating a client component or duplicating its catalog.
function readReports(name) {
  const declaration = declarations.find((item) => item.name.getText(page) === name)
  assert.ok(declaration?.initializer && ts.isArrayLiteralExpression(declaration.initializer), `${name} must be an array`)
  return declaration.initializer.elements.map((element) => {
    assert.ok(ts.isObjectLiteralExpression(element), `${name} entries must be objects`)
    return Object.fromEntries(element.properties.map((property) => {
      assert.ok(ts.isPropertyAssignment(property) && ts.isStringLiteral(property.initializer), "Report fields must be strings")
      return [property.name.getText(page), property.initializer.text]
    }))
  })
}

const reports = readReports("reports")
const allReports = [...reports, ...readReports("secondaryReports")]
const additions = [
  { id: "2026-october-myeloma-final", year: "2026", date: "October", title: "Myeloma Follow-up - Final Report (5 October)", file: "/reports/2026-october-myeloma-final-report.pdf" },
  { id: "2026-july-pgi-discharge", year: "2026", date: "July", title: "PGI Discharge Summary - Teclistamab Initiation", file: "/reports/2026-july-pgi-discharge-summary.pdf" },
]

for (const expected of additions) {
  test(`primary report: ${expected.title}`, () => {
    assert.deepEqual(reports.find((report) => report.id === expected.id), expected)
  })
}

test("new 2026 panels are ordered by sample date above the older reports", () => {
  assert.deepEqual(reports.slice(0, 7).map((report) => report.id), [
    "2026-october-myeloma-final", "2026-august-myeloma-final", "2026-july-myeloma-final",
    "2026-july-pgi-discharge", "2026-june-pgi-reports", "2026-june-pre-teclista", "2026-may-myeloma-final",
  ])
})

test("all reviewed assets are catalogued and match the verified source manifest", () => {
  const assets = JSON.parse(readFileSync(new URL("./report-sources.json", import.meta.url), "utf8"))
  assert.equal(assets.length, 16)
  assert.equal(allReports.length, 51)
  for (const asset of assets) {
    assert.ok(allReports.some((report) => report.file === asset.file), `Unlisted ${asset.file}`)
    const contents = readFileSync(new URL(`../public${asset.file}`, import.meta.url))
    assert.equal(createHash("sha256").update(contents).digest("hex"), asset.sha256)
    assert.equal(contents.subarray(0, 5).toString(), "%PDF-")
  }
  assert.equal(assets.find((asset) => asset.file.includes("2026-july-myeloma")).pages, 13)
  assert.equal(assets.find((asset) => asset.file.includes("2026-june-pgi")).pages, 37)
  assert.deepEqual(assets.find((asset) => asset.file.includes("discharge-original")).transformation.sourcePages, [1, 2, 3])
})

test("the home page and report viewer share the same report count source", () => {
  const home = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8")
  assert.match(home, /allReports\.length/)
  assert.match(source, /aria-pressed=\{selectedReport === report\.id\}/)
})

test("primary and secondary reports have unique IDs and paths", () => {
  for (const field of ["id", "file"]) {
    assert.equal(new Set(allReports.map((report) => report[field])).size, allReports.length, `Duplicate ${field}`)
  }
})

test("every report points to an existing nonempty public PDF", () => {
  for (const report of allReports) {
    assert.match(report.file, /^\/reports\/[^/]+\.pdf$/)
    const file = statSync(new URL(`../public${report.file}`, import.meta.url))
    assert.ok(file.isFile() && file.size > 0, `Missing or empty PDF: ${report.file}`)
  }
})

test("the archive footer is updated to October 2026", () => {
  assert.ok(source.includes("Last Updated: October 2026"))
})
