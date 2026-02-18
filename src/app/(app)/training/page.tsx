"use client";

import { ChevronLeft, ChevronRight, Calendar, Flame, Clock, Check, Play, Plus, Edit, Maximize2, Dumbbell, } from "lucide-react";

export default function TrainingPage() {
    return (
        <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <h1 className="text-xl font-bold text-slate-800">Treino Semanal</h1>
                <div className="flex items-center gap-4 flex-wrap">
                    {/* Week Selector */}
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-[var(--color-primary)] transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="px-4 font-semibold text-sm text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
                            Out 23 - Out 29
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-500 hover:text-[var(--color-primary)] transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    {/* Stats */}
                    <div className="hidden md:flex gap-6 items-center">
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Volume Semanal</p>
                            <p className="text-lg font-bold text-slate-800">12,450 <span className="text-xs font-normal text-slate-400">kg</span></p>
                        </div>
                        <div className="w-px h-8 bg-slate-200" />
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Calorias</p>
                            <p className="text-lg font-bold text-[var(--color-primary)]">2,300 <span className="text-xs font-normal text-slate-400">kcal</span></p>
                        </div>
                        <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg px-4 py-2 text-sm font-medium shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Registro Rápido
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 min-h-[400px] mb-8">
                {/* Monday: Done */}
                <DayCard day="Seg" date={23} status="done" title="Força Membros Superiores" subtitle="Foco em Força" duration="45 min" intensity="Alta" intensityColor="text-orange-500" tags={["Supino", "Remada"]} />
                {/* Tuesday: Done */}
                <DayCard day="Ter" date={24} status="done" title="Cardio Contínuo" subtitle="Resistência" duration="30 min" intensity="Baixa" intensityColor="text-green-500" stat="3,2 km" />
                {/* Wednesday: Rest */}
                <div className="flex flex-col gap-2 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="text-center pb-2 border-b-2 border-slate-200">
                        <span className="block text-xs font-semibold text-slate-400 uppercase">Qua</span>
                        <span className="block text-xl font-bold text-slate-500">25</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-4 flex flex-col items-center justify-center flex-1 text-center group">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <Dumbbell className="w-5 h-5 text-slate-400" />
                        </div>
                        <h3 className="font-medium text-slate-600">Dia de Descanso</h3>
                        <p className="text-xs text-slate-400 mt-1">Recuperação Ativa</p>
                        <button className="mt-4 text-xs text-[var(--color-primary)] font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Alterar para Treino</button>
                    </div>
                </div>
                {/* Thursday: Today */}
                <div className="flex flex-col gap-2 relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />
                    <div className="text-center pb-2 border-b-2 border-[var(--color-primary)]">
                        <span className="block text-xs font-semibold text-[var(--color-primary)] uppercase">Hoje</span>
                        <span className="block text-xl font-bold text-[var(--color-primary)]">26</span>
                    </div>
                    <div className="bg-white border-2 border-[var(--color-primary)] rounded-lg p-4 shadow-lg shadow-[var(--color-primary)]/10 flex flex-col flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2">
                            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Agendado</span>
                        </div>
                        <div className="mb-4 mt-2">
                            <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center mb-3 text-[var(--color-primary)]">
                                <Dumbbell className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800 leading-tight text-lg">Hipertrofia Membros Inferiores</h3>
                            <p className="text-xs text-slate-500 mt-1">Pernas &amp; Glúteos</p>
                        </div>
                        <div className="space-y-4 mt-auto">
                            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded">
                                <span className="flex items-center gap-1 font-medium"><Clock className="w-3 h-3 text-slate-400" /> 60 min</span>
                                <span className="flex items-center gap-1 font-medium text-orange-500"><Flame className="w-3 h-3" /> Alta</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Agachamento</span><span className="font-mono text-slate-400">4 x 8</span></div>
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Stiff</span><span className="font-mono text-slate-400">3 x 10</span></div>
                                <div className="flex justify-between items-center text-xs"><span className="text-slate-600">Afundo</span><span className="font-mono text-slate-400">3 x 12</span></div>
                            </div>
                            <button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-medium py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2">
                                Iniciar Treino <Play className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Friday */}
                <DayCard day="Sex" date={27} status="upcoming" title="Mobilidade Corpo Inteiro" subtitle="Fluxo de Recuperação" duration="20 min" intensity="Baixa" intensityColor="text-green-500" />
                {/* Saturday */}
                <DayCard day="Sáb" date={28} status="upcoming" title="Circuitos HIIT" subtitle="Condicionamento" duration="35 min" intensity="Máx" intensityColor="text-red-500" />
                {/* Sunday: Empty */}
                <div className="flex flex-col gap-2">
                    <div className="text-center pb-2 border-b-2 border-slate-200">
                        <span className="block text-xs font-semibold text-slate-400 uppercase">Dom</span>
                        <span className="block text-xl font-bold text-slate-800">29</span>
                    </div>
                    <button className="bg-white border-2 border-dashed border-slate-200 rounded-lg p-4 flex flex-col items-center justify-center flex-1 text-center group hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all">
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-white group-hover:text-[var(--color-primary)] transition-colors text-slate-400">
                            <Plus className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-600 group-hover:text-[var(--color-primary)]">Planejar Treino</h3>
                        <p className="text-xs text-slate-400 mt-1">ou Dia de Descanso</p>
                    </button>
                </div>
            </div>

            {/* Session Details */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Detalhes da Sessão de Hoje</h2>
                        <p className="text-sm text-slate-500">Hipertrofia Membros Inferiores • 60 min</p>
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
                                <th className="px-6 py-4">Exercício</th>
                                <th className="px-6 py-4">Séries</th>
                                <th className="px-6 py-4">Reps Alvo</th>
                                <th className="px-6 py-4">Último Peso</th>
                                <th className="px-6 py-4 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <ExerciseRow name="Agachamento Barra" type="Composto • Pernas" sets={4} reps="8 - 10" weight="100 kg" active />
                            <ExerciseRow name="Stiff" type="Composto • Posteriores" sets={3} reps="10 - 12" weight="85 kg" />
                            <ExerciseRow name="Afundo Caminhando" type="Acessório • Glúteos" sets={3} reps="12 / perna" weight="20 kg" />
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                    <button className="text-sm text-[var(--color-primary)] font-medium hover:underline flex items-center gap-1">
                        Adicionar Exercício <Plus className="w-4 h-4" />
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
                            <Check className="w-2.5 h-2.5" /> Feito
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
                            <p className="text-xs text-slate-400 mb-2">Exercícios Principais</p>
                            <div className="flex flex-wrap gap-1">
                                {tags.map(t => <span key={t} className="bg-slate-50 text-slate-600 px-2 py-1 rounded text-[10px] border border-slate-100">{t}</span>)}
                            </div>
                        </div>
                    )}
                    {stat && (
                        <div className="pt-3 border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-2">Estatísticas</p>
                            <p className="text-sm font-semibold text-slate-700">{stat}</p>
                        </div>
                    )}
                    {status === "upcoming" && (
                        <div className="pt-3 border-t border-slate-100">
                            <button className="w-full text-slate-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 border border-slate-200 hover:border-[var(--color-primary)]/30 rounded py-1.5 text-xs font-medium transition-colors">
                                Pré-visualizar Detalhes
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
                <button className={`${active ? "text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10" : "text-slate-400 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"} px-3 py-1.5 rounded text-xs font-medium transition-colors`}>Registrar</button>
            </td>
        </tr>
    );
}
