"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, ArrowLeft, ExternalLink } from "lucide-react"

import { allReports, reports, secondaryReports } from "@/lib/reports"

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const selectedReportData = allReports.find((r) => r.id === selectedReport)
  const selectReport = (id: string) => {
    setSelectedReport(id)
    if (window.matchMedia("(max-width: 1023px)").matches) {
      document.getElementById("report-viewer")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Medical Reports</h1>
          <p className="text-slate-300 mt-1">Vipan Garg — Lab Reports and Diagnostic Documents</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-40">
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
          <div className="min-w-0 lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:pr-2">
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
                    onClick={() => selectReport(report.id)}
                    aria-pressed={selectedReport === report.id}
                    data-report-id={report.id}
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
                    <span className="min-w-0 flex-1 break-words">{report.title}</span>
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
                    onClick={() => selectReport(report.id)}
                    aria-pressed={selectedReport === report.id}
                    data-report-id={report.id}
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
                    <span className="min-w-0 flex-1 break-words text-xs">{report.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Viewer Section */}
          <div id="report-viewer" className="min-w-0 scroll-mt-20 lg:sticky lg:top-[72px] lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-slate-50 py-3 flex flex-row flex-wrap items-center justify-between gap-3">
                <CardTitle className="min-w-0 text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 shrink-0 text-slate-500" />
                  {selectedReportData 
                    ? `${selectedReportData.date} ${selectedReportData.year} — ${selectedReportData.title}` 
                    : "Select a Report"}
                </CardTitle>
                {selectedReportData && (
                  <a
                    href={selectedReportData.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
        <p>Medical Reports Archive — {reports.length} Primary + {secondaryReports.length} Secondary Documents • Last Updated: October 2026</p>
      </footer>
    </div>
  )
}
