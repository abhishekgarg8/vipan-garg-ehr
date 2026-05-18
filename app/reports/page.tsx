"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, ArrowLeft, ExternalLink } from "lucide-react"

const reports = [
  // 2026
  { id: "2026-apr-latest", year: "2026", date: "April", title: "Latest Myeloma Followup — CBC, Renal, SPEP, IFE, FLC", file: "/reports/2026-apr-latest-myeloma-followup.pdf" },
  { id: "bone-marrow-may-2026", year: "2026", date: "May", title: "Bone Marrow Biopsy & Flow Cytometry MRD", file: "/reports/bone-marrow-may-2026.pdf" },
  { id: "april-2026-blood", year: "2026", date: "April", title: "Blood Reports (CBC, KFT, Myeloma Panel)", file: "/reports/april-2026-blood-reports.pdf" },
  { id: "march-2026-pet-ct", year: "2026", date: "March", title: "PET CT Scan — Whole Body Imaging", file: "/reports/2026-march-pet-ct.pdf" },
  { id: "2026-2025-kft-cbc", year: "2026-2025", date: "Jan-Apr", title: "Serial KFT & CBC Reports (Jan-Mar 2026)", file: "/reports/2026-2025-kft-cbc.pdf" },
  // 2025
  { id: "2025-aug-discharge", year: "2025", date: "August", title: "Discharge Summary — Maintenance Treatment", file: "/reports/2025-aug-discharge-summary.pdf" },
  { id: "2025-aug-screening", year: "2025", date: "August", title: "Myeloma Screening Panel", file: "/reports/2025-aug-myeloma-screening-panel.pdf" },
  { id: "dec-2025-myeloma", year: "2025", date: "December", title: "Myeloma Panel (FLC + SPE)", file: "/reports/2025-december-myeloma-panel.pdf" },
  { id: "aug-2025-myeloma", year: "2025", date: "August", title: "Myeloma Screening Panel", file: "/reports/2025-august-myeloma-panel.pdf" },
  { id: "2025-feb-mrd", year: "2025", date: "February", title: "Myeloma Panel — MRD Negative", file: "/reports/2025-feb-myeloma-panel-mrd.pdf" },
  { id: "2025-kft-cbc", year: "2025", date: "Jul-Dec", title: "Serial KFT & CBC Reports (Jul-Dec 2025)", file: "/reports/2025-kft-cbc.pdf" },
  // 2024
  { id: "2024-sep-renal", year: "2024", date: "September", title: "Renal Hospitalization — Medanta Files", file: "/reports/2024-sep-renal-hospitalization.pdf" },
  { id: "2024-nov-aki", year: "2024", date: "November", title: "Myeloma Panel (Post-AKI)", file: "/reports/2024-nov-myeloma-panel-post-aki.pdf" },
  { id: "2024-nov-biopsy", year: "2024", date: "November", title: "Kidney Biopsy — Carfilzomib TMA", file: "/reports/2024-nov-kidney-biopsy-tma.pdf" },
  { id: "2024-mar-relapse", year: "2024", date: "March", title: "Myeloma Panel — Relapse Baseline", file: "/reports/2024-mar-myeloma-panel-relapse.pdf" },
  { id: "2024-feb-bm-mrd", year: "2024", date: "February", title: "Bone Marrow — MRD Positive (Relapse)", file: "/reports/2024-feb-relapse-bone-marrow-mrd.pdf" },
  { id: "2024-feb-pet-ct", year: "2024", date: "February", title: "PET CT Scan — Relapse Confirmation", file: "/reports/2024-feb-relapse-pet-ct.pdf" },
  // 2023
  { id: "2023-aug-maintenance", year: "2023", date: "August", title: "MRD Negative — Maintenance Period", file: "/reports/2023-aug-mrd-negative-maintenance.pdf" },
  // 2022
  { id: "2022-sept-response", year: "2022", date: "September", title: "Treatment Response — Myeloma Reports", file: "/reports/2022-sept-treatment-response.pdf" },
  { id: "2022-dec-remission", year: "2022", date: "December", title: "MRD Negative — Complete Remission", file: "/reports/2022-dec-mrd-negative-remission.pdf" },
  { id: "2022-dx-imaging", year: "2022", date: "Diagnosis", title: "Diagnosis Imaging — PET CT & MRI (Baseline)", file: "/reports/2022-diagnosis-pet-ct-mri.pdf" },
  { id: "2022-dx-bm", year: "2022", date: "Diagnosis", title: "Diagnosis Bone Marrow — FISH, SPEP, FLC", file: "/reports/2022-diagnosis-bone-marrow-fish.pdf" },
]

const secondaryReports = [
  // 2025
  { id: "2025-sep-discharge", year: "2025", date: "September", title: "Discharge Slip & Bill", file: "/reports/2025-sep-discharge-slip-bill.pdf" },
  { id: "2025-feb-10-lab", year: "2025", date: "February 10", title: "Lab Report", file: "/reports/2025-feb-10-lab-report.pdf" },
  // 2024
  { id: "2024-sep-synergy-reports", year: "2024", date: "September", title: "Synergy Reports", file: "/reports/2024-sep-synergy-reports.pdf" },
  { id: "2024-sep-synergy-discharge", year: "2024", date: "September", title: "Synergy Discharge Summary", file: "/reports/2024-sep-synergy-discharge-summary.pdf" },
  { id: "2024-apr-pgi-discharge", year: "2024", date: "April", title: "PGI Discharge Summary", file: "/reports/2024-apr-pgi-discharge-summary.pdf" },
  { id: "2024-apr-amrita-bmt", year: "2024", date: "April", title: "Amrita BMT — Patient Summary", file: "/reports/2024-apr-amrita-bmt-summary.pdf" },
  { id: "2024-apr-ehr-history", year: "2024", date: "April", title: "EHR History — CAR-T & BMT Context", file: "/reports/2024-apr-ehr-history-car-t-bmt.pdf" },
  { id: "2024-jan-mm-history", year: "2024", date: "January", title: "MM History — Relapse Marker Context", file: "/reports/2024-jan-mm-history-relapse-context.pdf" },
  // 2022
  { id: "2022-aug-myeloma-followup", year: "2022", date: "August", title: "Myeloma Followup — After 5 Weeks Chemo", file: "/reports/2022-aug-myeloma-followup-5weeks.pdf" },
  { id: "2022-aug-spine-mri", year: "2022", date: "August", title: "Spine MRI Report", file: "/reports/2022-aug-spine-mri-report.pdf" },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const allReports = [...reports, ...secondaryReports]
  const selectedReportData = allReports.find((r) => r.id === selectedReport)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-slate-300 mt-1">Vipan Garg — Lab Reports and Diagnostic Documents</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 py-3 px-4 sticky top-[88px] z-40">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Medical History
          </Link>
          <span className="text-sm px-3 py-1 rounded-full bg-blue-600 text-white">Reports</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Reports List */}
          <div>
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium">
                Click on any report below to view it in the PDF viewer.
              </p>
            </div>

            <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Reports</h2>
            
            <ul className="space-y-2 mb-8 pb-8 border-b border-slate-200">
              {reports.map((report) => (
                <li key={report.id}>
                  <button
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                      selectedReport === report.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="font-medium">{report.year}</span>
                    <span className={selectedReport === report.id ? "text-blue-200" : "text-slate-400"}>•</span>
                    <span className={selectedReport === report.id ? "text-blue-100" : "text-slate-500"}>{report.date}</span>
                    <span className={selectedReport === report.id ? "text-blue-200" : "text-slate-400"}>•</span>
                    <span className="flex-1">{report.title}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Secondary Reports */}
            <h3 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wide text-slate-600">Secondary Reports</h3>
            <ul className="space-y-2">
              {secondaryReports.map((report) => (
                <li key={report.id}>
                  <button
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                      selectedReport === report.id
                        ? "bg-slate-400 text-white"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="font-medium">{report.year}</span>
                    <span className={selectedReport === report.id ? "text-slate-200" : "text-slate-400"}>•</span>
                    <span className={selectedReport === report.id ? "text-slate-100" : "text-slate-500"}>{report.date}</span>
                    <span className={selectedReport === report.id ? "text-slate-200" : "text-slate-400"}>•</span>
                    <span className="flex-1 text-xs">{report.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Viewer Section */}
          <div className="lg:sticky lg:top-[160px] lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-slate-50 py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  {selectedReportData 
                    ? `${selectedReportData.date} ${selectedReportData.year} — ${selectedReportData.title}` 
                    : "Select a Report"}
                </CardTitle>
                {selectedReportData && (
                  <a
                    href={selectedReportData.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Tab
                  </a>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {selectedReport && selectedReportData ? (
                  <iframe
                    src={selectedReportData.file}
                    className="w-full h-[calc(100vh-280px)] min-h-[600px] border-0"
                    title={selectedReportData.title}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
                    <FileText className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No report selected</p>
                    <p className="text-sm mt-1">Click on a report from the list to view it</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-500 py-8 border-t border-slate-200 mt-8">
        <p>Medical Reports Archive — {reports.length} Primary + {secondaryReports.length} Secondary Documents • Last Updated: May 2026</p>
      </footer>
    </div>
  )
}
