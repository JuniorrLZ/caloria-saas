"use client";

import { Calendar, Sparkles, ArrowRight, ChevronRight, TrendingDown } from "lucide-react";

export default function ProgressPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span>Reports</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[var(--color-primary)] font-medium">Long Term Trends</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Consistency &amp; Progress</h1>
                    <p className="text-slate-500 mt-1 max-w-2xl">Visualizing your adherence to nutrition goals and weight trends over the last 12 months.</p>
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    <button className="px-4 py-1.5 text-sm font-medium rounded bg-white text-slate-900 shadow-sm border border-slate-200">Year</button>
                    <button className="px-4 py-1.5 text-sm font-medium rounded text-slate-500 hover:text-slate-900 transition-colors">Month</button>
                    <button className="px-4 py-1.5 text-sm font-medium rounded text-slate-500 hover:text-slate-900 transition-colors">Week</button>
                </div>
            </div>

            {/* Heatmap Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                        Goal Adherence Heatmap
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-200" /> No Log</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[var(--color-primary)]/20" /> Missed</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[var(--color-primary)]/50" /> Near</div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[var(--color-primary)]" /> Perfect</div>
                    </div>
                </div>
                {/* Heatmap Grid */}
                <div className="w-full overflow-x-auto pb-2">
                    <div className="min-w-[800px]">
                        <div className="flex text-[10px] text-slate-400 mb-2 pl-8">
                            <div className="w-full flex justify-between">
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => <span key={m}>{m}</span>)}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex flex-col gap-[4px] mr-2 text-[10px] text-slate-400 leading-[10px] pt-[2px]">
                                <span className="h-[10px]">Mon</span>
                                <span className="h-[10px]"></span>
                                <span className="h-[10px]">Wed</span>
                                <span className="h-[10px]"></span>
                                <span className="h-[10px]">Fri</span>
                            </div>
                            <div className="grid flex-1 gap-[4px]" style={{ gridTemplateColumns: "repeat(53, 1fr)" }}>
                                {Array.from({ length: 53 * 5 }, (_, i) => {
                                    const rand = ((i * 7 + 13) % 100) / 100;
                                    let color = "bg-slate-200";
                                    if (rand > 0.7) color = "bg-[var(--color-primary)]";
                                    else if (rand > 0.5) color = "bg-[var(--color-primary)]/50";
                                    else if (rand > 0.3) color = "bg-[var(--color-primary)]/20";
                                    return <div key={i} className={`aspect-square rounded-sm ${color} hover:ring-1 ring-white/50 transition-all`} />;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-200">Current Streak: 12 Days 🔥</span>
                        <span className="text-slate-500">Longest Streak: 45 Days</span>
                    </div>
                    <div className="text-slate-400 text-xs">Updated 2 hours ago</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard label="Avg Weight" value="178.4" unit="lbs" change="-1.2 lbs" changeType="good" />
                <StatCard label="Avg Intake" value="2,150" unit="kcal" change="+4%" changeType="bad" />
                <StatCard label="Protein Avg" value="165" unit="g" change="+12%" changeType="good" />
                <StatCard label="Workouts" value="18" unit="sessions" change="0%" changeType="neutral" />
            </div>

            {/* Lower Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900">Weight Projection vs Actual</h3>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" /> Actual</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-400 border border-slate-300" /> Target</span>
                        </div>
                    </div>
                    <div className="relative h-64 w-full bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full p-4" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3c83f6" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3c83f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,80 Q300,150 800,200" fill="none" stroke="#64748b" strokeDasharray="5,5" strokeOpacity="0.5" strokeWidth="2" />
                            <path d="M0,80 L50,90 L100,75 L150,110 L200,100 L250,130 L300,120 L350,140 L400,135 L450,160 L500,150 L550,180 L600,170 L650,190 L700,200 L750,185 L800,210 V300 H0 Z" fill="url(#gradientArea)" />
                            <path d="M0,80 L50,90 L100,75 L150,110 L200,100 L250,130 L300,120 L350,140 L400,135 L450,160 L500,150 L550,180 L600,170 L650,190 L700,200 L750,185 L800,210" fill="none" stroke="#3c83f6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            <circle cx="600" cy="170" fill="#3c83f6" r="5" stroke="white" strokeWidth="2" />
                        </svg>
                        <div className="absolute top-[35%] left-[70%] bg-slate-900 text-white text-xs py-1 px-2 rounded shadow-lg transform -translate-x-1/2 -translate-y-full">
                            178.4 lbs
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900" />
                        </div>
                    </div>
                </div>

                {/* AI Insights */}
                <div className="bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent rounded-xl border border-[var(--color-primary)]/20 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                        <h3 className="font-bold text-slate-900">AI Insights</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                            <p className="text-sm text-slate-700 leading-relaxed">
                                <span className="font-semibold text-[var(--color-primary)]">Great job!</span> You&apos;ve maintained a 12-day streak. Your protein intake has increased by <span className="text-green-500 font-medium">10%</span> compared to last month, which correlates with your steady weight loss trend.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Suggestion</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                Your calorie intake spiked slightly on weekends. Try meal prepping a high-protein snack for Saturdays to stay on track.
                            </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100 opacity-70 hover:opacity-100 transition-opacity cursor-pointer group">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">View detailed breakdown</span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, unit, change, changeType }: { label: string; value: string; unit: string; change: string; changeType: string }) {
    const changeColor = changeType === "good" ? "bg-green-500/10 text-green-500 ring-green-500/20" : changeType === "bad" ? "bg-red-500/10 text-red-500 ring-red-500/20" : "bg-slate-100 text-slate-400 ring-slate-200";
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-[var(--color-primary)]/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value} <span className="text-sm font-normal text-slate-400">{unit}</span></h3>
                </div>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${changeColor}`}>{change}</span>
            </div>
            <div className="h-10 w-full flex items-end gap-1">
                {[60, 50, 70, 65, 55, 45].map((h, i) => (
                    <div key={i} className={`w-1/6 ${i === 5 ? "bg-[var(--color-primary)]" : "bg-slate-200"} rounded-t-sm`} style={{ height: `${h}%` }} />
                ))}
            </div>
            <p className="text-xs text-slate-500 mt-3">vs. last month avg</p>
        </div>
    );
}
