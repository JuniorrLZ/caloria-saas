"use client";

import { User, Lock, Bell, Shield, Eye, EyeOff, Camera, Save } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configurações do Perfil</h1>
                <p className="text-slate-500 mt-2">Gerencie suas informações de conta e preferências.</p>
            </div>

            <div className="space-y-8">
                {/* Profile Avatar & Name */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] text-3xl font-bold">
                                SJ
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:bg-[var(--color-primary-dark)] transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl font-bold text-slate-900">Sarah Jenkins</h2>
                            <p className="text-sm text-slate-500 mt-1">sarah.jenkins@email.com</p>
                            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)]">Membro Pro</span>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                        <User className="w-5 h-5 text-[var(--color-primary)]" />
                        <h3 className="text-lg font-bold text-slate-900">Informações Pessoais</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="firstName">Nome</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" defaultValue="Sarah" id="firstName" type="text" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="lastName">Sobrenome</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" defaultValue="Jenkins" id="lastName" type="text" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Endereço de E-mail</label>
                            <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" defaultValue="sarah.jenkins@email.com" id="email" type="email" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="phone">Telefone</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" defaultValue="+1 (555) 234-5678" id="phone" type="tel" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="dob">Data de Nascimento</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" defaultValue="1990-05-15" id="dob" type="date" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="height">Altura</label>
                                <div className="relative">
                                    <input className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" defaultValue="165" id="height" type="number" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">cm</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="weight">Peso</label>
                                <div className="relative">
                                    <input className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" defaultValue="74.5" id="weight" type="number" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">kg</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="goal">Objetivo</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" id="goal">
                                    <option>Perda de Peso</option>
                                    <option>Manutenção</option>
                                    <option>Ganho de Peso</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Security */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                        <Lock className="w-5 h-5 text-[var(--color-primary)]" />
                        <h3 className="text-lg font-bold text-slate-900">Segurança da Conta</h3>
                    </div>
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="currentPassword">Senha Atual</label>
                            <div className="relative">
                                <input className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" id="currentPassword" placeholder="Digite a senha atual" type={showPassword ? "text" : "password"} />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)} type="button">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="newPassword">Nova Senha</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" id="newPassword" placeholder="Digite a nova senha" type="password" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirmPassword">Confirmar Senha</label>
                                <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all outline-none" id="confirmPassword" placeholder="Confirme a nova senha" type="password" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Shield className="w-4 h-4" /> Sua senha é criptografada e armazenada com segurança.
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                        <Bell className="w-5 h-5 text-[var(--color-primary)]" />
                        <h3 className="text-lg font-bold text-slate-900">Preferências de Notificação</h3>
                    </div>
                    <div className="p-8 space-y-4">
                        <NotifToggle label="Lembretes de Refeição" desc="Receba lembretes para registrar suas refeições" defaultChecked />
                        <NotifToggle label="Relatórios Semanais" desc="Receba resumos semanais de progresso" defaultChecked />
                        <NotifToggle label="Atividade da Comunidade" desc="Atualizações de grupos e desafios" />
                        <NotifToggle label="E-mails Promocionais" desc="Ofertas especiais e novos recursos" />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4 pb-4">
                    <button className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors">Cancelar</button>
                    <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2 transform active:scale-95">
                        <Save className="w-4 h-4" /> Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
}

function NotifToggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked || false);
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
            <div>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <button
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${checked ? "bg-[var(--color-primary)]" : "bg-slate-200"}`}
                onClick={() => setChecked(!checked)}
                role="switch"
                aria-checked={checked}
                type="button"
            >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`} />
            </button>
        </div>
    );
}
