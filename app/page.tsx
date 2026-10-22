"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  type TooltipProps,
} from "recharts"
import Link from "next/link"
import { FileText } from "lucide-react"
import { allReports } from "@/lib/reports"
import { chartSeries, chartValue, clinicalLabels, clinicalSources, historicalIgChartValue, historicalIgLimits, latestResults, panelDates, panelResults, resultHref, shortDate, teclistamabRecord, type Analyte, type ClinicalResult } from "@/lib/clinical-data"

// Historical month-level summaries retained; exact specimen dates were not established for these arrays.
const kappaFLCData = [
  { date: "May 2022", value: 857, event: "Diagnosis" },
  { date: "Jul 2022", value: 16.97, event: "After 4 cycles" },
  { date: "Feb 2023", value: 8.08, event: "Nadir (best)" },
  { date: "May 2023", value: 16.65, event: "Maintenance" },
  { date: "Aug 2023", value: 23.08, event: "Pre-USA trip" },
  { date: "Dec 2023", value: 56.82, event: "Relapse suspected" },
  { date: "Jan 2024", value: 92.94, event: "Relapse confirmed" },
  { date: "May 2024", value: 21, event: "During salvage" },
  { date: "Dec 2024", value: 20.31, event: "Post-AKI" },
  { date: "Feb 2025", value: 46.57, event: "Maintenance" },
  { date: "May 2025", value: 48.70, event: "Maintenance" },
  { date: "Aug 2025", value: 38.71, event: "Maintenance" },
  { date: "Dec 2025", value: 37.53, event: "Maintenance" },
  { date: "Apr 2026", value: 97.65, event: "Disease escape" },
]

const eGFRData = [
  { date: "Jan 2023", value: 80, status: "Normal" },
  { date: "Aug 2023", value: 60, status: "Mild decline" },
  { date: "Dec 2023", value: 59, status: "Borderline" },
  { date: "Sep 2024", value: 10, status: "Severe AKI" },
  { date: "Feb 2025", value: 40, status: "G3b CKD" },
  { date: "May 2025", value: 39, status: "G3b CKD" },
  { date: "Jul 2025", value: 38.74, status: "G3b CKD" },
  { date: "Aug 2025", value: 43, status: "G3b CKD" },
  { date: "Sep 2025", value: 40.26, status: "G3b CKD" },
  { date: "Oct 2025", value: 41.62, status: "G3b CKD" },
  { date: "Nov 2025", value: 48.12, status: "G3a improving" },
  { date: "Dec 2025", value: 51.67, status: "G3a improving" },
  { date: "Jan 2026", value: 51.22, status: "G3a" },
  { date: "Feb 2026", value: 44.57, status: "G3b decline" },
  { date: "Mar 2026", value: 45.21, status: "G3a/b border" },
  { date: "Apr 2026", value: 40, status: "G3b CKD" },
]

const immunoglobulinData = [
  { date: "Dec 2024", IgG: 684, IgA: 33, IgM: 21 },
  { date: "Feb 2025", IgG: 736, IgA: 52.7, IgM: 21 },
  { date: "May 2025", IgG: 656, IgA: 36.6, IgM: 28.4 },
  { date: "Aug 2025", IgG: 515, IgA: 59.1, IgM: 21 },
  { date: "Apr 2026", IgG: 752, IgA: 88.4, IgM: 21 },
]

const hemoglobinData = [
  { date: "Feb 2023", value: 11.5 },
  { date: "May 2023", value: 11.7 },
  { date: "Aug 2023", value: 11.0 },
  { date: "Dec 2023", value: 10.4 },
  { date: "Feb 2025", value: 10.6 },
  { date: "May 2025", value: 11.9 },
  { date: "Jul 2025", value: 12.2 },
  { date: "Aug 2025", value: 11.1 },
  { date: "Sep 2025", value: 11.4 },
  { date: "Oct 2025", value: 11.3 },
  { date: "Nov 2025", value: 12.5 },
  { date: "Dec 2025", value: 12.2 },
  { date: "Jan 2026", value: 11.8 },
  { date: "Feb 2026", value: 12.0 },
  { date: "Mar 2026", value: 12.6 },
  { date: "Apr 2026", value: 12.4 },
]

const ancData = [
  { date: "Feb 2025", value: 1.73 },
  { date: "May 2025", value: 1.63 },
  { date: "Jul 2025", value: 1.69 },
  { date: "Aug 2025", value: 1.48 },
  { date: "Sep 2025", value: 1.60 },
  { date: "Oct 2025", value: 1.56 },
  { date: "Nov 2025", value: 2.80 },
  { date: "Dec 2025", value: 2.21 },
  { date: "Jan 2026", value: 1.42 },
  { date: "Feb 2026", value: 1.33 },
  { date: "Mar 2026", value: 1.10 },
  { date: "Apr 2026", value: 1.45 },
]

const plateletData = [
  { date: "Feb 2025", value: 167 },
  { date: "May 2025", value: 102 },
  { date: "Jul 2025", value: 195 },
  { date: "Aug 2025", value: 141 },
  { date: "Sep 2025", value: 200 },
  { date: "Oct 2025", value: 131 },
  { date: "Nov 2025", value: 236 },
  { date: "Dec 2025", value: 243 },
  { date: "Jan 2026", value: 178 },
  { date: "Feb 2026", value: 149 },
  { date: "Mar 2026", value: 123 },
  { date: "Apr 2026", value: 110 },
]

export default function MedicalHistory() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold">Vipan Kumar Garg - Medical History</h1>
          <p className="text-slate-300 mt-1">Multiple Myeloma Patient - records through 5 October 2026</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 py-3 px-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2 items-center">
          {/* Reports Tab - Highlighted First */}
          <Link 
            href="/reports" 
            className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Reports</span>
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded">{allReports.length} files</span>
          </Link>
          
          <div className="w-px h-6 bg-slate-300 mx-1" />
          
          <a href="#profile" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Profile</a>
          <a href="#timeline" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Timeline</a>
          <a href="#treatment" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Treatment</a>
          <a href="#markers" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Markers</a>
          <a href="#concerns" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Concerns</a>
          <a href="#charts" className="text-sm px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors">Charts</a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 [&_section]:scroll-mt-44 sm:[&_section]:scroll-mt-24 [&_td]:align-top [&_td]:break-words">
        {/* Section 1: Patient Profile */}
        <section id="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Basic Information</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b"><td className="py-2 text-slate-500">Name</td><td className="py-2 font-medium">Vipan Kumar Garg (= Vipin Kumar Garg)</td></tr>
                      <tr className="border-b"><td className="py-2 text-slate-500">Age (2 Oct 2026 report)</td><td className="py-2 font-medium"><a className="text-blue-700 underline" href={clinicalSources.october.href + "#page=1"}>69 years</a></td></tr>
                      <tr className="border-b"><td className="py-2 text-slate-500">Height / Weight</td><td className="py-2 font-medium">5&apos;11&quot; / 74 kg (165 lbs)</td></tr>
                      <tr><td className="py-2 text-slate-500">Blood Type</td><td className="py-2 font-medium">B+ve</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Family History</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800"><strong>Mother:</strong> Had Multiple Myeloma</p>
                    <p className="text-sm text-amber-800"><strong>Maternal Uncle:</strong> Had Multiple Myeloma</p>
                    <p className="text-sm text-amber-700 mt-2 italic">Family history recorded in the prior history.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Comorbidities</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-2 px-3 font-medium">Condition</th>
                        <th className="text-left py-2 px-3 font-medium">Previously recorded management</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2 px-3">Asthma (~20 years)</td><td className="py-2 px-3">Foracort 200 inhaler + Montair LC (daily)</td></tr>
                      <tr className="border-b"><td className="py-2 px-3">Hypertension (~5 years)</td><td className="py-2 px-3">Telmisartan 40mg (daily)</td></tr>
                      <tr className="border-b"><td className="py-2 px-3">Pre-diabetes (since Jan 2022)</td><td className="py-2 px-3">Monitored; HbA1c maintained ~5.5–6.1</td></tr>
                      <tr className="border-b"><td className="py-2 px-3">Thyroid disorder (~5 years)</td><td className="py-2 px-3">Previously medicated; now under control</td></tr>
                      <tr><td className="py-2 px-3">BPH (Prostate)</td><td className="py-2 px-3">Alfuzosin 10mg (daily)</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-3">Historical medication entries are not a reconciled current medication list.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 2: Timeline */}
        <section id="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                Complete Chronological Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                
                {/* April 2022 */}
                <TimelineEvent 
                  date="April 2022" 
                  title="Symptom Onset — Back Pain + COVID-19"
                  color="yellow"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Began complaining of back pain</li>
                    <li>Contracted COVID-19 concurrently</li>
                    <li>Blood test: <strong>ESR = 90 mm/hr</strong> (severely elevated; normal &lt;20)</li>
                    <li>No diagnosis yet. Further workup initiated.</li>
                  </ul>
                </TimelineEvent>

                {/* May 2022 */}
                <TimelineEvent 
                  date="May 2022" 
                  title="Fall + First Blood Tests Suggesting MM"
                  color="yellow"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Patient fell in bathroom, lost consciousness — attributed to hypertension</li>
                    <li>Chest X-rays: no fractures detected</li>
                    <li><strong>Serum Kappa FLC = 857 mg/L</strong> (normal: 3.3–19.4)</li>
                    <li>Kappa/Lambda Ratio = 48.3</li>
                    <li><strong>M Spike = 2.1 g/dL</strong></li>
                  </ul>
                </TimelineEvent>

                {/* June 2022 */}
                <TimelineEvent 
                  date="June 2022" 
                  title="Multiple Myeloma DIAGNOSIS CONFIRMED"
                  color="red"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Bone Marrow Biopsy + Serum Protein Electrophoresis: <strong>MM confirmed</strong></li>
                    <li>MRI Spine: D1 and D6 vertebral collapse (compression fractures)</li>
                    <li>FISH: 3–4 copies of 1q21 (adverse feature)</li>
                    <li>CARB: C-ve, A-ve, R-ve, <strong>B+ve</strong> (bone lesions)</li>
                    <li><strong>Treatment started June 20, 2022: DaraVCD regimen</strong></li>
                  </ul>
                </TimelineEvent>

                {/* July-Oct 2022 */}
                <TimelineEvent 
                  date="July–October 2022" 
                  title="DaraVCD Chemotherapy — 5 Cycles"
                  color="blue"
                >
                  <div className="text-sm text-slate-600 space-y-3">
                    <p>12 total Dara infusions; 16 weekly Bortezomib injections.</p>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="font-medium text-green-800">Response after 4 cycles:</p>
                      <ul className="list-disc list-inside mt-1 text-green-700">
                        <li>Kappa FLC: 857 → <strong>16.97 mg/L</strong> (&gt;98% reduction)</li>
                        <li>M Spike: 2.1 → <strong>0.22 g/dL</strong></li>
                        <li>K/L ratio: 48.3 → <strong>1.45</strong> (near normal)</li>
                      </ul>
                      <p className="mt-2 font-semibold text-green-800">Assessment: Very Good Partial Response (VGPR) or better</p>
                    </div>
                  </div>
                </TimelineEvent>

                {/* December 2022 */}
                <TimelineEvent 
                  date="December 2022" 
                  title="MRD NEGATIVE — Complete Remission"
                  color="green"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li><strong>MRD test: NEGATIVE</strong> (no detectable disease)</li>
                    <li>PET scan: No new lesions</li>
                    <li><strong>Complete Remission (CR) achieved</strong></li>
                    <li>Bone Marrow Transplant (ASCT) CANCELED — deemed unnecessary</li>
                  </ul>
                </TimelineEvent>

                {/* Jan-Aug 2023 */}
                <TimelineEvent 
                  date="January–August 2023" 
                  title="Maintenance Therapy + Serial Monitoring"
                  color="blue"
                >
                  <div className="text-sm text-slate-600">
                    <p className="mb-2"><strong>Regimen:</strong> Bortezomib 1.25mg SC biweekly + Quarterly Zoledronic acid</p>
                    <p>Patient had good quality of life; eGFR stable but declining gradually.</p>
                  </div>
                </TimelineEvent>

                {/* August 2023 */}
                <TimelineEvent 
                  date="August 2023" 
                  title="Repeat PET + MRD Both NEGATIVE — Patient Travels to USA"
                  color="green"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li><strong>MRD: NEGATIVE</strong> (sustained remission)</li>
                    <li>PET scan: No new active lesions</li>
                    <li>Patient declared in <strong>continued complete remission</strong></li>
                    <li>Traveled to USA and lived a completely normal lifestyle for 3 months</li>
                  </ul>
                </TimelineEvent>

                {/* December 2023 */}
                <TimelineEvent 
                  date="December 2023" 
                  title="Kappa FLC Rising — Relapse SUSPECTED"
                  color="orange"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Kappa FLC: 23.08 → <strong>56.82</strong> (more than doubled)</li>
                    <li>M Spike reappeared at <strong>0.24 g/dL</strong></li>
                    <li>K/L ratio: <strong>3.29</strong> (above normal)</li>
                    <li>eGFR: 59.06 (borderline CKD G2/G3)</li>
                    <li>Suspicion of <strong>biochemical relapse</strong> raised</li>
                  </ul>
                </TimelineEvent>

                {/* January 2024 */}
                <TimelineEvent 
                  date="January 2024" 
                  title="Repeat Testing Confirms Relapse"
                  color="red"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Kappa FLC = <strong>92.94 mg/L</strong></li>
                    <li>K/L ratio: <strong>5.065</strong> — nearly 4× upper normal limit</li>
                    <li><strong>Relapse confirmed biochemically beyond doubt</strong></li>
                  </ul>
                </TimelineEvent>

                {/* February 2024 */}
                <TimelineEvent 
                  date="February 2024" 
                  title="Bone Marrow + PET Scan — Structural Relapse Confirmed"
                  color="red"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Bone Marrow Biopsy: Active myeloma infiltration confirmed</li>
                    <li>PET: Metabolically active lytic lesions (right 6th rib, left 8th rib, D6)</li>
                    <li>Left lung: fibronodules (infection/inflammation, NOT myeloma)</li>
                  </ul>
                </TimelineEvent>

                {/* March 2024 */}
                <TimelineEvent 
                  date="March 2024" 
                  title="CAR-T Cell Therapy Recommended"
                  color="purple"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Doctors recommended <strong>CAR-T therapy urgently</strong> as best option</li>
                    <li>Patient NOT eligible for ASCT (autologous stem cell transplant)</li>
                    <li>CAR-T not available in India at the time — could not be administered</li>
                  </ul>
                </TimelineEvent>

                {/* April-September 2024 */}
                <TimelineEvent 
                  date="April–September 2024" 
                  title="Relapse Treatment — Carfilzomib-Based Regimen"
                  color="blue"
                >
                  <p className="text-sm text-slate-600">6 cycles of Inj Carfilzomib + Inj Daratumumab + Inj Zoledronic + Tab Pomalidomide until 04.09.2024</p>
                </TimelineEvent>

                {/* September 2024 */}
                <TimelineEvent 
                  date="September 2024" 
                  title="Severe AKI / Renal Crisis After Carfilzomib"
                  color="red"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Anuric status with creatinine ~<strong>6.54 mg/dL</strong></li>
                    <li>Severe renal dysfunction, anemia, thrombocytopenia</li>
                    <li>Required dialysis for fluid overload</li>
                    <li>Kidney biopsy: <strong>Thrombotic microangiopathy (TMA)</strong></li>
                    <li>Diagnosis: Post-carfilzomib-induced TMA</li>
                  </ul>
                </TimelineEvent>

                {/* Dec 2024 - Aug 2025 */}
                <TimelineEvent 
                  date="December 2024 – August 2025" 
                  title="Post-AKI Monitoring + Maintenance Therapy"
                  color="blue"
                >
                  <div className="text-sm text-slate-600 space-y-2">
                    <p><strong>Maintenance from Jan 2025:</strong> Daratumumab + Tab Pomalidomide</p>
                    <p><strong>Aug 2025 plan:</strong> Daratumumab 1200mg monthly, Denosumab 120mg every 3 months, Pomalidomide 2mg (3 weeks on / 1 week off)</p>
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-2">
                      <p><strong>Feb 2025 MRD:</strong> Nil / no residual clonal plasma cells detected (~4.8 million events)</p>
                      <p className="text-amber-700 mt-1 text-xs">Note: Serum markers still showed persistent low-level IgG-kappa disease</p>
                    </div>
                  </div>
                </TimelineEvent>

                {/* August 2025 */}
                <TimelineEvent 
                  date="August 2025" 
                  title="Comprehensive Myeloma Panel (Dr. Lal PathLabs)"
                  color="blue"
                >
                  <div className="text-sm text-slate-600 space-y-2">
                    <p><strong>Key findings:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Beta-2 Microglobulin: <strong>10,244 ng/mL</strong></li>
                      <li>Kappa FLC: 38.71 mg/L (2x ULN)</li>
                      <li>IgG: <strong>515 mg/dL</strong> (below normal)</li>
                      <li>IgM: &lt;21 mg/dL (below the reported interval)</li>
                      <li>eGFR: 43 mL/min (G3b CKD)</li>
                      <li>ANC: 1.48 (neutropenia)</li>
                    </ul>
                  </div>
                </TimelineEvent>

                {/* Jul-Dec 2025 Serial Monitoring */}
                <TimelineEvent 
                  date="July – December 2025" 
                  title="Serial KFT + CBC Monitoring (Max Lab)"
                  color="blue"
                >
                  <div className="text-sm text-slate-600 space-y-2">
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="font-medium text-green-800">Positive trend:</p>
                      <ul className="list-disc list-inside mt-1 text-green-700">
                        <li>Creatinine declining: 1.86 → 1.46 mg/dL</li>
                        <li>eGFR improving: 38.74 → 51.67 (CKD-EPI)</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="font-medium text-red-800">Concerns:</p>
                      <ul className="list-disc list-inside mt-1 text-red-700">
                        <li>Potassium rising: 4.91 → <strong>6.25 mmol/L (CRITICAL)</strong></li>
                        <li>ANC persistently neutropenic (1.48–1.69)</li>
                      </ul>
                    </div>
                  </div>
                </TimelineEvent>

                {/* December 2025 */}
                <TimelineEvent 
                  date="December 2025" 
                  title="Myeloma Panel — FLC + SPE (Max Lab)"
                  color="blue"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Kappa FLC: 37.53 mg/L (~2x ULN)</li>
                    <li>K/L Ratio: 2.21</li>
                    <li>M-Spike: 0.11 g/dL (present in gamma region)</li>
                    <li>Hypogammaglobulinemia present</li>
                  </ul>
                </TimelineEvent>

                {/* Jan-Mar 2026 Serial Monitoring */}
                <TimelineEvent 
                  date="January – March 2026" 
                  title="Serial KFT + CBC Monitoring (Max Lab)"
                  color="orange"
                >
                  <div className="text-sm text-slate-600 space-y-2">
                    <div className="bg-amber-50 border border-amber-200 rounded p-3">
                      <p className="font-medium text-amber-800">eGFR fluctuating:</p>
                      <p className="text-amber-700">51.22 (Jan) → 44.57 (Feb) → 45.21 (Mar) — returned toward G3b</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="font-medium text-red-800">Worsening trends:</p>
                      <ul className="list-disc list-inside mt-1 text-red-700">
                        <li>ANC declining: 1.42 → 1.33 → <strong>1.10</strong> (approaching grade 3)</li>
                        <li>Platelets declining: 178 → 149 → 123</li>
                        <li>Potassium persistently elevated: 5.69–5.80 mmol/L</li>
                      </ul>
                    </div>
                  </div>
                </TimelineEvent>

                {/* March 2026 PET-CT */}
                <TimelineEvent 
                  date="March 2026" 
                  title="Whole Body PET-CT Scan (Max Healthcare)"
                  color="green"
                >
                  <div className="text-sm text-slate-600 space-y-2">
                    <p className="font-medium">Comparison vs Feb 2024:</p>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="font-medium text-green-800">Favourable findings:</p>
                      <ul className="list-disc list-inside mt-1 text-green-700">
                        <li>D5–D7 paravertebral soft tissue: SUVmax 5.8 → 4.9, size decreased</li>
                        <li>Right 6th rib: Resolution of FDG avidity</li>
                        <li>Left 8th rib: Resolution of FDG avidity</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded p-3">
                      <p className="font-medium text-amber-800">Residual disease:</p>
                      <p className="text-amber-700">Non-FDG avid lytic lesions persist across sternum, vertebrae, ribs, sacrum, pelvic bones</p>
                    </div>
                    <p className="text-xs text-slate-500 italic">Imaging findings from March 2026; later blood tests do not establish a new imaging outcome.</p>
                  </div>
                </TimelineEvent>

                {/* April 2026 */}
                <TimelineEvent 
                  date="April 2026" 
                  title="Comprehensive Monitoring - April Results"
                  color="red"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Kappa FLC: <strong>97.65 mg/L</strong></li>
                    <li>K/L ratio: <strong>4.367</strong></li>
                    <li>eGFR: <strong>40</strong> (CKD G3b)</li>
                    <li>Calcium: 10.40 mg/dL (high)</li>
                    <li>Potassium: 5.54 mEq/L (high)</li>
                    <li>ANC: 1.45 (neutropenia)</li>
                    <li>Platelets: 110 (thrombocytopenia)</li>
                  </ul>
                </TimelineEvent>

                {/* April-May 2026 Bone Marrow */}
                <TimelineEvent 
                  date="April–May 2026" 
                  title="Bone Marrow + Flow Cytometry MRD (PGIMER)"
                  color="red"
                >
                  <div className="text-sm text-slate-600 space-y-2">
                    <p><strong>Bone Marrow Aspiration (24 Apr):</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Plasma cells: <strong>2%</strong> (right imprint 3%, left 1%)</li>
                      <li>Cellularity: 30–40%</li>
                      <li>Trephine: No interstitial increase in plasma cells</li>
                    </ul>
                    <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                      <p className="font-medium text-red-800">Flow Cytometry MRD (25 Apr):</p>
                      <ul className="list-disc list-inside mt-1 text-red-700">
                        <li>MRD: <strong>POSITIVE (0.0017%)</strong></li>
                        <li>Events acquired: 2.9 million</li>
                        <li>Immunophenotype: CD38+, CD56+, CD117+, cytoKappa+</li>
                      </ul>
                    </div>
                    <p className="text-xs text-slate-500 italic mt-2">Dated marrow findings; no subsequent marrow assessment is established by the new serum panels.</p>
                  </div>
                </TimelineEvent>

                <TimelineEvent date="28 May 2026 (final 30 May)" title="Final Myeloma Monitoring Panel" color="blue">
                  <p className="text-sm text-slate-600">Kappa FLC 130.32 mg/L; lambda 22.81 mg/L; reported ratio 5.713. M-spike 0.30 g/dL. Creatinine 2.08 mg/dL; lab-reported eGFR 34 mL/min/1.73m². Hemoglobin 11.60 g/dL; platelets 110 ×10⁹/L.</p>
                  <a className="text-sm text-blue-700 underline" href={clinicalSources.may.href}>Final report, pp. 1-11</a>
                </TimelineEvent>
                <TimelineEvent date="27 June - 15 July 2026" title="PGI Admission and Teclistamab Initiation" color="purple">
                  <p className="text-sm text-slate-600">Signed source records document admission on 27 June and discharge on 15 July. Teclistamab doses are documented on 30 June, 3 July, 7 July and 14 July. Later listed doses were plans, not confirmed administrations.</p>
                  <p className="text-sm text-slate-600 mt-2">Inpatient source labs include 11, 13 and 14 July. On 14 July: hemoglobin 11.1 g/dL, ANC 3.9 ×10⁹/L, platelets 75 ×10⁹/L; creatinine 1.35 mg/dL, potassium 4.43 mmol/L. These are requisition dates; no eGFR is reported in these inpatient pages.</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-blue-700 underline">
                    <a href={clinicalSources.discharge.href}>Signed discharge source, pp. 1-3</a>
                    <a href={clinicalSources.pgi.href + "#page=24"}>14 July haemogram, p. 24</a>
                    <a href={clinicalSources.pgi.href + "#page=1"}>14 July chemistry, p. 1</a>
                  </div>
                </TimelineEvent>
                {panelDates.filter(panel => panel.sourceId !== "may").map(panel => {
                  const result = (analyte: Analyte) => panelResults.find(row => row.sourceId === panel.sourceId && row.analyte === analyte)!
                  return <TimelineEvent key={panel.sourceId} date={shortDate(panel.specimenDate) + " (final " + shortDate(panel.reportedDate) + ")"} title="Final Myeloma Follow-up Panel" color="blue">
                    <p className="text-sm text-slate-600">Kappa FLC {result("kappa").raw} mg/L; lambda {result("lambda").raw} mg/L. {result("ratio").value === null ? result("ratio").raw : "Reported K/L ratio: " + result("ratio").raw + "."} M-spike: {result("mSpike").raw} g/dL; IFE: {result("ife").raw}.</p>
                    <p className="text-sm text-slate-600 mt-2">Hemoglobin {result("hemoglobin").raw} g/dL; ANC {result("anc").raw} ×10⁹/L; platelets {result("platelets").raw} ×10⁹/L. Lab-reported eGFR {result("egfr").raw} mL/min/1.73m².</p>
                    <a className="text-sm text-blue-700 underline" href={clinicalSources[panel.sourceId].href}>Final source report</a>
                  </TimelineEvent>
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 3: Treatment Summary */}
        <section id="treatment">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                Treatment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left py-3 px-4 font-medium">Line</th>
                      <th className="text-left py-3 px-4 font-medium">Period</th>
                      <th className="text-left py-3 px-4 font-medium">Regimen</th>
                      <th className="text-left py-3 px-4 font-medium">Recorded context</th>
                      <th className="text-left py-3 px-4 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">1st Line Induction</td>
                      <td className="py-3 px-4">Jun–Oct 2022</td>
                      <td className="py-3 px-4">DaraVCD (Dara+Bortezomib+Cyclophos+Dexa)</td>
                      <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">MRD negative in Dec 2022</Badge></td>
                      <td className="py-3 px-4">5 cycles (~5 months)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">1st Line Maintenance</td>
                      <td className="py-3 px-4">Jan–Aug 2023</td>
                      <td className="py-3 px-4">Bortezomib 1.25mg SC biweekly + Quarterly Zoledronic acid</td>
                      <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">MRD negative in Aug 2023</Badge></td>
                      <td className="py-3 px-4">~8 months</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">2nd Line Salvage</td>
                      <td className="py-3 px-4">Apr–Sep 2024</td>
                      <td className="py-3 px-4">Carfilzomib + Daratumumab + Zoledronic + Pomalidomide</td>
                      <td className="py-3 px-4"><Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Response; complicated by AKI/TMA</Badge></td>
                      <td className="py-3 px-4">6 cycles</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Post-AKI Maintenance</td>
                      <td className="py-3 px-4">Jan 2025 - historical record</td>
                      <td className="py-3 px-4">Daratumumab monthly + Pomalidomide; Denosumab q3mo</td>
                      <td className="py-3 px-4"><Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Previously documented maintenance</Badge></td>
                      <td className="py-3 px-4">Not confirmed current</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 px-4 font-medium">Teclistamab initiation</td>
                      <td className="py-3 px-4">30 Jun - 14 Jul 2026</td>
                      <td className="py-3 px-4">Step-up 0.06 and 0.3 mg/kg; full doses 1.5 mg/kg</td>
                      <td className="py-3 px-4">Documented doses only; no response category assigned here</td>
                      <td className="py-3 px-4">Four documented doses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p><strong>Documented administration:</strong> {teclistamabRecord.documentedDoses.map(dose => shortDate(dose.date) + ": " + dose.mgPerKg + " mg/kg (" + dose.mg + " mg)").join("; ")}.</p>
                <p>{teclistamabRecord.laterDoses} The reviewed records do not establish the current regimen or continued use of older maintenance/supportive medications.</p>
                <a className="text-blue-700 underline" href={clinicalSources.discharge.href + "#page=3"}>Signed dose schedule, p. 3</a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 4: Key Markers Summary */}
        <section id="markers">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
                Key Diagnostic Markers Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900">Latest Serum and Blood Results</h3>
                <p className="text-sm text-slate-600 mt-1 mb-3">Specimen: 2 October 2026 at 09:01. Final report: 5 October 2026 at 12:33. Values and reference intervals below are transcribed from that report, not a current-day assessment.</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[540px] text-sm">
                    <thead><tr className="bg-slate-100">{["Marker", "Reported result", "Reference interval", "Source"].map(label => <th key={label} scope="col" className="text-left py-2 px-3 font-medium">{label}</th>)}</tr></thead>
                    <tbody>{latestResults.map(result => <tr key={result.analyte} className="border-b">
                      <th scope="row" className="text-left py-2 px-3 font-medium">{clinicalLabels[result.analyte]}</th>
                      <td className="py-2 px-3 max-w-xs">{result.raw} {result.unit}{result.note && result.analyte === "mSpike" && <p className="text-xs text-slate-500 mt-1">{result.note}</p>}</td>
                      <td className="py-2 px-3">{result.reference ?? "Not stated"}</td>
                      <td className="py-2 px-3"><a className="text-blue-700 underline whitespace-nowrap" href={resultHref(result)} aria-label={clinicalLabels[result.analyte] + " source page " + result.publishedPage}>p. {result.publishedPage}</a></td>
                    </tr>)}</tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-3">Reporting limits (&lt;) and the question mark on M-spike are retained. These serum results do not establish marrow MRD status or a treatment-response category.</p>
              </div>
              {/* MRD Timeline */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">MRD Results Timeline</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-2 px-3 font-medium">Date</th>
                        <th className="text-left py-2 px-3 font-medium">MRD Result</th>
                        <th className="text-left py-2 px-3 font-medium">Context</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2 px-3">Dec 2022</td><td className="py-2 px-3"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">NEGATIVE</Badge></td><td className="py-2 px-3">Post-DaraVCD induction</td></tr>
                      <tr className="border-b"><td className="py-2 px-3">Aug 2023</td><td className="py-2 px-3"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">NEGATIVE</Badge></td><td className="py-2 px-3">Sustained remission</td></tr>
                      <tr className="border-b"><td className="py-2 px-3">Feb 2025</td><td className="py-2 px-3"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Nil</Badge></td><td className="py-2 px-3">On Dara+Poma maintenance</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Apr 2026</td><td className="py-2 px-3"><Badge className="bg-red-100 text-red-800 hover:bg-red-100">POSITIVE 0.0017%</Badge></td><td className="py-2 px-3">Flow cytometry result dated April 2026</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bone Marrow Plasma Cells */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Bone Marrow Plasma Cell % Timeline</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-2 px-3 font-medium">Date</th>
                        <th className="text-left py-2 px-3 font-medium">Plasma Cells</th>
                        <th className="text-left py-2 px-3 font-medium">Finding</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2 px-3">Jun 2022</td><td className="py-2 px-3">Elevated</td><td className="py-2 px-3">MM confirmed (diagnosis)</td></tr>
                      <tr className="border-b"><td className="py-2 px-3">Dec 2022</td><td className="py-2 px-3">Minimal</td><td className="py-2 px-3">MRD negative</td></tr>
                      <tr className="border-b"><td className="py-2 px-3">Feb 2024</td><td className="py-2 px-3">Elevated</td><td className="py-2 px-3">Active infiltration (relapse)</td></tr>
                      <tr><td className="py-2 px-3 font-medium">Apr 2026</td><td className="py-2 px-3 font-medium">2%</td><td className="py-2 px-3">Residual disease; MRD 0.0017% positive</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="concerns">
          <Card>
            <CardHeader><CardTitle className="text-xl flex items-center gap-2"><span className="w-8 h-8 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">5</span>Dated Findings and Record Limits</CardTitle></CardHeader>
            <CardContent>
              <dl className="divide-y divide-slate-200 text-sm">
                <div className="py-3"><dt className="font-semibold">2 October 2026: blood counts</dt><dd className="text-slate-600 mt-1">ANC 0.91 ×10⁹/L, total leukocytes 3.00 ×10⁹/L and hemoglobin 12.80 g/dL were below the lab intervals. Platelets were 175 ×10⁹/L (lab interval 150-410). <a href={clinicalSources.october.href + "#page=1"} className="text-blue-700 underline">CBC, pp. 1-2</a></dd></div>
                <div className="py-3"><dt className="font-semibold">2 October 2026: FLC, immunoglobulins and protein studies</dt><dd className="text-slate-600 mt-1">Kappa &lt; 0.56 mg/L and lambda 1.37 mg/L; K/L ratio not calculable per laboratory. IgA &lt;33.0 and IgM &lt;21.0 mg/dL; IgG 890.00 mg/dL. M-spike reported as ? 0.4 g/dL with a suspicious non-discrete band; IFE identifies IgG, Kappa. Low FLC values do not negate the separately reported protein-band finding. <a href={clinicalSources.october.href + "#page=6"} className="text-blue-700 underline">Source, pp. 6-11</a></dd></div>
                <div className="py-3"><dt className="font-semibold">28 May - 2 October 2026: renal measurements</dt><dd className="text-slate-600 mt-1">Lab-reported eGFR: 34, 46, 52 and 53 mL/min/1.73m² on 28 May, 30 July, 28 August and 2 October respectively. Latest creatinine: 1.43 mg/dL. Inpatient chemistry reports give creatinine, not eGFR. <a href={clinicalSources.october.href + "#page=5"} className="text-blue-700 underline">Latest renal report, p. 5</a></dd></div>
                <div className="py-3"><dt className="font-semibold">2 October 2026: other laboratory findings</dt><dd className="text-slate-600 mt-1">Beta-2 microglobulin 8450 ng/mL (609-2366); LDH 294.00 U/L (120-246); calcium 9.35 mg/dL (8.80-10.20). No new disease stage is assigned from beta-2 microglobulin alone. <a href={clinicalSources.october.href + "#page=9"} className="text-blue-700 underline">Beta-2, p. 9</a>; <a href={clinicalSources.october.href + "#page=3"} className="text-blue-700 underline">chemistry, p. 3</a>.</dd></div>
                <div className="py-3"><dt className="font-semibold">1 and 14 July 2026: inpatient platelet findings</dt><dd className="text-slate-600 mt-1">Platelets were printed as 26 ×10⁹/L on 1 July and 75 ×10⁹/L on 14 July; later outpatient values were 175 ×10⁹/L on 28 August and 2 October. No cause or treatment effect is inferred. <a href={clinicalSources.pgi.href + "#page=34"} className="text-blue-700 underline">1 July, p. 34</a>; <a href={clinicalSources.pgi.href + "#page=24"} className="text-blue-700 underline">14 July, p. 24</a>.</dd></div>
                <div className="py-3"><dt className="font-semibold">Electrolytes and medication status are dated, not current</dt><dd className="text-slate-600 mt-1">Potassium was 6.60 meq/L on 31 March 2025, 5.70 meq/L on 27 August 2025, and 4.43 mmol/L on 14 July 2026. The October panel does not provide an updated potassium result. Current medications and later planned teclistamab administrations are not confirmed by these laboratory records.</dd></div>
              </dl>
            </CardContent>
          </Card>
        </section>

        <section id="charts">
          <Card>
            <CardHeader><CardTitle className="text-xl flex items-center gap-2"><span className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">6</span>Biomarker Charts</CardTitle></CardHeader>
            <CardContent className="space-y-8">
              <p className="text-sm text-slate-600">Dated source results through the 2 October 2026 specimen. Month-only points are retained historical summaries, not verified specimen dates. Points are equally spaced, not a continuous time scale. Reference intervals vary by laboratory.</p>
              <LabChart title="Kappa Free Light Chain (FLC)" unit="mg/L" data={chartSeries("kappa", kappaFLCData)} series={[{ key: "value", label: "Kappa FLC", color: "#ef4444" }]} reference={19.4} />
              <p className="text-sm text-slate-600">2 October: kappa &lt; 0.56 mg/L is a reporting limit and is not plotted as zero or 0.56. <a href={clinicalSources.october.href + "#page=11"} className="text-blue-700 underline">FLC source, p. 11</a></p>
              <LabChart title="eGFR (Lab-reported)" unit="mL/min/1.73m²" data={chartSeries("egfr", eGFRData)} series={[{ key: "value", label: "eGFR", color: "#3b82f6" }]} reference={60} />
              <LabChart title="Immunoglobulin Levels" unit="mg/dL" data={immunoglobulinChartData} series={[{ key: "IgG", label: "IgG", color: "#8b5cf6" }, { key: "IgA", label: "IgA", color: "#06b6d4" }, { key: "IgM", label: "IgM", color: "#f97316" }]} />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <caption className="text-left text-sm text-slate-600 mb-2">Recent immunoglobulin results (mg/dL). Below-limit results are omitted from numeric lines.</caption>
                  <thead><tr className="bg-slate-100"><th className="text-left p-2">Specimen</th>{["IgG", "IgA", "IgM"].map(key => <th key={key} className="text-left p-2">{key}</th>)}</tr></thead>
                  <tbody>{panelDates.map(panel => <tr className="border-b" key={panel.sourceId}><th className="text-left p-2 font-medium">{shortDate(panel.specimenDate)}</th>{(["IgG", "IgA", "IgM"] as const).map(key => { const result = panelResults.find(row => row.sourceId === panel.sourceId && row.analyte === key)!; return <td className="p-2" key={key}><a className="text-blue-700 underline" href={resultHref(result)}>{result.raw}</a></td> })}</tr>)}</tbody>
                </table>
              </div>
              <LabChart title="Hemoglobin Trend" unit="g/dL" data={chartSeries("hemoglobin", hemoglobinData)} series={[{ key: "value", label: "Hemoglobin", color: "#ec4899" }]} reference={13} />
              <LabChart title="Absolute Neutrophil Count (ANC)" unit="×10⁹/L" data={chartSeries("anc", ancData)} series={[{ key: "value", label: "ANC", color: "#ea580c" }]} reference={2} />
              <p className="text-xs text-slate-500">PGI dates are requisition dates. ANC is not reported on 27 June or 11 July and is left blank, not calculated from other counts.</p>
              <LabChart title="Platelet Count Trend" unit="×10⁹/L" data={chartSeries("platelets", plateletData)} series={[{ key: "value", label: "Platelets", color: "#a855f7" }]} reference={150} />
              <p className="text-xs text-slate-500">Counts reported as thou/mm³ are numerically equivalent to ×10⁹/L. Older platelet results in lacs/mm³ are multiplied by 100 for chart units; original units remain in the source records.</p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 py-8 border-t border-slate-200">
          <p>Medical History Record - Updated 22 October 2026; latest final panel 5 October 2026</p>
          <p className="mt-1">For medical reference. Dated records are not a current medication list or treatment recommendation.</p>
        </footer>
      </main>
    </div>
  )
}

// Timeline Event Component
function TimelineEvent({ 
  date, 
  title, 
  color, 
  children 
}: { 
  date: string
  title: string
  color: "red" | "green" | "blue" | "yellow" | "orange" | "purple"
  children: React.ReactNode 
}) {
  const colorClasses = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  }

  return (
    <div className="relative pl-10 pb-8">
      <div className={`absolute left-2.5 w-3 h-3 rounded-full ${colorClasses[color]} ring-4 ring-white`} />
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs font-mono">{date}</Badge>
          <h4 className="font-semibold text-slate-900">{title}</h4>
        </div>
        {children}
      </div>
    </div>
  )
}


type ChartRow = { date: string; value?: number | null; IgG?: number | null; IgA?: number | null; IgM?: number | null; result?: ClinicalResult; legacy?: boolean; results?: ClinicalResult[] }
const immunoglobulinChartData: ChartRow[] = [
  ...immunoglobulinData.map(row => ({ ...row, legacy: true, IgM: historicalIgChartValue(row.date, "IgM", row.IgM), IgA: historicalIgChartValue(row.date, "IgA", row.IgA) })),
  ...panelDates.map(panel => {
    const rows = panelResults.filter(result => result.sourceId === panel.sourceId && ["IgG", "IgA", "IgM"].includes(result.analyte))
    return { date: shortDate(panel.specimenDate), results: rows, ...Object.fromEntries(rows.map(result => [result.analyte, chartValue(result)])) }
  }),
]

function ClinicalTooltip({ active, payload, label }: TooltipProps<number, string>) {
  const row = payload?.[0]?.payload as ChartRow | undefined
  if (!active || !row) return null
  const rows = row.result ? [row.result] : row.results
  return <div className="max-w-[260px] rounded border border-slate-200 bg-white p-3 text-xs shadow-md">
    <p className="font-semibold">{label}</p>
    {rows ? rows.map(result => <p key={result.analyte} className="mt-1">{clinicalLabels[result.analyte]}: {result.raw} {result.unit}<br /><span className="text-slate-500">{result.dateBasis === "requisition" ? "Requisition" : "Specimen"}: {result.date}; source p. {result.publishedPage}{result.reportedDate ? "; reported " + result.reportedDate : ""}</span></p>) : <><p className="text-slate-500">Historical month-level summary</p>{payload?.map(item => {
      const limit = historicalIgLimits.find(result => result.legacyLabel === row.date && result.analyte === item.dataKey)
      return <p key={String(item.dataKey)} className="mt-1">{item.name}: {limit ? limit.raw + " mg/dL" : item.value ?? "Not reported"}{limit && <><br /><span className="text-slate-500">Specimen: {limit.specimenDate}; source p. {limit.page}; reported {limit.reportedDate}</span></>}</p>
    })}</>}
  </div>
}

function LabChart({ title, unit, data, series, reference }: { title: string; unit: string; data: ChartRow[]; series: { key: string; label: string; color: string }[]; reference?: number }) {
  return <div className="min-w-0" role="figure" aria-label={title + " in " + unit}>
    <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
    <p className="text-xs text-slate-500 mb-3">{unit}{reference !== undefined ? " | Reference line: " + reference : ""}</p>
    <div className="overflow-x-auto"><div className="h-80 min-w-[560px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={82} minTickGap={12} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} width={46} domain={[0, "auto"]} />
          <Tooltip content={<ClinicalTooltip />} filterNull={false} />
          {series.length > 1 && <Legend />}
          {reference !== undefined && <ReferenceLine y={reference} stroke="#16a34a" strokeDasharray="5 5" />}
          {series.map(item => <Line key={item.key} type="linear" dataKey={item.key} name={item.label} stroke={item.color} strokeWidth={2} dot={{ r: 3 }} connectNulls={false} isAnimationActive={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div></div>
  </div>
}
