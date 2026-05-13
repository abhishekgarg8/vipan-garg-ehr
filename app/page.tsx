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
  AreaChart,
  Area,
} from "recharts"

// Biomarker data for charts
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
  { date: "Apr 2026", value: 97.65, event: "Latest" },
]

const eGFRData = [
  { date: "Jan 2023", value: 80, status: "Normal" },
  { date: "Aug 2023", value: 60, status: "Mild decline" },
  { date: "Dec 2023", value: 59, status: "Borderline" },
  { date: "Sep 2024", value: 10, status: "Severe AKI" },
  { date: "Feb 2025", value: 40, status: "G3b CKD" },
  { date: "May 2025", value: 39, status: "G3b CKD" },
  { date: "Aug 2025", value: 43, status: "G3b CKD" },
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
  { date: "Aug 2025", value: 11.2 },
  { date: "Apr 2026", value: 12.4 },
]

export default function MedicalHistory() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white py-8 px-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold">Master Medical History</h1>
          <p className="text-slate-300 mt-1">Vipan Garg — Multiple Myeloma Complete Record (2022–2026)</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 py-3 px-4 sticky top-[88px] z-40">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          <a href="#profile" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Profile</a>
          <a href="#timeline" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Timeline</a>
          <a href="#treatment" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Treatment</a>
          <a href="#markers" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Markers</a>
          <a href="#concerns" className="text-sm px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Concerns</a>
          <a href="#charts" className="text-sm px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors">Charts</a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
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
                      <tr className="border-b"><td className="py-2 text-slate-500">Age at diagnosis</td><td className="py-2 font-medium">~66 years</td></tr>
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
                    <p className="text-sm text-amber-700 mt-2 italic">Strong hereditary pattern on the maternal side.</p>
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
                        <th className="text-left py-2 px-3 font-medium">Management</th>
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

                {/* April 2026 */}
                <TimelineEvent 
                  date="April 2026" 
                  title="Comprehensive Monitoring — Disease Progression Detected"
                  color="red"
                >
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>Kappa FLC: <strong>97.65 mg/L</strong> (highest since Jan 2024 relapse)</li>
                    <li>K/L ratio: <strong>4.367</strong></li>
                    <li>eGFR: <strong>40</strong> (CKD G3b)</li>
                    <li>MRD: <strong>0.0017% POSITIVE</strong></li>
                    <li>BM Plasma Cells: <strong>2%</strong></li>
                    <li>Disease progressing on current maintenance</li>
                  </ul>
                </TimelineEvent>
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
                      <th className="text-left py-3 px-4 font-medium">Response</th>
                      <th className="text-left py-3 px-4 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">1st Line Induction</td>
                      <td className="py-3 px-4">Jun–Oct 2022</td>
                      <td className="py-3 px-4">DaraVCD (Dara+Bortezomib+Cyclophos+Dexa)</td>
                      <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">CR + MRD Negative</Badge></td>
                      <td className="py-3 px-4">5 cycles (~5 months)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">1st Line Maintenance</td>
                      <td className="py-3 px-4">Jan–Aug 2023</td>
                      <td className="py-3 px-4">Bortezomib 1.25mg SC biweekly + Quarterly Zoledronic acid</td>
                      <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sustained CR</Badge></td>
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
                      <td className="py-3 px-4">Jan 2025 → ongoing</td>
                      <td className="py-3 px-4">Daratumumab monthly + Pomalidomide; Denosumab q3mo</td>
                      <td className="py-3 px-4"><Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Persistent low-level disease</Badge></td>
                      <td className="py-3 px-4">Ongoing</td>
                    </tr>
                  </tbody>
                </table>
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
              {/* MRD Timeline */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">MRD Progression Timeline</h3>
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
                      <tr><td className="py-2 px-3 font-medium">Apr 2026</td><td className="py-2 px-3"><Badge className="bg-red-100 text-red-800 hover:bg-red-100">POSITIVE 0.0017%</Badge></td><td className="py-2 px-3">Biochemical/MRD relapse activity</td></tr>
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

        {/* Section 5: Active Concerns */}
        <section id="concerns">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">5</span>
                Active Concerns as of May 2026
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Critical Values */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-900 mb-3">Critical Abnormal Values (April 2026)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left py-2 px-3 font-medium">Marker</th>
                        <th className="text-left py-2 px-3 font-medium">Value</th>
                        <th className="text-left py-2 px-3 font-medium">Reference</th>
                        <th className="text-left py-2 px-3 font-medium">Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b bg-red-50"><td className="py-2 px-3 font-medium">Kappa FLC</td><td className="py-2 px-3">97.65 mg/L</td><td className="py-2 px-3">3.30–19.40</td><td className="py-2 px-3 text-red-700">🔴 5× ULN — highest since Jan 2024</td></tr>
                      <tr className="border-b bg-red-50"><td className="py-2 px-3 font-medium">K/L Ratio</td><td className="py-2 px-3">4.367</td><td className="py-2 px-3">0.26–1.65</td><td className="py-2 px-3 text-red-700">🔴 2.6× ULN</td></tr>
                      <tr className="border-b bg-red-50"><td className="py-2 px-3 font-medium">MRD</td><td className="py-2 px-3">0.0017%</td><td className="py-2 px-3">Negative</td><td className="py-2 px-3 text-red-700">🔴 Positive</td></tr>
                      <tr className="border-b bg-red-50"><td className="py-2 px-3 font-medium">BM Plasma Cells</td><td className="py-2 px-3">2%</td><td className="py-2 px-3">&lt;1% on therapy</td><td className="py-2 px-3 text-red-700">🔴 Residual disease</td></tr>
                      <tr className="border-b bg-amber-50"><td className="py-2 px-3">eGFR</td><td className="py-2 px-3">40 mL/min</td><td className="py-2 px-3">&gt;59</td><td className="py-2 px-3 text-amber-700">🟠 CKD G3b</td></tr>
                      <tr className="border-b bg-amber-50"><td className="py-2 px-3">Calcium</td><td className="py-2 px-3">10.40 mg/dL</td><td className="py-2 px-3">8.80–10.20</td><td className="py-2 px-3 text-amber-700">🟠 High</td></tr>
                      <tr className="border-b bg-amber-50"><td className="py-2 px-3">Potassium</td><td className="py-2 px-3">5.54 mEq/L</td><td className="py-2 px-3">3.50–5.10</td><td className="py-2 px-3 text-amber-700">🟠 High</td></tr>
                      <tr className="border-b bg-amber-50"><td className="py-2 px-3">ANC</td><td className="py-2 px-3">1.45 ×10³/µL</td><td className="py-2 px-3">2.00–7.00</td><td className="py-2 px-3 text-amber-700">🟠 Neutropenia</td></tr>
                      <tr className="border-b bg-amber-50"><td className="py-2 px-3">Platelets</td><td className="py-2 px-3">110 ×10³/µL</td><td className="py-2 px-3">150–410</td><td className="py-2 px-3 text-amber-700">🟠 Thrombocytopenia</td></tr>
                      <tr className="bg-yellow-50"><td className="py-2 px-3">Hemoglobin</td><td className="py-2 px-3">12.40 g/dL</td><td className="py-2 px-3">13.00–17.00</td><td className="py-2 px-3 text-yellow-700">🟡 Mild anemia</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Numbered Concerns */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Concern List</h3>
                <div className="space-y-3">
                  <ConcernItem number={1} severity="critical" title="Active Multiple Myeloma (Relapsed/Refractory)">
                    Kappa FLC 97.65 mg/L (highest since relapse Jan 2024), IgG-Kappa M-spike ~0.2 g/dL, MRD 0.0017% positive, BM 2% plasma cells. Disease progressing on Daratumumab-pomalidomide maintenance.
                  </ConcernItem>
                  <ConcernItem number={2} severity="high" title="CKD Stage G3b (eGFR 40)">
                    Persistent since Sep 2024 carfilzomib-induced TMA/AKI. Elevated creatinine, high phosphorus, hypercalcemia indicate ongoing renal-metabolic burden. Limits treatment options.
                  </ConcernItem>
                  <ConcernItem number={3} severity="high" title="Electrolyte Abnormalities">
                    Potassium 5.54 mEq/L (borderline hyperkalemia), Calcium 10.40 mg/dL (may reflect MM-related bone disease or renal handling issues).
                  </ConcernItem>
                  <ConcernItem number={4} severity="high" title="Persistent Absolute Neutropenia">
                    ANC 1.45 ×10³/µL across multiple readings. Elevated infection risk. Likely treatment-related + marrow suppression.
                  </ConcernItem>
                  <ConcernItem number={5} severity="moderate" title="Thrombocytopenia">
                    Platelets 110 ×10³/µL with giant platelets noted. Monitor for bleeding risk.
                  </ConcernItem>
                  <ConcernItem number={6} severity="high" title="Hypogammaglobulinemia">
                    IgM &lt;21 mg/dL consistently (ref 50–300). Risk of bacterial infections. IgG recovering slightly to 752 mg/dL.
                  </ConcernItem>
                  <ConcernItem number={7} severity="high" title="Beta-2 Microglobulin">
                    Last measured at 10,244 ng/mL (Aug 2025). Not yet repeated. Critical prognostic concern.
                  </ConcernItem>
                  <ConcernItem number={8} severity="critical" title="Treatment Efficacy Concern">
                    Steep rise in Kappa FLC from ~38–48 mg/L (2025) to 97.65 mg/L (Apr 2026) suggests disease escape from current maintenance. Treatment change discussion warranted.
                  </ConcernItem>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: Biomarker Charts */}
        <section id="charts">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">6</span>
                Biomarker Charts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Kappa FLC Chart */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Kappa Free Light Chain (FLC) Journey</h3>
                <p className="text-sm text-slate-500 mb-4">Normal range: 3.3–19.4 mg/L</p>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={kappaFLCData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <defs>
                        <linearGradient id="kappaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }} 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        domain={[0, 'auto']}
                        label={{ value: 'mg/L', angle: -90, position: 'insideLeft', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number) => [`${value} mg/L`, 'Kappa FLC']}
                        labelFormatter={(label) => {
                          const item = kappaFLCData.find(d => d.date === label)
                          return item ? `${label} — ${item.event}` : label
                        }}
                      />
                      <ReferenceLine y={19.4} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Upper Normal (19.4)', fill: '#22c55e', fontSize: 10, position: 'right' }} />
                      <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fill="url(#kappaGradient)" dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* eGFR Chart */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">eGFR (Kidney Function) Journey</h3>
                <p className="text-sm text-slate-500 mb-4">Normal: &gt;60 mL/min/1.73m² | G3b CKD: 30-44</p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={eGFRData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }} 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        domain={[0, 100]}
                        label={{ value: 'mL/min', angle: -90, position: 'insideLeft', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number) => [`${value} mL/min`, 'eGFR']}
                        labelFormatter={(label) => {
                          const item = eGFRData.find(d => d.date === label)
                          return item ? `${label} — ${item.status}` : label
                        }}
                      />
                      <ReferenceLine y={60} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Normal (>60)', fill: '#22c55e', fontSize: 10, position: 'right' }} />
                      <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'G3b lower', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Immunoglobulin Chart */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Immunoglobulin Levels</h3>
                <p className="text-sm text-slate-500 mb-4">IgG: 650–1600 | IgM: 50–300 | IgA: 40–350 (mg/dL)</p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={immunoglobulinData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }} 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'mg/dL', angle: -90, position: 'insideLeft', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="IgG" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                      <Line type="monotone" dataKey="IgA" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
                      <Line type="monotone" dataKey="IgM" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hemoglobin Chart */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Hemoglobin Trend</h3>
                <p className="text-sm text-slate-500 mb-4">Normal range: 13.0–17.0 g/dL</p>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hemoglobinData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <defs>
                        <linearGradient id="hgbGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }} 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        domain={[8, 14]}
                        label={{ value: 'g/dL', angle: -90, position: 'insideLeft', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        formatter={(value: number) => [`${value} g/dL`, 'Hemoglobin']}
                      />
                      <ReferenceLine y={13} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Lower Normal (13)', fill: '#22c55e', fontSize: 10, position: 'right' }} />
                      <Area type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} fill="url(#hgbGradient)" dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 py-8 border-t border-slate-200">
          <p>Medical History Record — Last Updated: May 2026</p>
          <p className="mt-1">This document is for medical reference purposes only.</p>
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

// Concern Item Component
function ConcernItem({ 
  number, 
  severity, 
  title, 
  children 
}: { 
  number: number
  severity: "critical" | "high" | "moderate"
  title: string
  children: React.ReactNode 
}) {
  const severityClasses = {
    critical: "border-l-red-500 bg-red-50",
    high: "border-l-amber-500 bg-amber-50",
    moderate: "border-l-yellow-500 bg-yellow-50",
  }

  return (
    <div className={`border-l-4 ${severityClasses[severity]} rounded-r-lg p-4`}>
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-medium">{number}</span>
        <div>
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 mt-1">{children}</p>
        </div>
      </div>
    </div>
  )
}
