"use client";

import { Droplet, Scale, Zap, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

const metrics = [
    { label: "Percentual de Gordura", value: "18.5%", trend: "down", color: "text-orange-500", icon: Droplet, bg: "bg-orange-50 border-orange-100", detail: "Meta: 15%" },
    { label: "Massa Muscular", value: "62.3 kg", trend: "up", color: "text-blue-500", icon: Zap, bg: "bg-blue-50 border-blue-100", detail: "+1.2 kg este mês" },
    { label: "Água Corporal", value: "55.2%", trend: "stable", color: "text-cyan-500", icon: Droplet, bg: "bg-cyan-50 border-cyan-100", detail: "Faixa saudável" },
    { label: "IMC", value: "22.1", trend: "down", color: "text-green-500", icon: Scale, bg: "bg-green-50 border-green-100", detail: "Peso normal" },
    { label: "TMB", value: "1,650 kcal", trend: "stable", color: "text-purple-500", icon: Activity, bg: "bg-purple-50 border-purple-100", detail: "Taxa Metabólica Basal" },
    { label: "Peso Ósseo", value: "3.1 kg", trend: "stable", color: "text-slate-500", icon: Scale, bg: "bg-slate-50 border-slate-200", detail: "Dentro da faixa normal" },
];

const historyData = [
    { date: "15 Mai", fat: 19.2, muscle: 61.5 },
    { date: "01 Jun", fat: 18.9, muscle: 61.8 },
    { date: "15 Jun", fat: 18.7, muscle: 62.0 },
    { date: "01 Jul", fat: 18.5, muscle: 62.3 },
];

function TrendIcon({ trend }: { trend: string }) {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
}

export default function BioimpedancePage() {
    return (
        <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Análise de Bioimpedância</h1>
                    <p className="text-slate-500 mt-2">Visão detalhada da sua composição corporal</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {metrics.map((m) => (
                        <div key={m.label} className={`rounded-2xl p-6 border ${m.bg} shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${m.bg}`}>
                                    <m.icon className={`w-6 h-6 ${m.color}`} />
                                </div>
                                <TrendIcon trend={m.trend} />
                            </div>
                            <h3 className="text-sm text-slate-500 font-medium uppercase tracking-wider">{m.label}</h3>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{m.value}</p>
                            <p className="text-xs text-slate-400 mt-2">{m.detail}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Histórico de Composição</h2>
                            <p className="text-sm text-slate-500">Acompanhe suas mudanças ao longo do tempo</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left py-3 px-4 font-medium text-slate-500">Data</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-500">% Gordura</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-500">Massa Muscular</th>
                                    <th className="text-left py-3 px-4 font-medium text-slate-500">Variação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-slate-900">{row.date}</td>
                                        <td className="py-3 px-4 text-slate-700">{row.fat}%</td>
                                        <td className="py-3 px-4 text-slate-700">{row.muscle} kg</td>
                                        <td className="py-3 px-4">
                                            {i === 0 ? (
                                                <span className="text-slate-400">—</span>
                                            ) : (
                                                <span className="text-green-600 font-medium">
                                                    -{(historyData[i - 1].fat - row.fat).toFixed(1)}% gordura
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent rounded-2xl p-8 border border-[var(--color-primary)]/10">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">💡 Insight de IA</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Sua massa muscular aumentou 1,3% no último mês enquanto o percentual de gordura diminuiu 0,7%.
                        Isso indica um progresso sólido de recomposição corporal. Continue com seu plano de treino atual e mantenha
                        a ingestão de proteínas acima de 130g diárias para resultados ótimos.
                    </p>
                </div>
            </div>
        </div>
    );
}
