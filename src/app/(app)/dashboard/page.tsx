"use client";

import { Flame, HourglassIcon, Flag, Plus, Droplets, Footprints } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kcal Consumed */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="z-10">
                            <p className="text-slate-500 text-sm font-medium mb-1">Kcal Consumed</p>
                            <h3 className="text-3xl font-bold text-slate-900">1,450</h3>
                            <p className="text-xs text-slate-400 mt-2">72% of daily goal</p>
                        </div>
                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-slate-100" cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" strokeWidth="8" />
                                <circle className="text-[var(--color-primary)]" cx="40" cy="40" fill="transparent" r="32" stroke="currentColor" strokeDasharray="200" strokeDashoffset="56" strokeLinecap="round" strokeWidth="8" />
                            </svg>
                            <Flame className="absolute w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                    </div>

                    {/* Remaining Kcal */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <HourglassIcon className="w-16 h-16 text-[var(--color-primary)]" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Remaining</p>
                        <h3 className="text-3xl font-bold text-slate-900">550 <span className="text-lg font-normal text-slate-400">kcal</span></h3>
                        <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-slate-400 h-2 rounded-full" style={{ width: "28%" }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Budget available for dinner</p>
                    </div>

                    {/* Daily Goal */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Flag className="w-16 h-16 text-green-500" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Daily Goal</p>
                        <h3 className="text-3xl font-bold text-slate-900">2,000 <span className="text-lg font-normal text-slate-400">kcal</span></h3>
                        <div className="flex items-center gap-2 mt-4">
                            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">On Track</span>
                            <span className="text-xs text-slate-400">Maintained for 5 days</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Weight Chart Card */}
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">Weight Progress</h2>
                                    <p className="text-sm text-slate-500">Last 30 Days Trend</p>
                                </div>
                                <select className="bg-slate-50 border-none text-sm text-slate-600 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-[var(--color-primary)]/20">
                                    <option>Last 30 Days</option>
                                    <option>Last 3 Months</option>
                                    <option>Last Year</option>
                                </select>
                            </div>
                            {/* Chart Placeholder */}
                            <div className="h-64 w-full relative bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent rounded-lg flex items-end p-4">
                                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3c83f6" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#3c83f6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,120 L60,100 L120,110 L180,80 L240,70 L300,50 L360,40 L400,30 L400,200 L0,200 Z" fill="url(#chartGrad)" />
                                    <polyline fill="none" points="0,120 60,100 120,110 180,80 240,70 300,50 360,40 400,30" stroke="#3c83f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="400" cy="30" r="5" fill="#3c83f6" stroke="white" strokeWidth="2" />
                                </svg>
                            </div>
                            {/* Stats Footer */}
                            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Current</p>
                                    <p className="text-lg font-bold text-slate-900">74.5 kg</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Start</p>
                                    <p className="text-lg font-bold text-slate-900">78.2 kg</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Change</p>
                                    <p className="text-lg font-bold text-green-500">-3.7 kg</p>
                                </div>
                            </div>
                        </div>

                        {/* Water + Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">Water Intake</h3>
                                    <p className="text-sm text-slate-500">1,250ml / 2,500ml</p>
                                </div>
                                <button className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">Steps</h3>
                                    <p className="text-sm text-slate-500">6,542 / 10,000</p>
                                </div>
                                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    <Footprints className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Macronutrients */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-slate-900">Macronutrients</h2>
                                <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">Details</button>
                            </div>
                            <div className="space-y-6">
                                {/* Protein */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">Protein</span>
                                        <span className="text-sm text-slate-500">120g / 150g</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div className="bg-purple-500 h-3 rounded-full relative" style={{ width: "80%" }}>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 text-right">80%</p>
                                </div>
                                {/* Carbs */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">Carbs</span>
                                        <span className="text-sm text-slate-500">150g / 300g</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div className="bg-[var(--color-primary)] h-3 rounded-full relative" style={{ width: "50%" }}>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 text-right">50%</p>
                                </div>
                                {/* Fats */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-slate-700">Fats</span>
                                        <span className="text-sm text-slate-500">45g / 65g</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3">
                                        <div className="bg-yellow-500 h-3 rounded-full relative" style={{ width: "69%" }}>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 text-right">69%</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Meals */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Meals</h2>
                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white" />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Breakfast • 08:30 AM</p>
                                            <h4 className="text-sm font-medium text-slate-900">Oatmeal &amp; Berries</h4>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">350 kcal</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white" />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Lunch • 01:15 PM</p>
                                            <h4 className="text-sm font-medium text-slate-900">Grilled Chicken Salad</h4>
                                        </div>
                                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">550 kcal</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
                                    <div className="flex items-start justify-between opacity-50">
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Dinner • Upcoming</p>
                                            <h4 className="text-sm font-medium text-slate-900 italic">Not logged yet</h4>
                                        </div>
                                        <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] text-xs font-bold flex items-center gap-1">
                                            <Plus className="w-3 h-3" /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
