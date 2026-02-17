"use client";

import { Calculator, ChevronDown } from "lucide-react";

export default function HealthCalculatorPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-slate-100">
                <header className="mb-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-1 mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Calculator className="w-8 h-8 text-indigo-500" />
                            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">
                                Caloria.AI
                            </h1>
                        </div>
                        <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">Calculadora de Saúde</h2>
                    <p className="text-slate-500 text-sm">Preencha os dados abaixo para calcular seu plano nutricional inteligente</p>
                </header>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="weight">Peso atual:</label>
                        <div className="relative flex items-center">
                            <input className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" id="weight" placeholder="Ex: 72,5" step="0.1" type="number" />
                            <span className="absolute right-4 text-slate-400 font-medium">kg</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Objetivo:</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button className="py-3 px-4 rounded-xl border-2 border-indigo-500/20 bg-indigo-500/5 text-indigo-500 font-semibold transition-all" type="button">Manter</button>
                            <button className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-slate-300 transition-all" type="button">Engordar</button>
                            <button className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-slate-300 transition-all" type="button">Emagrecer</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Sexo:</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-400 text-white font-semibold shadow-sm transition-all hover:bg-purple-500" type="button">
                                ♀ Mulher
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-100 text-sky-700 font-semibold border border-sky-200 transition-all" type="button">
                                ♂ Homem
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="age">Idade:</label>
                            <div className="relative flex items-center">
                                <input className="w-full pl-4 pr-16 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" id="age" placeholder="Ex: 35" type="number" />
                                <span className="absolute right-4 text-slate-400 text-sm">anos</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="heightInput">Altura:</label>
                            <div className="relative flex items-center">
                                <input className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" id="heightInput" placeholder="Ex: 160" type="number" />
                                <span className="absolute right-4 text-slate-400 text-sm">cm</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="employment">Tipo de emprego:</label>
                        <div className="relative">
                            <select className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 appearance-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" id="employment">
                                <option>Trabalho com pouco esforço físico</option>
                                <option>Trabalho moderado</option>
                                <option>Trabalho pesado</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="exercise">Exercício físico semanal:</label>
                        <div className="relative">
                            <select className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 appearance-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none" id="exercise">
                                <option>Pouco ou nada</option>
                                <option>1-3 vezes por semana</option>
                                <option>4-5 vezes por semana</option>
                                <option>Diariamente</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-500 to-sky-400 hover:opacity-90 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2" type="submit">
                        <Calculator className="w-5 h-5" />
                        CALCULAR MEU PLANO
                    </button>
                </form>

                <footer className="mt-8 text-center text-xs text-slate-400">
                    © 2024 Caloria.AI • <a className="hover:text-indigo-500 transition-colors font-medium" href="#">Termos de Uso</a> • <a className="hover:text-indigo-500 transition-colors font-medium" href="#">Privacidade</a>
                </footer>
            </div>
        </div>
    );
}
