"use client";

import { ChevronLeft, ChevronRight, Sun, Sunset, Moon, Cookie, Plus, PlusCircle, Trash2, Droplets } from "lucide-react";

export default function FoodDiaryPage() {
    return (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Date Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-slate-500" /></button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-900">Today, Oct 24</h2>
                        <span className="text-xs text-slate-500 font-medium">Thursday</span>
                    </div>
                    <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-slate-500" /></button>
                </div>
                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                    <div className="text-center">
                        <span className="block text-xs text-slate-500 font-medium uppercase tracking-wide">Calories</span>
                        <span className="block text-lg font-bold text-slate-800">1,240 <span className="text-sm font-normal text-slate-400">/ 2,200</span></span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="text-center">
                        <span className="block text-xs text-slate-500 font-medium uppercase tracking-wide">Net Carbs</span>
                        <span className="block text-lg font-bold text-[var(--color-primary)]">124g</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Food Diary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Breakfast */}
                    <MealSection icon={<Sun className="w-5 h-5" />} title="Breakfast" kcal="425 kcal" iconBg="bg-orange-100 text-orange-600"
                        items={[
                            { name: "Oatmeal with Blueberries", desc: "1 bowl (250g), made with water", kcal: 350 },
                            { name: "Black Coffee", desc: "1 cup (240ml)", kcal: 5 },
                            { name: "Almonds", desc: "10 nuts (12g)", kcal: 70 },
                        ]}
                    />
                    {/* Lunch */}
                    <MealSection icon={<Sunset className="w-5 h-5" />} title="Lunch" kcal="650 kcal" iconBg="bg-yellow-100 text-yellow-600"
                        items={[
                            { name: "Grilled Chicken Salad", desc: "Large bowl, caesar dressing", kcal: 550 },
                            { name: "Apple", desc: "1 medium", kcal: 95 },
                        ]}
                    />
                    {/* Dinner (Empty) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Moon className="w-5 h-5" /></div>
                                <h3 className="font-bold text-slate-800 text-lg">Dinner</h3>
                            </div>
                            <span className="text-sm font-bold text-slate-400">0 kcal</span>
                        </div>
                        <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Moon className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium mb-4">You haven&apos;t logged dinner yet</p>
                            <button className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Log Dinner
                            </button>
                        </div>
                    </div>
                    {/* Snacks */}
                    <MealSection icon={<Cookie className="w-5 h-5" />} title="Snacks" kcal="165 kcal" iconBg="bg-emerald-100 text-emerald-600"
                        items={[
                            { name: "Protein Bar", desc: "Chocolate Peanut Butter (45g)", kcal: 165 },
                        ]}
                    />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Daily Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
                        <h3 className="font-bold text-lg text-slate-900 mb-6">Daily Summary</h3>
                        <div className="flex flex-col items-center justify-center mb-8 relative">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8" />
                                    <circle className="text-[var(--color-primary)]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="100" strokeLinecap="round" strokeWidth="8" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-3xl font-bold text-slate-900">960</span>
                                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Left</span>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-slate-500">1,240 consumed of 2,200 goal</p>
                            </div>
                        </div>
                        {/* Macro Bars */}
                        <div className="space-y-5">
                            <MacroBar label="Protein" current="85g" goal="140g" pct={60} color="bg-indigo-500" />
                            <MacroBar label="Carbs" current="124g" goal="220g" pct={55} color="bg-emerald-500" />
                            <MacroBar label="Fat" current="42g" goal="70g" pct={60} color="bg-orange-500" />
                        </div>
                        <hr className="border-slate-100 my-6" />
                        {/* Water Tracker */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-slate-800 text-sm">Water Intake</h4>
                                <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">Target: 2500ml</span>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Droplets className="w-6 h-6 text-blue-500" />
                                    <span className="text-xl font-bold text-blue-900">1,250<span className="text-sm font-normal text-blue-400">ml</span></span>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm shadow-blue-500/30">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex justify-between mt-3 px-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-6 bg-blue-400 rounded-full" />)}
                                {[1, 2, 3].map(i => <div key={i} className="w-2 h-6 bg-slate-200 rounded-full" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MealSection({ icon, title, kcal, iconBg, items }: { icon: React.ReactNode; title: string; kcal: string; iconBg: string; items: { name: string; desc: string; kcal: number }[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
                    <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                </div>
                <span className="text-sm font-bold text-slate-600">{kcal}</span>
            </div>
            <div className="divide-y divide-slate-50">
                {items.map((item, i) => (
                    <div key={i} className="px-6 py-4 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-slate-900 font-medium text-sm">{item.name}</p>
                            <p className="text-slate-500 text-xs">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className="block text-sm font-bold text-slate-700">{item.kcal}</span>
                                <span className="text-[10px] text-slate-400 font-medium">kcal</span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="px-6 py-3 bg-slate-50/30">
                    <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] text-sm font-medium flex items-center gap-2 transition-colors">
                        <PlusCircle className="w-5 h-5" /> Add Food
                    </button>
                </div>
            </div>
        </div>
    );
}

function MacroBar({ label, current, goal, pct, color }: { label: string; current: string; goal: string; pct: number; color: string }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-slate-500 text-xs font-medium"><span className="text-slate-900 font-bold">{current}</span> / {goal}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
