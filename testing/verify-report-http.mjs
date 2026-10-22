import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import ts from "typescript"

const base = new URL(process.argv[2] ?? "http://127.0.0.1:3000")
assert.ok(["http:", "https:"].includes(base.protocol))
const source = readFileSync(new URL("../lib/reports.ts", import.meta.url), "utf8")
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } }).outputText
const { allReports } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`)
const assets = JSON.parse(readFileSync(new URL("./report-sources.json", import.meta.url), "utf8"))
for (const report of allReports) {
  const asset = assets.find(item => item.file === report.file)
  const response = await fetch(new URL(report.file, base), { headers: asset ? {} : { Range: "bytes=0-4" }, signal: AbortSignal.timeout(20000) })
  assert.ok(response.ok, `${report.file}: HTTP ${response.status}`)
  assert.match(response.headers.get("content-type") ?? "", /application\/pdf/)
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-", report.file)
  if (asset) assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, report.file)
}
console.log(`${base.origin}: ${allReports.length} PDF URLs passed; ${assets.length} updated asset hashes match.`)
