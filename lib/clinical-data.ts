// Transcribed from primary reports. Dates are ISO calendar dates, never inferred from filenames.
export type Analyte = "kappa" | "lambda" | "ratio" | "IgG" | "IgA" | "IgM" | "hemoglobin" | "anc" | "platelets" | "egfr" | "creatinine" | "tlc" | "calcium" | "albumin" | "ldh" | "beta2" | "mSpike" | "ife" | "potassium" | "phosphorus" | "uacr"
export type ClinicalSource = { file: string; href: string; pageOffset?: number; singlePhysicalPage?: boolean }
export const clinicalSources = {
  may: { file: "vipan garg myeloma report May 2026.pdf", href: "/reports/2026-may-myeloma-final-report.pdf" },
  july: { file: "444713279_Report_F_SL_2026-08-01T160203_report.pdf", href: "/reports/2026-july-myeloma-final-report.pdf", singlePhysicalPage: true },
  august: { file: "349fb33c-0c27-41f1-9c49-233ef8e8ff3a.pdf", href: "/reports/2026-august-myeloma-final-report.pdf" },
  october: { file: "2026-october-myeloma-final-report.pdf", href: "/reports/2026-october-myeloma-final-report.pdf" },
  pgi: { file: "PGI Reports_merged.pdf", href: "/reports/2026-june-pgi-reports.pdf", pageOffset: -30 },
  discharge: { file: "discharge-summary_organized.pdf", href: "/reports/2026-july-pgi-discharge-original.pdf" },
  dec2024: { file: "Papa EHR/Mr Vipin Kumar Garg (1).pdf", href: "/reports/2024-december-23-nephrology-labs.pdf" },
  jan2025: { file: "Papa EHR/Mr Vipin Kumar Garg (2).pdf", href: "/reports/2025-january-23-nephrology-labs.pdf" },
  mar2025: { file: "Papa EHR/WhatsApp Document.pdf", href: "/reports/2025-march-03-max-labs.pdf" },
  mar31: { file: "Papa EHR/Vipin Kumar Garg (1).pdf", href: "/reports/2025-march-31-nephrology-labs.pdf" },
  apr8: { file: "Papa EHR/Mr. Vipin Kumar Garg.pdf", href: "/reports/2025-april-08-renal-labs.pdf" },
  apr29: { file: "Papa EHR/Mr. Vipin Kumar Garg (1).pdf", href: "/reports/2025-april-29-max-labs.pdf" },
  may2025: { file: "Reading & Research/WhatsApp Report May 21 2025.pdf", href: "/reports/2025-may-21-kidney-function.pdf" },
  aug2025: { file: "IBKR Papa Account/Mr VIPIN KUMAR GARG.pdf", href: "/reports/2025-august-27-kidney-urine-screening.pdf" },
} satisfies Record<string, ClinicalSource>

type SourceId = keyof typeof clinicalSources
export type ClinicalResult = {
  analyte: Analyte; raw: string; unit: string; reference?: string; value: number | null;
  qualifier: "exact" | "<" | "uncertain" | "not-reported" | "text";
  date: string; dateBasis: "specimen" | "requisition"; specimenDate: string | null;
  reportedDate: string | null; sourceId: SourceId; sourcePage: number; publishedPage: number;
  sourcePhysicalPage: number; note?: string;
}
type Row = [Analyte, string, string, number, string?, string?]

// Never parseFloat a censored/uncertain result: a reporting limit is not a measurement.
export function exactValue(raw: string): number | null {
  return /^\d+(?:\.\d+)?$/.test(raw.trim()) ? Number(raw) : null
}
function results(sourceId: SourceId, date: string, reportedDate: string | null, rows: Row[], dateBasis: ClinicalResult["dateBasis"] = "specimen"): ClinicalResult[] {
  const source: ClinicalSource = clinicalSources[sourceId]
  return rows.map(([analyte, raw, unit, sourcePage, reference, note]) => ({
    analyte, raw, unit, reference, note, value: exactValue(raw), date, reportedDate, dateBasis,
    specimenDate: dateBasis === "specimen" ? date : null, sourceId, sourcePage,
    sourcePhysicalPage: source.singlePhysicalPage ? 1 : sourcePage,
    publishedPage: sourcePage + (source.pageOffset ?? 0),
    qualifier: raw.trim().startsWith("<") ? "<" : raw.startsWith("?") ? "uncertain" : raw === "-" ? "not-reported" : exactValue(raw) !== null ? "exact" : "text",
  }))
}

export const panelDates = [
  { sourceId: "may", specimenDate: "2026-05-28", specimenTime: "09:18:00", reportedDate: "2026-05-30", reportedTime: "15:17:21", status: "Final" },
  { sourceId: "july", specimenDate: "2026-07-30", specimenTime: "09:02:00", reportedDate: "2026-08-01", reportedTime: "16:00:59", status: "Final" },
  { sourceId: "august", specimenDate: "2026-08-28", specimenTime: "07:49:00", reportedDate: "2026-08-31", reportedTime: "13:06:35", status: "Final" },
  { sourceId: "october", specimenDate: "2026-10-02", specimenTime: "09:01:00", reportedDate: "2026-10-05", reportedTime: "12:33:39", status: "Final" },
] as const

export const panelResults: ClinicalResult[] = [
  ...results("may", "2026-05-28", "2026-05-30", [
    ["hemoglobin", "11.60", "g/dL", 1, "13.00 - 17.00"], ["anc", "3.51", "thou/mm3", 1, "2.00 - 7.00"],
    ["tlc", "5.10", "thou/mm3", 1, "4.00 - 10.00"], ["platelets", "110", "thou/mm3", 2, "150.00 - 410.00"],
    ["albumin", "4.30", "g/dL", 3, "3.20 - 4.60"], ["calcium", "9.70", "mg/dL", 3, "8.80 - 10.20"], ["ldh", "151.00", "U/L", 3, "120 - 246"],
    ["creatinine", "2.08", "mg/dL", 5, "0.70 - 1.30"], ["egfr", "34", "mL/min/1.73m2", 5, ">59", "Lab-reported CKD-EPI 2021"],
    ["mSpike", "0.30", "g/dL", 6], ["ife", "IgG Kappa and its (?) isomer as IgG Kappa", "", 8], ["beta2", "7669", "ng/mL", 9, "609.00 - 2366.00"],
    ["IgG", "748.00", "mg/dL", 10, "650.00 - 1600.00"], ["IgM", "<21.0", "mg/dL", 10, "50.00 - 300.00"], ["IgA", "93.90", "mg/dL", 10, "40.00 - 350.00"],
    ["kappa", "130.32", "mg/L", 11, "3.30 - 19.40"], ["lambda", "22.81", "mg/L", 11, "5.71 - 26.30"], ["ratio", "5.713", "", 11, "0.26 - 1.65"],
  ]),
  ...results("july", "2026-07-30", "2026-08-01", [
    ["hemoglobin", "12.70", "g/dL", 1, "13.00 - 17.00"], ["anc", "5.10", "thou/mm3", 1, "2.00 - 7.00"],
    ["tlc", "7.10", "thou/mm3", 1, "4.00 - 10.00"], ["platelets", "107", "thou/mm3", 2, "150.00 - 410.00"],
    ["albumin", "4.58", "g/dL", 3, "3.20 - 4.60"], ["calcium", "9.13", "mg/dL", 3, "8.80 - 10.20"], ["ldh", "243.00", "U/L", 3, "120 - 246"],
    ["creatinine", "1.60", "mg/dL", 5, "0.70 - 1.30"], ["egfr", "46", "mL/min/1.73m2", 5, ">59", "Lab-reported CKD-EPI 2021"],
    ["mSpike", "0.50", "g/dL", 6], ["ife", "IgG, Kappa", "", 8], ["beta2", "8708", "ng/mL", 9, "609.00 - 2366.00"],
    ["IgG", "826.00", "mg/dL", 9, "650.00 - 1600.00"], ["IgM", "<21.0", "mg/dL", 9, "50.00 - 300.00"], ["IgA", "<33.0", "mg/dL", 10, "40.00 - 350.00"],
    ["kappa", "120.39", "mg/L", 11, "3.30 - 19.40"], ["lambda", "1.35", "mg/L", 11, "5.71 - 26.30"], ["ratio", "89.178", "", 11, "0.26 - 1.65"],
  ]),
  ...results("august", "2026-08-28", "2026-08-31", [
    ["mSpike", "0.60", "g/dL", 1], ["ife", "IgG, Kappa", "", 3], ["beta2", "9933", "ng/mL", 4, "609.00 - 2366.00"],
    ["kappa", "1.27", "mg/L", 5, "3.30 - 19.40"], ["lambda", "< 1.32", "mg/L", 5, "5.71 - 26.30"],
    ["ratio", "Kappa lambda ratio cannot be calculated as the value of lambda is < 1.32.", "", 5],
    ["hemoglobin", "12.30", "g/dL", 7, "13.00 - 17.00"], ["anc", "1.70", "thou/mm3", 7, "2.00 - 7.00"],
    ["tlc", "3.36", "thou/mm3", 7, "4.00 - 10.00"], ["platelets", "175", "thou/mm3", 8, "150.00 - 410.00"],
    ["albumin", "4.33", "g/dL", 9, "3.20 - 4.60"], ["calcium", "8.72", "mg/dL", 9, "8.80 - 10.20"],
    ["creatinine", "1.44", "mg/dL", 11, "0.67 - 1.17"], ["egfr", "52", "mL/min/1.73m2", 11, ">59", "Lab-reported CKD-EPI 2021"],
    ["IgG", "986.00", "mg/dL", 12, "650.00 - 1600.00"], ["IgM", "<8.0", "mg/dL", 12, "50.00 - 300.00"], ["IgA", "<15.0", "mg/dL", 12, "40.00 - 350.00"],
    ["ldh", "317.00", "U/L", 13, "120 - 246"],
  ]),
  ...results("october", "2026-10-02", "2026-10-05", [
    ["hemoglobin", "12.80", "g/dL", 1, "13.00 - 17.00"], ["anc", "0.91", "thou/mm3", 1, "2.00 - 7.00"],
    ["tlc", "3.00", "thou/mm3", 1, "4.00 - 10.00"], ["platelets", "175", "thou/mm3", 2, "150.00 - 410.00"],
    ["albumin", "4.73", "g/dL", 3, "3.20 - 4.60"], ["calcium", "9.35", "mg/dL", 3, "8.80 - 10.20"], ["ldh", "294.00", "U/L", 3, "120 - 246"],
    ["creatinine", "1.43", "mg/dL", 5, "0.70 - 1.30"], ["egfr", "53", "mL/min/1.73m2", 5, ">59", "Lab-reported CKD-EPI 2021"],
    ["mSpike", "? 0.4", "g/dL", 6, undefined, "Suspicious non-discrete protein band in gamma globulin region, possibly Monoclonal gammopathy (p7)."],
    ["ife", "IgG, Kappa", "", 8], ["beta2", "8450", "ng/mL", 9, "609.00 - 2366.00"],
    ["IgG", "890.00", "mg/dL", 9, "650.00 - 1600.00"], ["IgM", "<21.0", "mg/dL", 9, "50.00 - 300.00"], ["IgA", "<33.0", "mg/dL", 10, "40.00 - 350.00"],
    ["kappa", "< 0.56", "mg/L", 11, "3.30 - 19.40"], ["lambda", "1.37", "mg/L", 11, "5.71 - 26.30"],
    ["ratio", "Kappa lambda ratio cannot be calculated as the value of Kappa is < 0.56.", "", 11],
  ]),
]

// Each tuple points to the original individual haemogram, not the generated summary on p30.
const inpatientCBC: [string, number, string, string, string][] = [
  ["2026-06-27", 66, "11.3", "152", "-"], ["2026-06-30", 65, "11.1", "139", "4.47"],
  ["2026-07-01", 64, "11.1", "26", "7.8"], ["2026-07-02", 63, "10.7", "111", "4.08"],
  ["2026-07-03", 62, "11.2", "94", "3.9"], ["2026-07-04", 61, "11.4", "108", "7.7"],
  ["2026-07-06", 60, "12.0", "102", "3.8"], ["2026-07-07", 59, "12.9", "102", "4.1"],
  ["2026-07-09", 58, "11.5", "107", "5.08"], ["2026-07-10", 57, "11.6", "107", "5.12"],
  ["2026-07-11", 56, "11.5", "100", "-"], ["2026-07-13", 55, "10.6", "90", "3.59"], ["2026-07-14", 54, "11.1", "75", "3.9"],
]
const inpatientChemistry: [string, number, string, string, string, string][] = [
  ["2026-06-27", 43, "1.63", "4.50", "7.96", "2.37"], ["2026-06-30", 42, "1.44", "5.11", "7.92", "1.95"],
  ["2026-07-01", 41, "1.71", "4.65", "8.56", "2.20"], ["2026-07-02", 40, "1.89", "4.46", "7.68", "1.75"],
  ["2026-07-03", 39, "1.86", "4.36", "7.99", "2.12"], ["2026-07-04", 38, "1.68", "4.51", "8.48", "2.64"],
  ["2026-07-06", 37, "2.17", "3.97", "9.14", "3.50"], ["2026-07-07", 36, "2.16", "4.30", "9.62", "4.08"],
  ["2026-07-09", 35, "2.47", "4.10", "8.69", "3.76"], ["2026-07-10", 34, "2.12", "4.05", "8.33", "3.07"],
  ["2026-07-11", 33, "1.86", "4.23", "7.98", "2.66"], ["2026-07-13", 32, "1.37", "4.58", "7.94", "2.34"], ["2026-07-14", 31, "1.35", "4.43", "8.00", "2.06"],
]
export const inpatientResults = [
  ...inpatientCBC.flatMap(([date, page, hb, plt, anc]) => results("pgi", date, date, [
    ["hemoglobin", hb, "gm/dL", page, "13.5 - 17.5"], ["platelets", plt, "x10^9/L", page, "150 - 450"], ["anc", anc, "x10^9/L", page, "1.8 - 7.7"],
  ], "requisition")),
  ...inpatientChemistry.flatMap(([date, page, cr, k, ca, phos]) => results("pgi", date, null, [
    ["creatinine", cr, "mg/dL", page, "0.5 - 1.2", [39, 41].includes(page) ? "Source annotation: Corr.clini./Rpt" : undefined],
    ["potassium", k, "mmol/L", page, "3.5 - 5"], ["calcium", ca, "mg/dl", page, "8.8 - 10.2"], ["phosphorus", phos, "mg/dL", page, "2.7 - 4.5"],
  ], "requisition")),
]

export const olderResults = [
  ...results("dec2024", "2024-12-23", "2024-12-23", [["hemoglobin", "12.6", "g/dL", 1], ["anc", "5.02", "10*3/Ul", 1], ["platelets", "1.71", "Lacs/mm3", 1], ["creatinine", "1.83", "mg/dl", 2]]),
  ...results("jan2025", "2025-01-23", "2025-01-23", [["hemoglobin", "11.2", "g/dL", 1], ["anc", "1.86", "10*3/Ul", 1], ["platelets", "1.10", "Lacs/mm3", 1], ["creatinine", "1.65", "mg/dl", 2]]),
  ...results("mar2025", "2025-03-03", "2025-03-03", [["hemoglobin", "10.0", "g/dl", 4], ["anc", "1.73", "10~9/L", 4], ["platelets", "177", "10~9/L", 4], ["creatinine", "1.71", "mg/dL", 1], ["egfr", "42.96", "mL/min/1.73m2", 1, undefined, "Lab-reported CKD-EPI 2021; MDRD 40.10 is not mixed into this series"]]),
  ...results("mar31", "2025-03-31", "2025-03-31", [["hemoglobin", "10.7", "g/dL", 1], ["anc", "2.00", "10*3/Ul", 1], ["platelets", "1.33", "Lacs/mm3", 1], ["creatinine", "1.81", "mg/dl", 2], ["potassium", "6.60", "meq/L", 2]]),
  ...results("apr8", "2025-04-08", "2025-04-08", [["hemoglobin", "10.7", "g/dl", 2], ["anc", "3.76", "10~9/L", 2], ["platelets", "151", "10~9/L", 2]]),
  ...results("apr29", "2025-04-29", "2025-04-29", [["hemoglobin", "11.1", "g/dl", 4], ["anc", "1.48", "10~9/L", 4], ["platelets", "230", "10~9/L", 4], ["creatinine", "1.95", "mg/dL", 2], ["egfr", "36.66", "mL/min/1.73m2", 2, undefined, "Lab-reported CKD-EPI 2021; MDRD 34.44 is not mixed into this series"]]),
  ...results("may2025", "2025-05-21", "2025-05-21", [["creatinine", "1.93", "mg/dL", 1], ["egfr", "37", "mL/min/1.73m2", 1, ">59", "Lab-reported CKD-EPI 2021"]]),
  ...results("aug2025", "2025-08-27", "2025-08-27", [["creatinine", "1.83", "mg/dl", 1], ["potassium", "5.70", "meq/L", 1], ["uacr", "5.65", "mg/g creatinine", 3, "0.00 - 30.00"]]),
]

export const clinicalResults = [...olderResults, ...panelResults, ...inpatientResults].sort((a, b) => a.date.localeCompare(b.date))
export const latestResults = panelResults.filter(result => result.sourceId === "october")
// Preserve legacy month labels, but correct their plotted limits from the original primary pages.
export const historicalIgLimits = [
  { legacyLabel: "Dec 2024", analyte: "IgM", raw: "<21.0", specimenDate: "2024-11-29", reportedDate: "2024-12-04", file: "/reports/2024-nov-myeloma-panel-post-aki.pdf", page: 7 },
  { legacyLabel: "Dec 2024", analyte: "IgA", raw: "<33.0", specimenDate: "2024-11-29", reportedDate: "2024-12-04", file: "/reports/2024-nov-myeloma-panel-post-aki.pdf", page: 7 },
  { legacyLabel: "Feb 2025", analyte: "IgM", raw: "<21.0", specimenDate: "2025-02-07", reportedDate: "2025-02-10", file: "/reports/2025-feb-myeloma-panel-mrd.pdf", page: 5 },
  { legacyLabel: "Aug 2025", analyte: "IgM", raw: "<21.0", specimenDate: "2025-08-20", reportedDate: "2025-08-21", file: "/reports/2025-aug-myeloma-screening-panel.pdf", page: 10 },
  { legacyLabel: "Apr 2026", analyte: "IgM", raw: "<21.0", specimenDate: "2026-04-13", reportedDate: "2026-04-15", file: "/reports/2026-apr-latest-myeloma-followup.pdf", page: 8 },
] as const
export function historicalIgChartValue(date: string, analyte: string, value: number) {
  return historicalIgLimits.some(limit => limit.legacyLabel === date && limit.analyte === analyte) ? null : value
}
export const clinicalLabels: Record<Analyte, string> = {
  kappa: "Kappa FLC", lambda: "Lambda FLC", ratio: "Kappa/lambda ratio", IgG: "IgG", IgA: "IgA", IgM: "IgM", hemoglobin: "Hemoglobin", anc: "ANC", platelets: "Platelets", egfr: "eGFR", creatinine: "Creatinine", tlc: "Total leukocytes", calcium: "Calcium", albumin: "Albumin", ldh: "LDH", beta2: "Beta-2 microglobulin", mSpike: "M-spike", ife: "Immunofixation", potassium: "Potassium", phosphorus: "Phosphorus", uacr: "Urine albumin/creatinine",
}
export function resultHref(result: ClinicalResult) { return `${clinicalSources[result.sourceId].href}#page=${result.publishedPage}` }
export function shortDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`))
}
export function chartValue(result: ClinicalResult) {
  // 1 lac/mm3 = 100 x10^9/L; raw units and result remain unchanged for audit.
  return result.value === null ? null : result.value * (result.unit === "Lacs/mm3" ? 100 : 1)
}
export type ChartPoint = { date: string; value: number | null; result?: ClinicalResult; legacy?: boolean; sortKey: string }
export function chartSeries(analyte: Analyte, historical: { date: string; value: number }[]): ChartPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return [
    ...historical.map(({ date, value }) => { const [month, year] = date.split(" "); return { date, value, legacy: true, sortKey: `${year}-${String(months.indexOf(month) + 1).padStart(2, "0")}-00` } }),
    ...clinicalResults.filter(result => result.analyte === analyte).map(result => ({ date: shortDate(result.date), value: chartValue(result), result, sortKey: result.date })),
  ].sort((a, b) => a.sortKey.localeCompare(b.sortKey))
}

export const teclistamabRecord = {
  sourceId: "discharge" as const, sourcePages: [1, 2, 3], admissionDate: "2026-06-27", dischargeDate: "2026-07-15",
  documentedDoses: [{ date: "2026-06-30", mgPerKg: "0.06", mg: "4.5" }, { date: "2026-07-03", mgPerKg: "0.3", mg: "22.5" }, { date: "2026-07-07", mgPerKg: "1.5", mg: "112.5" }, { date: "2026-07-14", mgPerKg: "1.5", mg: "112.5" }],
  laterDoses: "Later entries are planned doses only; administration is not established by this source.",
}
