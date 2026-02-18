"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Calendar, Sparkles, ArrowRight, ChevronRight, TrendingDown, TrendingUp, Minus, Activity, Dumbbell, Utensils } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Period = "week" | "month" | "year";

type DailyData = {
    date: string;
    calories: number;
    protein: number;
    weight: number | null;
    hasWeight: boolean;
    hasBio: boolean;
    hasMeals: boolean;
};

type Insight = {
    title: string;
    summary: string;
    suggestion: string;
    score: "good" | "neutral" | "bad";
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const getStartDate = (period: Period): Date => {
    const now = new Date();
    const d = new Date(now);
    if (period === "week") d.setDate(d.getDate() - 7);
    if (period === "month") d.setMonth(d.getMonth() - 1);
    if (period === "year") d.setFullYear(d.getFullYear() - 1);
    return d;
};

const generateDates = (start: Date, end: Date) => {
    const dates = [];
    let current = new Date(start);
    while (current <= end) {
        dates.push(formatDate(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

export default function ProgressPage() {
    const supabase = createClient();
    const [period, setPeriod] = useState<Period>("month");
    const [loading, setLoading] = useState(true);
    const [calorieGoal, setCalorieGoal] = useState(2200); // Default
    const [data, setData] = useState<DailyData[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        // 1. Fetch Profile (for goals)
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) {
            setUserProfile(profile);
            // Assuming profile might have daily_calories_target or similar in future, 
            // for now sticking to 2200 as requested or parsing from metadata if it existed.
            // Using 2200 as default per prompt.
        }

        const endDate = new Date();
        const startDate = getStartDate(period);
        const startStr = formatDate(startDate);

        // 2. Fetch Weight Entries
        const { data: weightData } = await supabase
            .from("weight_entries")
            .select("date, weight_kg")
            .gte("date", startStr)
            .lte("date", formatDate(endDate))
            .eq("user_id", user.id)
            .order("date", { ascending: true });

        // 3. Fetch Bioimpedance (as potential weight source)
        const { data: bioData } = await supabase
            .from("bioimpedance_entries")
            .select("date, weight_kg")
            .gte("date", startStr)
            .lte("date", formatDate(endDate))
            .eq("user_id", user.id)
            .order("date", { ascending: true });

        // 4. Fetch Meal Items (joined with meals for date)
        // Note: meal_items has specific macro info. meals has the date.
        // Complex query: Select meal_items -> meal_id -> meals(date).
        // Using two steps for simplicity.
        const { data: mealsData } = await supabase
            .from("meals")
            .select("id, eaten_at")
            .gte("eaten_at", startStr)
            .lte("eaten_at", formatDate(endDate))
            .eq("user_id", user.id);

        let mealItemsData: any[] = [];
        if (mealsData && mealsData.length > 0) {
            const mealIds = mealsData.map(m => m.id);
            const { data: items } = await supabase
                .from("meal_items")
                .select("meal_id, calories, protein")
                .in("meal_id", mealIds);
            mealItemsData = items || [];
        }

        // 5. Process & Merge Data
        const dates = generateDates(startDate, endDate);
        const processed: DailyData[] = dates.map(dateStr => {
            // Meals for this date
            const daysMealIds = mealsData?.filter(m => m.eaten_at === dateStr).map(m => m.id) || [];
            const daysItems = mealItemsData.filter(i => daysMealIds.includes(i.meal_id));

            const totalCals = daysItems.reduce((acc, curr) => acc + (curr.calories || 0), 0);
            const totalProt = daysItems.reduce((acc, curr) => acc + (curr.protein || 0), 0);

            // Weight for this date (Priority: weight_entries > bioimpedance)
            const wEntry = weightData?.find(w => w.date === dateStr);
            const bEntry = bioData?.find(b => b.date === dateStr);
            const weight = wEntry?.weight_kg || bEntry?.weight_kg || null;

            return {
                date: dateStr,
                calories: totalCals,
                protein: totalProt,
                weight: weight,
                hasWeight: !!weight,
                hasBio: !!bEntry,
                hasMeals: daysMealIds.length > 0
            };
        });

        setData(processed);
        setLoading(false);
    }, [period, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const stats = useMemo(() => {
        const daysWithMeals = data.filter(d => d.hasMeals);
        const daysWithWeight = data.filter(d => d.hasWeight);

        const avgCals = daysWithMeals.length ? Math.round(daysWithMeals.reduce((a, b) => a + b.calories, 0) / daysWithMeals.length) : 0;
        const avgProt = daysWithMeals.length ? Math.round(daysWithMeals.reduce((a, b) => a + b.protein, 0) / daysWithMeals.length) : 0;
        const avgWeight = daysWithWeight.length ? (daysWithWeight.reduce((a, b) => a + (b.weight || 0), 0) / daysWithWeight.length).toFixed(1) : "—";

        // Calculate change (mocking previous period comparison for now roughly or simple logic)
        // Real comparison would require fetching previous period data. 
        // For this MVP, we will leave "vs anterior" as static or simpler placeholder if not strictly required to calc accurately.
        // Prompt says "Peso médio: baseado em weight_entries no período".

        return { avgCals, avgProt, avgWeight };
    }, [data]);

    const insight = useMemo((): Insight => {
        if (data.every(d => !d.hasMeals && !d.hasWeight)) {
            return {
                title: "Comece sua jornada",
                summary: "Ainda não temos dados suficientes para gerar insights personalizados.",
                suggestion: "Que tal registrar sua primeira refeição ou peso hoje?",
                score: "neutral"
            };
        }

        const validDays = data.filter(d => d.hasMeals);
        if (validDays.length === 0) return { title: "Falta dados de alimentação", summary: "Registre suas refeições para receber insights.", suggestion: "Comece registrando o almoço de hoje.", score: "neutral" };

        // Simple Rules
        const avgProt = stats.avgProt;
        // Assuming goal is roughly 2g/kg or just general. Let's say generic goal 150g or based on cal goal.
        // If cal goal 2200, maybe ~160g protein.
        const proteinGoal = 140;

        if (avgProt < proteinGoal * 0.7) {
            return {
                title: "Aumente a proteína",
                summary: `Sua média de ${avgProt}g está abaixo do ideal para manutenção muscular.`,
                suggestion: "Tente incluir ovos, frango ou iogurte no café da manhã.",
                score: "bad"
            };
        }

        const weekendSpikes = data.some(d => {
            const date = new Date(d.date);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            return isWeekend && d.calories > calorieGoal * 1.3;
        });

        if (weekendSpikes) {
            return {
                title: "Atenção aos fins de semana",
                summary: "Notamos um aumento calórico significativo nos sábados ou domingos.",
                suggestion: "Planeje uma refeição livre em vez de um dia inteiro livre.",
                score: "neutral"
            };
        }

        return {
            title: "Ótimo ritmo!",
            summary: "Você tem mantido uma boa consistência nos registros e macros.",
            suggestion: "Continue assim! Se o peso estagnar, ajuste levemente as calorias.",
            score: "good"
        };
    }, [data, stats, calorieGoal]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <span>Relatórios</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-[var(--color-primary)] font-medium">Tendências de Longo Prazo</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Consistência &amp; Progresso</h1>
                    <p className="text-slate-500 mt-1 max-w-2xl">Visualizando sua aderência às metas nutricionais e tendências de peso.</p>
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    {(["year", "month", "week"] as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${period === p ? "bg-slate-100 text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"}`}
                        >
                            {p === "year" ? "Ano" : p === "month" ? "Mês" : "Semana"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-8">
                    <div className="h-64 bg-slate-100 rounded-xl" />
                    <div className="grid grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl" />)}
                    </div>
                </div>
            ) : (
                <>
                    {/* Heatmap Section */}
                    <Heatmap data={data} calorieGoal={calorieGoal} />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard label="Peso Médio" value={stats.avgWeight} unit="kg" icon={<Activity className="w-4 h-4" />} />
                        <StatCard label="Ingestão Média" value={stats.avgCals.toString()} unit="kcal" icon={<Utensils className="w-4 h-4" />} />
                        <StatCard label="Proteína Média" value={stats.avgProt.toString()} unit="g" icon={<Dumbbell className="w-4 h-4" />} />
                        <StatCard label="Treinos" value="Em breve" unit="" icon={<TrendingUp className="w-4 h-4" />} />
                    </div>

                    {/* Lower Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Trend Chart */}
                        <WeightChart data={data} meta={null} /> {/* Passing null for meta as strict requirement "se não existir, não mostrar" */}

                        {/* AI Insights */}
                        <InsightCard insight={insight} />
                    </div>
                </>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Heatmap({ data, calorieGoal }: { data: DailyData[]; calorieGoal: number }) {
    // Generate full grid. For simplicity, we just show the fetched data range or a fixed grid.
    // The previous design had a horizontal scroll. Let's try to map the fetched period to a visual grid.

    const getStatus = (d: DailyData) => {
        if (!d.hasMeals && !d.hasWeight && !d.hasBio) return "empty"; // Sem Registro
        if (!d.hasMeals) return "near"; // Tracked something else: "Perto" (Consistency)

        const ratio = d.calories / calorieGoal;
        if (ratio >= 0.9 && ratio <= 1.1) return "perfect";
        if (ratio >= 0.8 && ratio <= 1.2) return "near";
        return "off";
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                    Mapa de Aderência às Metas
                </h2>
                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200" /> Sem Registro</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" /> Fora</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-200 border border-blue-300" /> Perto</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[var(--color-primary)] border border-blue-600" /> Perfeito</div>
                </div>
            </div>
            {/* Heatmap Grid - Simple flex wrap for responsiveness */}
            <div className="flex flex-wrap gap-1">
                {data.map((day) => {
                    const status = getStatus(day);
                    let colorClass = "bg-slate-100 border-slate-200";
                    if (status === "perfect") colorClass = "bg-[var(--color-primary)] border-blue-600";
                    if (status === "near") colorClass = "bg-blue-200 border-blue-300";
                    if (status === "off") colorClass = "bg-red-100 border-red-200";

                    return (
                        <div
                            key={day.date}
                            title={`${day.date}: ${day.calories} kcal`}
                            className={`w-4 h-4 sm:w-6 sm:h-6 rounded-sm border ${colorClass} transition-all hover:scale-110 cursor-default`}
                        />
                    );
                })}
                {data.length === 0 && <div className="text-slate-400 text-sm py-4">Nenhum dado neste período.</div>}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-slate-400 text-xs">Mostrando {data.length} dias</div>
            </div>
        </div>
    );
}

function StatCard({ label, value, unit, icon }: { label: string; value: string; unit: string; icon: any }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-[var(--color-primary)]/50 transition-colors group">
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10 transition-colors">
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{value} <span className="text-sm font-normal text-slate-400">{unit}</span></h3>
        </div>
    );
}

function WeightChart({ data, meta }: { data: DailyData[]; meta: number | null }) {
    // Determine min/max for scaling
    const weights = data.filter(d => d.weight !== null).map(d => d.weight!);
    const hasData = weights.length > 0;

    // Simple SVG Line Chart Generation
    const width = 800;
    const height = 300;
    const padding = 40;

    let pathD = "";

    if (hasData) {
        const minW = Math.min(...weights) - 1;
        const maxW = Math.max(...weights) + 1;
        const range = maxW - minW || 1;

        // Filter only points with weight
        const points = data.map((d, i) => {
            if (d.weight === null) return null;
            const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
            const y = height - padding - ((d.weight - minW) / range) * (height - padding * 2);
            return { x, y, val: d.weight };
        }).filter(Boolean) as { x: number; y: number; val: number }[];

        if (points.length > 0) {
            pathD = `M ${points[0].x} ${points[0].y} ` + points.map(p => `L ${p.x} ${p.y}`).join(" ");
        }
    }

    return (
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900">Histórico de Peso</h3>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" /> Real (kg)</span>
                    {meta && <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-300" /> Meta</span>}
                </div>
            </div>

            {hasData ? (
                <div className="relative w-full aspect-[2/1] bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                    <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                        {/* Grid Lines (Optional, skipped for simplicity) */}
                        <path d={pathD} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Dots */}
                        {/* We can re-calculate points here or just trust the path. For dots to hover, we need interaction, keeping it static for MVP */}
                    </svg>
                    <div className="absolute bottom-2 right-4 text-xs text-slate-400">
                        Último: {weights[weights.length - 1]} kg
                    </div>
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400">
                    <Activity className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Nenhum registro de peso neste período</p>
                </div>
            )}
        </div>
    );
}

function InsightCard({ insight }: { insight: Insight }) {
    return (
        <div className="bg-gradient-to-b from-[var(--color-primary)]/5 to-white rounded-xl border border-[var(--color-primary)]/20 p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="font-bold text-slate-900">Insights de IA</h3>
            </div>

            <div className="space-y-4 flex-1">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                    <h4 className={`text-sm font-bold mb-1 ${insight.score === "good" ? "text-green-600" : insight.score === "bad" ? "text-red-500" : "text-blue-600"}`}>
                        {insight.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {insight.summary}
                    </p>
                </div>

                <div className="p-4 bg-[var(--color-primary)]/5 rounded-lg border border-[var(--color-primary)]/10">
                    <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Sugestão Prática
                    </h4>
                    <p className="text-sm text-slate-700 font-medium">
                        {insight.suggestion}
                    </p>
                </div>
            </div>
        </div>
    );
}
