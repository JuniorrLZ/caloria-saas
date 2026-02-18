"use client";

import { Calculator, Target, Flame, Dumbbell, Droplets, TrendingUp, ChevronDown, ArrowRight, Sparkles } from "lucide-react";

export default function CalculatorResultsPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100">
                <header className="mb-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-1 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Calculator className="w-8 h-8 text-indigo-500" />
                            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">
                                Caloria.AI
                            </h1>
                        </div>
                        <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Seus Resultados</h2>
                    <p className="text-slate-500 text-sm">Com base no seu perfil e objetivos, aqui está seu plano personalizado</p>
                </header>

                {/* BMI / TMB Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 text-center border border-indigo-200">
                        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Seu IMC</p>
                        <h3 className="text-4xl font-bold text-indigo-600">24.5</h3>
                        <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Peso Normal</span>
                    </div>
                    <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl p-6 text-center border border-sky-200">
                        <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Taxa Metabólica Basal</p>
                        <h3 className="text-4xl font-bold text-sky-600">1.540</h3>
                        <p className="text-xs text-sky-500 mt-1">kcal / dia</p>
                    </div>
                </div>

                {/* Daily Goals */}
                <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-[var(--color-primary)]" /> Meta Calórica Diária</h3>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold text-slate-900">2.000 <span className="text-lg font-normal text-slate-500">kcal</span></span>
                        <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold px-3 py-1 rounded-full">Manutenção</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Dumbbell className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-slate-900">140g</p>
                            <p className="text-xs text-slate-500 font-medium">Proteína</p>
                        </div>
                        <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Flame className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-slate-900">220g</p>
                            <p className="text-xs text-slate-500 font-medium">Carboidratos</p>
                        </div>
                        <div className="text-center bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Droplets className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-slate-900">70g</p>
                            <p className="text-xs text-slate-500 font-medium">Gordura</p>
                        </div>
                    </div>
                </div>

                {/* Water Recommendation */}
                <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0">
                        <Droplets className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Ingestão de Água</h3>
                        <p className="text-slate-600 text-sm">Recomendado: <span className="font-bold text-blue-600">2.500 ml / dia</span></p>
                    </div>
                </div>

                {/* AI Insight */}
                <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-2xl p-6 mb-6 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold text-slate-800">Recomendação da IA</h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        Com base no seu perfil, recomendamos focar em uma abordagem <span className="font-semibold text-indigo-600">rica em proteína e moderada em carboidratos</span>.
                        Isso ajudará a manter seu peso atual enquanto apoia a recuperação muscular da sua rotina de exercícios.
                        Considere consumir carboidratos próximo ao horário do treino para energia ideal.
                    </p>
                </div>

                {/* CTA */}
                <button className="w-full bg-gradient-to-r from-indigo-500 to-sky-400 hover:opacity-90 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    COMEÇAR A RASTREAR
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                    Resultados baseados na equação de Mifflin-St Jeor. Consulte um profissional para orientação personalizada.
                </p>
            </div>
        </div>
    );
}
