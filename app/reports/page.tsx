"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Calendar, Building, ChevronRight, ArrowLeft } from "lucide-react"

const reports = [
  {
    id: "april-2026-blood",
    title: "April 2026 Blood Reports",
    date: "April 13, 2026",
    lab: "Dr Lal PathLabs",
    description: "Complete Blood Count, Kidney Function Test, Multiple Myeloma Screening Panel, Immunoglobulin Profile, Kappa/Lambda Light Chains",
    file: "/reports/april-2026-blood-reports.pdf",
    category: "blood",
  },
  {
    id: "bone-marrow-may-2026",
    title: "Bone Marrow Biopsy Report",
    date: "May 2026",
    lab: "Oncology Center",
    description: "Bone Marrow Aspiration and Biopsy, Flow Cytometry, MRD Analysis",
    file: "/reports/bone-marrow-may-2026.pdf",
    category: "biopsy",
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const selectedReportData = reports.find((r) => r.id === selectedReport)

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
        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Reports List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Available Reports</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-left transition-all ${
                    selectedReport === report.id
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:shadow-md"
                  }`}
                >
                  <Card className={selectedReport === report.id ? "border-blue-500" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            report.category === "blood"
                              ? "bg-red-100 text-red-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm">{report.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            <span>{report.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <Building className="w-3 h-3" />
                            <span>{report.lab}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                            {report.description}
                          </p>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                            selectedReport === report.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Report Categories</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-slate-600">Blood Work / Lab Tests</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-purple-500" />
                  <span className="text-slate-600">Biopsy / Pathology</span>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Viewer Section */}
          <div className="lg:sticky lg:top-[160px] lg:self-start">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-slate-50 py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-500" />
                  {selectedReportData ? selectedReportData.title : "Select a Report"}
                </CardTitle>
                {selectedReportData && (
                  <div className="flex items-center gap-4 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {selectedReportData.date}
                    </Badge>
                    <span className="text-xs text-slate-500">{selectedReportData.lab}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0">
                {selectedReport && selectedReportData ? (
                  <div className="relative">
                    <iframe
                      src={selectedReportData.file}
                      className="w-full h-[calc(100vh-280px)] min-h-[600px] border-0"
                      title={selectedReportData.title}
                    />
                    <a
                      href={selectedReportData.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                    >
                      Open in New Tab
                    </a>
                  </div>
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
        <p>Medical Reports Archive — Last Updated: May 2026</p>
        <p className="mt-1">These documents are for medical reference purposes only.</p>
      </footer>
    </div>
  )
}
