"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    Sun,
    Sunset,
    Moon,
    Cookie,
    Plus,
    PlusCircle,
    Trash2,
    Droplets,
    X,
    Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabaseClient";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface MealItem {
    id: string;
    meal_id: string;
    food_name: string;
    quantity: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface Meal {
    id: string;
    meal_type: MealType;
    items: MealItem[];
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

function formatDate(d: Date): string {
    const today = new Date();
    const isToday = toDateStr(d) === toDateStr(today);
    const month = d.toLocaleString("pt-BR", { month: "short" });
    const day = d.getDate();
    const weekday = d.toLocaleString("pt-BR", { weekday: "long" });
    return isToday ? `Hoje, ${month} ${day}` : `${month} ${day}`;
}

function getWeekday(d: Date): string {
    return d.toLocaleString("pt-BR", { weekday: "long" });
}

const MEAL_CONFIG: Record<
    MealType,
    { label: string; icon: React.ReactNode; iconBg: string }
> = {
    breakfast: {
        label: "Café da Manhã",
        icon: <Sun className="w-5 h-5" />,
        iconBg: "bg-orange-100 text-orange-600",
    },
    lunch: {
        label: "Almoço",
        icon: <Sunset className="w-5 h-5" />,
        iconBg: "bg-yellow-100 text-yellow-600",
    },
    dinner: {
        label: "Jantar",
        icon: <Moon className="w-5 h-5" />,
        iconBg: "bg-indigo-100 text-indigo-600",
    },
    snack: {
        label: "Lanches",
        icon: <Cookie className="w-5 h-5" />,
        iconBg: "bg-emerald-100 text-emerald-600",
    },
};

const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

/* Default nutrition goals */
const GOALS = { calories: 2200, protein: 140, carbs: 220, fat: 70 };

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function FoodDiaryPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>}>
            <FoodDiaryContent />
        </Suspense>
    );
}

function FoodDiaryContent() {
    const supabase = createClient();

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [meals, setMeals] = useState<Record<MealType, Meal | null>>({
        breakfast: null,
        lunch: null,
        dinner: null,
        snack: null,
    });
    const [loading, setLoading] = useState(true);
    const [waterMl, setWaterMl] = useState(0);

    /* Modal state */
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMealType, setModalMealType] = useState<MealType>("breakfast");
    const searchParams = useSearchParams();

    /* Listen for "open-log-meal" event from header button */
    useEffect(() => {
        const handler = () => {
            setModalMealType("breakfast");
            setModalOpen(true);
        };
        window.addEventListener("open-log-meal", handler);
        return () => window.removeEventListener("open-log-meal", handler);
    }, []);

    /* Open modal from query param ?logMeal=1 */
    useEffect(() => {
        if (searchParams.get("logMeal")) {
            setModalMealType("breakfast");
            setModalOpen(true);
        }
    }, [searchParams]);

    /* ---- Fetch meals for selected date ---- */
    const fetchMeals = useCallback(async () => {
        setLoading(true);
        const dateStr = toDateStr(selectedDate);

        /* Fetch Water */
        const { data: waterData } = await supabase
            .from("water_intake")
            .select("ml")
            .eq("date", dateStr)
            .maybeSingle();
        setWaterMl(waterData?.ml || 0);

        const { data: mealsData } = await supabase
            .from("meals")
            .select("id, meal_type")
            .eq("eaten_at", dateStr);

        const result: Record<MealType, Meal | null> = {
            breakfast: null,
            lunch: null,
            dinner: null,
            snack: null,
        };

        if (mealsData && mealsData.length > 0) {
            const mealIds = mealsData.map((m) => m.id);

            const { data: itemsData } = await supabase
                .from("meal_items")
                .select("id, meal_id, food_name, quantity, calories, protein, carbs, fat")
                .in("meal_id", mealIds);

            for (const m of mealsData) {
                const mt = m.meal_type as MealType;
                result[mt] = {
                    id: m.id,
                    meal_type: mt,
                    items: (itemsData || []).filter((it) => it.meal_id === m.id),
                };
            }
        }

        setMeals(result);
        setLoading(false);
    }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchMeals();
    }, [fetchMeals]);

    /* ---- Date nav ---- */
    const goDay = (delta: number) => {
        setSelectedDate((prev) => {
            const d = new Date(prev);
            d.setDate(d.getDate() + delta);
            return d;
        });
    };

    /* ---- Delete item ---- */
    const handleDelete = async (itemId: string, mealId: string, mealType: MealType) => {
        await supabase.from("meal_items").delete().eq("id", itemId);

        // Check if the meal still has items
        const { data: remaining } = await supabase
            .from("meal_items")
            .select("id")
            .eq("meal_id", mealId);

        if (!remaining || remaining.length === 0) {
            await supabase.from("meals").delete().eq("id", mealId);
        }

        fetchMeals();
    };

    /* ---- Add Water ---- */
    const handleAddWater = async () => {
        const nextMl = waterMl + 250;
        setWaterMl(nextMl);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const dateStr = toDateStr(selectedDate);
        const { error } = await supabase
            .from("water_intake")
            .upsert(
                { user_id: user.id, date: dateStr, ml: nextMl },
                { onConflict: "user_id,date" }
            );

        if (error) {
            console.error("Error saving water:", error);
            setWaterMl(waterMl); // Revert
        }
    };

    /* ---- Open modal ---- */
    const openModal = (mealType: MealType) => {
        setModalMealType(mealType);
        setModalOpen(true);
    };

    /* ---- Totals ---- */
    const allItems = MEAL_ORDER.flatMap((mt) => meals[mt]?.items || []);
    const totalCalories = allItems.reduce((s, i) => s + i.calories, 0);
    const totalProtein = allItems.reduce((s, i) => s + i.protein, 0);
    const totalCarbs = allItems.reduce((s, i) => s + i.carbs, 0);
    const totalFat = allItems.reduce((s, i) => s + i.fat, 0);
    const caloriesLeft = Math.max(0, GOALS.calories - totalCalories);

    return (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Date Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                    <button onClick={() => goDay(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-bold text-slate-900">{formatDate(selectedDate)}</h2>
                        <span className="text-xs text-slate-500 font-medium">{getWeekday(selectedDate)}</span>
                    </div>
                    <button onClick={() => goDay(1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                    <div className="text-center">
                        <span className="block text-xs text-slate-500 font-medium uppercase tracking-wide">Calorias</span>
                        <span className="block text-lg font-bold text-slate-800">
                            {totalCalories.toLocaleString()}{" "}
                            <span className="text-sm font-normal text-slate-400">/ {GOALS.calories.toLocaleString()}</span>
                        </span>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div className="text-center">
                        <span className="block text-xs text-slate-500 font-medium uppercase tracking-wide">Carb. Líq.</span>
                        <span className="block text-lg font-bold text-[var(--color-primary)]">{totalCarbs}g</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Food Diary */}
                    <div className="lg:col-span-2 space-y-6">
                        {MEAL_ORDER.map((mt) => {
                            const meal = meals[mt];
                            const cfg = MEAL_CONFIG[mt];
                            const mealKcal = (meal?.items || []).reduce((s, i) => s + i.calories, 0);

                            if (!meal || meal.items.length === 0) {
                                return (
                                    <div key={mt} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${cfg.iconBg}`}>{cfg.icon}</div>
                                                <h3 className="font-bold text-slate-800 text-lg">{cfg.label}</h3>
                                            </div>
                                            <span className="text-sm font-bold text-slate-400">0 kcal</span>
                                        </div>
                                        <div className="px-6 py-10 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <div className={`${cfg.iconBg} p-3 rounded-full`}>{cfg.icon}</div>
                                            </div>
                                            <p className="text-slate-500 font-medium mb-4">
                                                Você ainda não registrou {cfg.label.toLowerCase()}
                                            </p>
                                            <button
                                                onClick={() => openModal(mt)}
                                                className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" /> Registrar {cfg.label}
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <MealSection
                                    key={mt}
                                    icon={cfg.icon}
                                    title={cfg.label}
                                    kcal={`${mealKcal} kcal`}
                                    iconBg={cfg.iconBg}
                                    items={meal.items}
                                    onDelete={(itemId) => handleDelete(itemId, meal.id, mt)}
                                    onAddFood={() => openModal(mt)}
                                />
                            );
                        })}
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Daily Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Resumo Diário</h3>
                            <div className="flex flex-col items-center justify-center mb-8 relative">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle className="text-slate-100" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8" />
                                        <circle
                                            className="text-[var(--color-primary)]"
                                            cx="50"
                                            cy="50"
                                            fill="transparent"
                                            r="40"
                                            stroke="currentColor"
                                            strokeDasharray="251.2"
                                            strokeDashoffset={251.2 - (251.2 * Math.min(totalCalories / GOALS.calories, 1))}
                                            strokeLinecap="round"
                                            strokeWidth="8"
                                            style={{ transition: "stroke-dashoffset 0.5s ease" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-3xl font-bold text-slate-900">{caloriesLeft.toLocaleString()}</span>
                                        <span className="text-xs text-slate-500 font-medium uppercase mt-1">Restante</span>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-slate-500">
                                        {totalCalories.toLocaleString()} consumidas de {GOALS.calories.toLocaleString()} meta
                                    </p>
                                </div>
                            </div>
                            {/* Macro Bars */}
                            <div className="space-y-5">
                                <MacroBar label="Proteína" current={`${totalProtein}g`} goal={`${GOALS.protein}g`} pct={Math.min((totalProtein / GOALS.protein) * 100, 100)} color="bg-indigo-500" />
                                <MacroBar label="Carboidratos" current={`${totalCarbs}g`} goal={`${GOALS.carbs}g`} pct={Math.min((totalCarbs / GOALS.carbs) * 100, 100)} color="bg-emerald-500" />
                                <MacroBar label="Gordura" current={`${totalFat}g`} goal={`${GOALS.fat}g`} pct={Math.min((totalFat / GOALS.fat) * 100, 100)} color="bg-orange-500" />
                            </div>
                            <hr className="border-slate-100 my-6" />
                            {/* Water Tracker (static for now) */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-slate-800 text-sm">Ingestão de Água</h4>
                                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">Meta: 2500ml</span>
                                </div>
                                <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Droplets className="w-6 h-6 text-blue-500" />
                                        <span className="text-xl font-bold text-blue-900">
                                            {waterMl.toLocaleString()}
                                            <span className="text-sm font-normal text-blue-400">ml</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleAddWater}
                                        className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-sm shadow-blue-500/30"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex justify-between mt-3 px-1">
                                    {Array.from({ length: 8 }).map((_, i) => {
                                        const filled = i < Math.floor((waterMl / 2500) * 8);
                                        return (
                                            <div
                                                key={i}
                                                className={`w-2 h-6 rounded-full ${filled ? "bg-blue-400" : "bg-slate-200"
                                                    }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Log Meal Modal */}
            {modalOpen && (
                <LogMealModal
                    initialMealType={modalMealType}
                    selectedDate={selectedDate}
                    existingMeals={meals}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => {
                        setModalOpen(false);
                        fetchMeals();
                    }}
                />
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  MealSection                                                        */
/* ------------------------------------------------------------------ */
function MealSection({
    icon,
    title,
    kcal,
    iconBg,
    items,
    onDelete,
    onAddFood,
}: {
    icon: React.ReactNode;
    title: string;
    kcal: string;
    iconBg: string;
    items: MealItem[];
    onDelete: (id: string) => void;
    onAddFood: () => void;
}) {
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
                {items.map((item) => (
                    <div key={item.id} className="px-6 py-4 hover:bg-slate-50 transition-colors group flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-slate-900 font-medium text-sm">{item.food_name}</p>
                            <p className="text-slate-500 text-xs">{item.quantity || ""}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className="block text-sm font-bold text-slate-700">{item.calories}</span>
                                <span className="text-[10px] text-slate-400 font-medium">kcal</span>
                            </div>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="px-6 py-3 bg-slate-50/30">
                    <button
                        onClick={onAddFood}
                        className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <PlusCircle className="w-5 h-5" /> Adicionar Alimento
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  MacroBar                                                           */
/* ------------------------------------------------------------------ */
function MacroBar({ label, current, goal, pct, color }: { label: string; current: string; goal: string; pct: number; color: string }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-slate-500 text-xs font-medium">
                    <span className="text-slate-900 font-bold">{current}</span> / {goal}
                </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Log Meal Modal                                                     */
/* ------------------------------------------------------------------ */
function LogMealModal({
    initialMealType,
    selectedDate,
    existingMeals,
    onClose,
    onSaved,
}: {
    initialMealType: MealType;
    selectedDate: Date;
    existingMeals: Record<MealType, Meal | null>;
    onClose: () => void;
    onSaved: () => void;
}) {
    const supabase = createClient();

    const [mealType, setMealType] = useState<MealType>(initialMealType);
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!foodName.trim()) {
            setError("Nome do alimento é obrigatório");
            return;
        }
        if (!calories || Number(calories) < 0) {
            setError("Calorias é obrigatório");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;
            if (!userId) {
                setError("Você precisa estar logado");
                setSaving(false);
                return;
            }

            const dateStr = toDateStr(selectedDate);

            // Check if a meal row exists for this date + meal_type
            let mealId: string;
            const existing = existingMeals[mealType];

            if (existing) {
                mealId = existing.id;
            } else {
                // Create meal row
                const { data: newMeal, error: mealError } = await supabase
                    .from("meals")
                    .upsert(
                        { user_id: userId, meal_type: mealType, eaten_at: dateStr },
                        { onConflict: "user_id,meal_type,eaten_at" }
                    )
                    .select("id")
                    .single();

                if (mealError || !newMeal) {
                    setError(mealError?.message || "Falha ao criar refeição");
                    setSaving(false);
                    return;
                }
                mealId = newMeal.id;
            }

            // Insert item
            const { error: itemError } = await supabase.from("meal_items").insert({
                meal_id: mealId,
                user_id: userId,
                food_name: foodName.trim(),
                quantity: quantity.trim() || null,
                calories: Number(calories) || 0,
                protein: Number(protein) || 0,
                carbs: Number(carbs) || 0,
                fat: Number(fat) || 0,
            });

            if (itemError) {
                setError(itemError.message);
                setSaving(false);
                return;
            }

            onSaved();
        } catch {
            setError("Ocorreu um erro inesperado");
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Registrar Alimento</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Meal type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Refeição</label>
                        <select
                            value={mealType}
                            onChange={(e) => setMealType(e.target.value as MealType)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
                        >
                            <option value="breakfast">Café da Manhã</option>
                            <option value="lunch">Almoço</option>
                            <option value="dinner">Jantar</option>
                            <option value="snack">Lanche</option>
                        </select>
                    </div>

                    {/* Food name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do Alimento *</label>
                        <input
                            type="text"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            placeholder="Ex: Aveia com Mirtilo"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade</label>
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Ex: 1 tigela (250g)"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                    </div>

                    {/* Calories */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Calorias (kcal) *</label>
                        <input
                            type="number"
                            min="0"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            placeholder="350"
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        />
                    </div>

                    {/* Macros grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Proteína (g)</label>
                            <input
                                type="number"
                                min="0"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                placeholder="0"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Carboidratos (g)</label>
                            <input
                                type="number"
                                min="0"
                                value={carbs}
                                onChange={(e) => setCarbs(e.target.value)}
                                placeholder="0"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Gordura (g)</label>
                            <input
                                type="number"
                                min="0"
                                value={fat}
                                onChange={(e) => setFat(e.target.value)}
                                placeholder="0"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-bold rounded-lg shadow-lg shadow-[var(--color-primary)]/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {saving ? "Salvando..." : "Adicionar Alimento"}
                    </button>
                </div>
            </div>
        </div>
    );
}
