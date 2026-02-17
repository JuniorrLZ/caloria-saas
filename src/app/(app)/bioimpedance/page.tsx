"use client";

import { Activity, Ruler, Droplets, Zap, TrendingDown, TrendingUp, Info } from "lucide-react";

export default function BioimpedancePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Body Composition Analysis</h1>
                    <p className="text-slate-500 mt-2">Full bioimpedance breakdown from your last assessment on <span className="font-semibold text-slate-700">Oct 20, 2024</span>.</p>
                </div>
                <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2">
                    <Activity className="w-4 h-4" /> New Assessment
                </button>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <ScoreCard label="Body Fat" value="18.2%" change="-1.4%" trend="down" color="bg-green-50 text-green-600" />
                <ScoreCard label="Muscle Mass" value="68.5 kg" change="+0.8 kg" trend="up" color="bg-blue-50 text-blue-600" />
                <ScoreCard label="Water Level" value="55.3%" change="+0.2%" trend="up" color="bg-cyan-50 text-cyan-600" />
                <ScoreCard label="BMR" value="1,740 kcal" change="+25 kcal" trend="up" color="bg-purple-50 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Composition Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Body Composition Breakdown</h2>
                    <div className="flex items-center justify-center py-8">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="80" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="200" strokeLinecap="round" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="235" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-slate-900">82.4</span>
                                <span className="text-xs text-slate-500">kg total</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <LegendItem color="bg-blue-500" label="Muscle" value="68.5 kg" pct="83.1%" />
                        <LegendItem color="bg-amber-500" label="Fat" value="11.2 kg" pct="13.6%" />
                        <LegendItem color="bg-emerald-500" label="Bone" value="2.7 kg" pct="3.3%" />
                    </div>
                </div>

                {/* Segmental Analysis */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Segmental Analysis</h2>
                    <div className="space-y-4">
                        <SegmentBar label="Right Arm" muscle="3.8 kg" fat="0.9 kg" pct={82} />
                        <SegmentBar label="Left Arm" muscle="3.6 kg" fat="1.0 kg" pct={78} />
                        <SegmentBar label="Trunk" muscle="28.0 kg" fat="5.2 kg" pct={84} />
                        <SegmentBar label="Right Leg" muscle="11.2 kg" fat="2.5 kg" pct={82} />
                        <SegmentBar label="Left Leg" muscle="11.0 kg" fat="2.6 kg" pct={81} />
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">AI Insight</p>
                                <p className="text-xs text-blue-700 mt-1">Your left arm shows slightly less muscle mass. Consider adding unilateral exercises to balance asymmetry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Assessment History</h2>
                    <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Weight</th>
                                <th className="px-6 py-4 font-semibold">Body Fat</th>
                                <th className="px-6 py-4 font-semibold">Muscle Mass</th>
                                <th className="px-6 py-4 font-semibold">Water</th>
                                <th className="px-6 py-4 font-semibold">BMR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr className="bg-[var(--color-primary)]/5 font-medium">
                                <td className="px-6 py-4 text-[var(--color-primary)] font-bold">Oct 20</td>
                                <td className="px-6 py-4 text-slate-900">82.4 kg</td>
                                <td className="px-6 py-4 text-green-600">18.2%</td>
                                <td className="px-6 py-4 text-slate-900">68.5 kg</td>
                                <td className="px-6 py-4 text-slate-900">55.3%</td>
                                <td className="px-6 py-4 text-slate-900">1,740</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-600">Sep 20</td>
                                <td className="px-6 py-4 text-slate-600">83.2 kg</td>
                                <td className="px-6 py-4 text-slate-600">19.6%</td>
                                <td className="px-6 py-4 text-slate-600">67.7 kg</td>
                                <td className="px-6 py-4 text-slate-600">55.1%</td>
                                <td className="px-6 py-4 text-slate-600">1,715</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-slate-600">Aug 18</td>
                                <td className="px-6 py-4 text-slate-600">84.0 kg</td>
                                <td className="px-6 py-4 text-slate-600">20.1%</td>
                                <td className="px-6 py-4 text-slate-600">66.5 kg</td>
                                <td className="px-6 py-4 text-slate-600">54.8%</td>
                                <td className="px-6 py-4 text-slate-600">1,700</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ScoreCard({ label, value, change, trend, color }: { label: string; value: string; change: string; trend: string; color: string }) {
    return (
        <div className={`rounded-2xl p-5 border ${color} border-current/10`}>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-2">{label}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                {trend === "down" ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                <span>{change}</span>
            </div>
        </div>
    );
}

function LegendItem({ color, label, value, pct }: { color: string; label: string; value: string; pct: string }) {
    return (
        <div className="text-center">
            <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
            <p className="text-sm font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{label} ({pct})</p>
        </div>
    );
}

function SegmentBar({ label, muscle, fat, pct }: { label: string; muscle: string; fat: string; pct: number }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="text-slate-400">{muscle} muscle • {fat} fat</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
