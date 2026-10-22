import assert from "node:assert/strict"
import { readFileSync, statSync } from "node:fs"
import test from "node:test"
import ts from "typescript"

const source = readFileSync(new URL("../app/reports/page.tsx", import.meta.url), "utf8")
const page = ts.createSourceFile("page.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
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

test("October and July appear above the existing June reports", () => {
  assert.deepEqual(reports.slice(0, 4).map((report) => report.id), [
    ...additions.map((report) => report.id), "2026-june-pre-teclista", "2026-june-pgi-reports",
  ])
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
