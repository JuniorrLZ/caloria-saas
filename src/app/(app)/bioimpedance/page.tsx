"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import {
    Droplet,
    Scale,
    Zap,
    Activity,
    TrendingUp,
    TrendingDown,
    Minus,
    Loader2,
    X,
    Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface BioimpedanceEntry {
    id: string;
    date: string;
    weight_kg: number | null;
    body_fat_percent: number | null;
    muscle_mass_kg: number | null;
    body_water_percent: number | null;
    bmi: number | null;
    bmr_kcal: number | null;
    bone_mass_kg: number | null;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleString("pt-BR", { month: "short", day: "numeric" });
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function BioimpedancePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>}>
            <BioimpedanceContent />
        </Suspense>
    );
}

function BioimpedanceContent() {
    const supabase = createClient();
    const [entries, setEntries] = useState<BioimpedanceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    /* Listen for "open-log-measurement" event from header button */
    useEffect(() => {
        const handler = () => setModalOpen(true);
        window.addEventListener("open-log-measurement", handler);
        return () => window.removeEventListener("open-log-measurement", handler);
    }, []);

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        const { data } = await supabase
            .from("bioimpedance_entries")
            .select("*")
            .order("date", { ascending: false });

        if (data) {
            setEntries(data);
        }
        setLoading(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    /* Derived Data for Cards */
    const latest = entries[0] || null;
    const previous = entries[1] || null;

    const getTrend = (current: number | null, prev: number | null, lowerIsBetter = false): "up" | "down" | "stable" => {
        if (current === null || prev === null) return "stable";
        if (Math.abs(current - prev) < 0.1) return "stable";
        if (current > prev) return lowerIsBetter ? "down" : "up"; // "down" means bad if lowerIsBetter is true? Wait, TrendIcon green is up.
        // Let's stick to visual trend: up = arrow up (green), down = arrow down (red).
        // But usually green means good.
        // If lowerIsBetter (e.g. fat), current < prev is good (green).
        // If higherIsBetter (e.g. muscle), current > prev is good (green).

        // Let's simplify:
        // TrendIcon: up=green, down=red. This implies 'up' is always good? Not necessarily.
        // Let's just return direction and color manually in the card logic.
        return current > prev ? "up" : "down";
    };

    // Helper to build metrics
    // We will hardcode the trend colors based on logic
    const buildMetric = (
        label: string,
        value: number | null | undefined, // Updated type
        unit: string,
        prevValue: number | null | undefined, // Updated type
        icon: any,
        color: string,
        bg: string,
        lowerIsBetter = false
    ) => {
        // Safe check for current value
        if (value === null || value === undefined || isNaN(value)) {
            return {
                label,
                value: "—",
                trend: "stable" as const,
                detail: "Sem dados",
                icon,
                color,
                bg,
            };
        }

        let detail = "Primeira medição";
        let trend: "up" | "down" | "stable" = "stable";

        // Safe check for previous value
        if (prevValue !== null && prevValue !== undefined && !isNaN(prevValue)) {
            const diff = value - prevValue;
            // Avoid displaying minimal diffs or NaN
            if (!isNaN(diff)) {
                trend = diff > 0 ? "up" : diff < 0 ? "down" : "stable";
                const sign = diff > 0 ? "+" : "";
                detail = `${sign}${diff.toFixed(1)}${unit} vs anterior`;
            }
        }

        return {
            label,
            value: `${value}${unit}`,
            trend,
            detail,
            icon,
            color,
            bg,
        };
    };

    const metricsData = [
        buildMetric("Percentual de Gordura", latest?.body_fat_percent, "%", previous?.body_fat_percent, Droplet, "text-orange-500", "bg-orange-50 border-orange-100", true),
        buildMetric("Massa Muscular", latest?.muscle_mass_kg, " kg", previous?.muscle_mass_kg, Zap, "text-blue-500", "bg-blue-50 border-blue-100"),
        buildMetric("Água Corporal", latest?.body_water_percent, "%", previous?.body_water_percent, Droplet, "text-cyan-500", "bg-cyan-50 border-cyan-100"),
        buildMetric("IMC", latest?.bmi, "", previous?.bmi, Scale, "text-green-500", "bg-green-50 border-green-100", true),
        buildMetric("TMB", latest?.bmr_kcal, " kcal", previous?.bmr_kcal, Activity, "text-purple-500", "bg-purple-50 border-purple-100"),
        buildMetric("Peso Ósseo", latest?.bone_mass_kg, " kg", previous?.bone_mass_kg, Scale, "text-slate-500", "bg-slate-50 border-slate-200"),
    ];

    return (
        <div className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Análise de Bioimpedância</h1>
                    <p className="text-slate-500 mt-2">Visão detalhada da sua composição corporal</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <Scale className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Nenhuma medição encontrada</h3>
                        <p className="text-slate-500 mb-6">Registre sua primeira bioimpedância para acompanhar seu progresso.</p>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[var(--color-primary)]/30"
                        >
                            Registrar Medição
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {metricsData.map((m) => (
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
                                        {entries.map((row, i) => {
                                            const prev = entries[i + 1];
                                            let variation = "—";
                                            let color = "text-slate-400";

                                            if (prev && row.body_fat_percent !== null && prev.body_fat_percent !== null) {
                                                const diff = row.body_fat_percent - prev.body_fat_percent;
                                                const sign = diff > 0 ? "+" : "";
                                                variation = `${sign}${diff.toFixed(1)}% gordura`;
                                                color = diff < 0 ? "text-green-600" : diff > 0 ? "text-red-500" : "text-slate-500";
                                            }

                                            return (
                                                <tr key={row.date} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-3 px-4 font-medium text-slate-900">{formatDate(row.date)}</td>
                                                    <td className="py-3 px-4 text-slate-700">{row.body_fat_percent ?? "—"}%</td>
                                                    <td className="py-3 px-4 text-slate-700">{row.muscle_mass_kg ?? "—"} kg</td>
                                                    <td className={`py-3 px-4 font-medium ${color}`}>
                                                        {variation}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Modal */}
                {modalOpen && (
                    <LogMeasurementModal
                        onClose={() => setModalOpen(false)}
                        onSaved={() => {
                            setModalOpen(false);
                            fetchEntries();
                        }}
                    />
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Log Modal                                                          */
/* ------------------------------------------------------------------ */
function LogMeasurementModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [date, setDate] = useState(toDateStr(new Date()));
    const [weight, setWeight] = useState("");
    const [fat, setFat] = useState("");
    const [muscle, setMuscle] = useState("");
    const [water, setWater] = useState("");
    const [bmi, setBmi] = useState("");
    const [bmr, setBmr] = useState("");
    const [bone, setBone] = useState("");

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não autenticado");

            const payload = {
                user_id: user.id,
                date,
                weight_kg: weight ? Number(weight) : null,
                body_fat_percent: fat ? Number(fat) : null,
                muscle_mass_kg: muscle ? Number(muscle) : null,
                body_water_percent: water ? Number(water) : null,
                bmi: bmi ? Number(bmi) : null,
                bmr_kcal: bmr ? Number(bmr) : null,
                bone_mass_kg: bone ? Number(bone) : null,
            };

            const { error: upsertError } = await supabase
                .from("bioimpedance_entries")
                .upsert(payload, { onConflict: "user_id,date" });

            if (upsertError) throw upsertError;

            onSaved();
        } catch (err: any) {
            setError(err.message || "Erro ao salvar medição");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-bold text-slate-900">Registrar Medição</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Data *</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Peso (kg)" value={weight} onChange={setWeight} placeholder="70.5" />
                        <Input label="% Gordura" value={fat} onChange={setFat} placeholder="18.5" />
                        <Input label="Massa Muscular (kg)" value={muscle} onChange={setMuscle} placeholder="30.2" />
                        <Input label="% Água" value={water} onChange={setWater} placeholder="55.0" />
                        <Input label="IMC" value={bmi} onChange={setBmi} placeholder="22.1" />
                        <Input label="TMB (kcal)" value={bmr} onChange={setBmr} placeholder="1650" />
                        <Input label="Massa Óssea (kg)" value={bone} onChange={setBone} placeholder="3.1" />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 sticky bottom-0 bg-white z-10">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-bold rounded-lg shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Salvando..." : "Salvar Medição"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
                type="number"
                step="0.1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
        </div>
    );
}
