"use client";

import { ChevronLeft, ChevronRight, Calendar, Flame, Clock, Check, Play, Plus, Edit, Maximize2, Dumbbell, } from "lucide-react";

export default function TrainingPage() {
    return (
        <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <h1 className="text-xl font-bold text-slate-800">Weekly Training</h1>
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Week Selector */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-[var(--color-primary)] transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="px-4 font-semibold text-sm text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                            Oct 23 - Oct 29
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-[var(--color-primary)] transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Stats */}
                    <div className="hidden md:flex gap-6 items-center">
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Weekly Volume</p>
                            <p className="text-lg font-bold text-slate-800">12,450 <span className="text-xs font-normal text-slate-400">kg</span></p>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Calories</p>
                            <p className="text-lg font-bold text-[var(--color-primary)]">2,300 <span className="text-xs font-normal text-slate-400">kcal</span></p>
                        </div>
                        <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg px-4 py-2 text-sm font-medium shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Quick Log
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 min-h-[400px] mb-8">
                {/* Monday: Done */}
                <DayCard day="Mon" date={23} status="done" title="Upper Body Power" subtitle="Strength Focus" duration="45 min" intensity="High" intensityColor="text-orange-500" tags={["Bench Press", "Rows"]} />
                {/* Tuesday: Done */}
                <DayCard day="Tue" date={24} status="done" title="Steady State Cardio" subtitle="Endurance" duration="30 min" intensity="Low" intensityColor="text-green-500" stat="3.2 km" />
                {/* Wednesday: Rest */}
                <div className="flex flex-col gap-2 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="text-center pb-2 border-b-2 border-slate-200">
                        <span className="block text-xs font-semibold text-slate-400 uppercase">Wed</span>
                        <span className="block text-xl font-bold text-slate-500">25</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-4 flex flex-col items-center justify-center flex-1 text-center group">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <Dumbbell className="w-5 h-5 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-600">Rest Day</h3>
                        <p className="text-xs text-slate-400 mt-1">Active Recovery</p>
                        <button className="mt-4 text-xs text-[var(--color-primary)] font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Change to Workout</button>
                    </div>
                </div>
                {/* Thursday: Today */}
                <div className="flex flex-col gap-2 relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
                    <div className="text-center pb-2 border-b-2 border-[var(--color-primary)]">
                        <span className="block text-xs font-semibold text-[var(--color-primary)] uppercase">Today</span>
                        <span className="block text-xl font-bold text-[var(--color-primary)]">26</span>
                    </div>
                    <div className="bg-white border-2 border-[var(--color-primary)] rounded-lg p-4 shadow-lg shadow-[var(--color-primary)]/10 flex flex-col flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2">
                            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Scheduled</span>
                        </div>
                        <div className="mb-4 mt-2">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-3 text-[var(--color-primary)]">
                                <Dumbbell className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800 leading-tight text-lg">Lower Body Hypertrophy</h3>
                            <p className="text-xs text-slate-500 mt-1">Legs &amp; Glutes</p>
                        </div>
                        <div className="space-y-4 mt-auto">
                            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3 text-slate-400" /> 60 min</span>
                                <span className="flex items-center gap-1 font-medium text-orange-500"><Flame className="w-3 h-3" /> High</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Squats</span><span className="font-mono text-slate-400">4 x 8</span></div>
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-600">RDLs</span><span className="font-mono text-slate-400">3 x 10</span></div>
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Lunges</span><span className="font-mono text-slate-400">3 x 12</span></div>
                            </div>
                            <button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2">
                                Start Workout <Play className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Friday */}
                <DayCard day="Fri" date={27} status="upcoming" title="Full Body Mobility" subtitle="Recovery Flow" duration="20 min" intensity="Low" intensityColor="text-green-500" />
                {/* Saturday */}
                <DayCard day="Sat" date={28} status="upcoming" title="HIIT Circuits" subtitle="Conditioning" duration="35 min" intensity="Max" intensityColor="text-red-500" />
                {/* Sunday: Empty */}
                <div className="flex flex-col gap-2">
                    <div className="text-center pb-2 border-b-2 border-slate-200">
                        <span className="block text-xs font-semibold text-slate-400 uppercase">Sun</span>
                        <span className="block text-xl font-bold text-slate-800">29</span>
                    </div>
                    <button className="bg-white border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center flex-1 text-center group hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-white group-hover:text-[var(--color-primary)] transition-colors text-slate-400">
                            <Plus className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-600 group-hover:text-[var(--color-primary)]">Plan Workout</h3>
                        <p className="text-xs text-slate-400 mt-1">or Rest Day</p>
                    </button>
                </div>
            </div>

            {/* Session Details */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Today&apos;s Session Details</h2>
                        <p className="text-sm text-slate-500">Lower Body Hypertrophy • 60 min</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-[var(--color-primary)] p-2 rounded-full hover:bg-slate-50"><Edit className="w-5 h-5" /></button>
                        <button className="text-slate-400 hover:text-[var(--color-primary)] p-2 rounded-full hover:bg-slate-50"><Maximize2 className="w-5 h-5" /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Exercise</th>
                                <th className="px-6 py-4">Sets</th>
                                <th className="px-6 py-4">Target Reps</th>
                                <th className="px-6 py-4">Last Weight</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <ExerciseRow name="Barbell Squat" type="Compound • Legs" sets={4} reps="8 - 10" weight="100 kg" active />
                            <ExerciseRow name="Romanian Deadlift" type="Compound • Hamstrings" sets={3} reps="10 - 12" weight="85 kg" />
                            <ExerciseRow name="Walking Lunges" type="Accessory • Glutes" sets={3} reps="12 / leg" weight="20 kg" />
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                    <button className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1">
                        Add Exercise <Plus className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
    );
}

function DayCard({ day, date, status, title, subtitle, duration, intensity, intensityColor, tags, stat }: {
    day: string; date: number; status: string; title: string; subtitle: string; duration: string; intensity: string; intensityColor: string; tags?: string[]; stat?: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="text-center pb-2 border-b-2 border-[var(--color-primary)]/20">
                <span className="block text-xs font-semibold text-slate-400 uppercase">{day}</span>
                <span className="block text-xl font-bold text-slate-800">{date}</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-[var(--color-primary)]/50 transition-all cursor-pointer group flex flex-col flex-1 relative overflow-hidden">
                {status === "done" && (
                    <div className="absolute top-0 right-0 p-2">
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Done
                        </span>
                    </div>
                )}
                <div className="mb-4 mt-2">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3 text-indigo-600">
                        <Dumbbell className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 leading-tight">{title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
                </div>
                <div className="space-y-3 mt-auto">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {duration}</span>
                        <span className={`flex items-center gap-1 ${intensityColor}`}><Flame className="w-3 h-3" /> {intensity}</span>
                    </div>
                    {tags && (
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-2">Key Lifts</p>
                            <div className="flex flex-wrap gap-1">
                                {tags.map(t => <span key={t} className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-[10px] border border-slate-100">{t}</span>)}
                            </div>
                        </div>
                    )}
                    {stat && (
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-2">Stats</p>
                            <p className="text-sm font-semibold text-slate-700">{stat}</p>
                        </div>
                    )}
                    {status === "upcoming" && (
                        <div className="pt-3 border-t border-slate-100">
                            <button className="w-full text-slate-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 border border-slate-200 hover:border-[var(--color-primary)]/30 rounded py-1.5 text-xs font-medium transition-colors">
                                Preview Details
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ExerciseRow({ name, type, sets, reps, weight, active }: { name: string; type: string; sets: number; reps: string; weight: string; active?: boolean }) {
    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <span>{name}</span>
                    <span className="block text-xs text-slate-400 font-normal">{type}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-1">
                    {Array.from({ length: sets }, (_, i) => (
                        <span key={i} className={`w-6 h-6 rounded text-xs flex items-center justify-center ${active && i === 0 ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold" : "bg-slate-100 text-slate-400"}`}>{i + 1}</span>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4 font-mono">{reps}</td>
            <td className="px-6 py-4 font-mono text-slate-500">{weight}</td>
            <td className="px-6 py-4 text-right">
                <button className={`${active ? "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10" : "text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"} px-3 py-1.5 rounded text-xs font-medium transition-colors`}>Log Set</button>
            </td>
        </tr>
    );
}
