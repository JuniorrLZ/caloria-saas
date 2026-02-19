"use client";

import { useEffect, useState } from "react";
import { Sparkles, Star, Flame, Clock, Heart, ArrowRight, X, ChefHat, PlusCircle, Search, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

// Database Type complying with new schema
interface Recipe {
    id: string;
    user_id: string;
    title: string;
    description: string;
    tags: string[];
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    prep_time_minutes: number;
    ingredients: string[];
    instructions: string[];
    image_url: string;
    is_ai_generated: boolean;
    created_at: string;
}

export default function RecipesPage() {
    const supabase = createClient();
    const router = useRouter();

    // State
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    // Modal State
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [loggingMeal, setLoggingMeal] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchRecipes();
        fetchFavorites();
    }, []);

    const fetchRecipes = async () => {
        setLoading(true);
        // Fetch user's recipes
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching recipes:", error);
        } else {
            setRecipes(data || []);
        }
        setLoading(false);
    };

    const fetchFavorites = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("recipe_favorites")
            .select("recipe_id")
            .eq("user_id", user.id);

        if (data) {
            setFavoriteIds(new Set(data.map(f => f.recipe_id)));
        }
    };

    // Actions
    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setGenerating(true);
        try {
            // 1. Call Internal API for "Real AI" Generation
            const res = await fetch("/api/recipes/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt })
            });

            if (!res.ok) throw new Error("Failed to generate");
            const recipeData = await res.json();

            // 2. Save to Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not logged in");

            const { data, error } = await supabase
                .from("recipes")
                .insert({
                    user_id: user.id,
                    title: recipeData.title,
                    description: recipeData.description,
                    tags: recipeData.tags,
                    calories: recipeData.calories,
                    protein_g: recipeData.protein_g,
                    carbs_g: recipeData.carbs_g,
                    fat_g: recipeData.fat_g,
                    prep_time_minutes: recipeData.prep_time_minutes,
                    ingredients: recipeData.ingredients,
                    instructions: recipeData.instructions,
                    image_url: recipeData.image_url,
                    is_ai_generated: true,
                })
                .select()
                .single();

            if (error) throw error;

            // 3. Update State
            setRecipes([data, ...recipes]);
            setPrompt("");
        } catch (err) {
            console.error("Failed to generate:", err);
            alert("Erro ao gerar receita. Tente novamente.");
        } finally {
            setGenerating(false);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent, recipe: Recipe) => {
        e.stopPropagation();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isFav = favoriteIds.has(recipe.id);

        if (isFav) {
            // Remove
            const { error } = await supabase
                .from("recipe_favorites")
                .delete()
                .eq("user_id", user.id)
                .eq("recipe_id", recipe.id);

            if (!error) {
                const next = new Set(favoriteIds);
                next.delete(recipe.id);
                setFavoriteIds(next);
            }
        } else {
            // Add
            const { error } = await supabase
                .from("recipe_favorites")
                .insert({ user_id: user.id, recipe_id: recipe.id });

            if (!error) {
                const next = new Set(favoriteIds);
                next.add(recipe.id);
                setFavoriteIds(next);
            }
        }
    };

    const addToDiary = async () => {
        if (!selectedRecipe) return;
        setLoggingMeal(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user");

            const today = new Date().toISOString().split("T")[0];

            // 1. Find or create a default meal for today
            let mealId: string;
            const { data: meals } = await supabase
                .from("meals")
                .select("id")
                .eq("user_id", user.id)
                .eq("eaten_at", today)
                .limit(1);

            if (meals && meals.length > 0) {
                mealId = meals[0].id;
            } else {
                const { data: newMeal, error: mealError } = await supabase
                    .from("meals")
                    .insert({
                        user_id: user.id,
                        meal_type: "Almoço",
                        eaten_at: today
                    })
                    .select()
                    .single();

                if (mealError || !newMeal) throw mealError;
                mealId = newMeal.id;
            }

            // 2. Insert meal_item
            const { error: itemError } = await supabase
                .from("meal_items")
                .insert({
                    meal_id: mealId,
                    user_id: user.id,
                    food_name: selectedRecipe.title,
                    quantity: "1 porção",
                    calories: selectedRecipe.calories,
                    protein: selectedRecipe.protein_g,
                    carbs: selectedRecipe.carbs_g,
                    fat: selectedRecipe.fat_g
                });

            if (itemError) throw itemError;

            alert("Receita adicionada ao diário!");
            setSelectedRecipe(null);
            router.push("/food-diary");
        } catch (err) {
            console.error("Error logging meal:", err);
            alert("Erro ao adicionar ao diário.");
        } finally {
            setLoggingMeal(false);
        }
    };

    // Client-side Filtering
    const filteredRecipes = recipes.filter(r => {
        const matchesSearch = (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesFilter = activeFilter ? r.tags?.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())) : true;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 min-h-screen">
            {/* Hero & Generator */}
            <div className="max-w-3xl mx-auto mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                    O que você está <span className="text-[var(--color-primary)]">querendo</span> hoje?
                </h1>

                <div className="relative group mb-8">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                    <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-100 p-2">
                        <div className="flex-shrink-0 pl-3 pr-2 text-[var(--color-primary)]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-slate-400 text-slate-800 py-3 outline-none"
                            placeholder="Descreva uma refeição (ex: 'Jantar rico em proteína com menos de 500 cal')"
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !prompt.trim()}
                            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-lg transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Criando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Gerar</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {["Alta Proteína", "Baixo Carb", "Vegano", "Rápido"].map(chip => (
                            <button
                                key={chip}
                                onClick={() => setActiveFilter(activeFilter === chip ? null : chip)}
                                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${activeFilter === chip
                                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                                        : "bg-white border-slate-200 text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                    }`}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:border-blue-300 focus:ring focus:ring-blue-200 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Buscar receitas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
                </div>
            ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                    <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-900 mb-2">Nenhuma receita encontrada</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Tente ajustar seus filtros ou use nosso Gerador com IA para criar algo novo e delicioso!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredRecipes.map(recipe => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                            isFavorite={favoriteIds.has(recipe.id)}
                            onToggleFavorite={(e) => toggleFavorite(e, recipe)}
                            onClick={() => setSelectedRecipe(recipe)}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedRecipe && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Image */}
                        <div className="relative h-64 bg-slate-100 flex-shrink-0">
                            {selectedRecipe.image_url ? (
                                <img src={selectedRecipe.image_url} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                            )}
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedRecipe.title}</h2>
                                    <div className="flex gap-2 mb-4">
                                        {selectedRecipe.tags?.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => toggleFavorite(e as any, selectedRecipe)}
                                    className={`p-2 rounded-full transition-colors ${favoriteIds.has(selectedRecipe.id) ? "text-red-500 bg-red-50" : "text-slate-400 hover:text-red-500 hover:bg-slate-50"}`}
                                >
                                    <Heart className={`w-6 h-6 ${favoriteIds.has(selectedRecipe.id) ? "fill-current" : ""}`} />
                                </button>
                            </div>

                            <p className="text-slate-600 mb-8 leading-relaxed">
                                {selectedRecipe.description}
                            </p>

                            <div className="grid grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-xl">
                                <div className="text-center">
                                    <div className="text-xs text-slate-500 mb-1">Calorias</div>
                                    <div className="font-bold text-slate-900">{selectedRecipe.calories}</div>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <div className="text-xs text-slate-500 mb-1">Proteína</div>
                                    <div className="font-bold text-slate-900">{selectedRecipe.protein_g}g</div>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <div className="text-xs text-slate-500 mb-1">Carb</div>
                                    <div className="font-bold text-slate-900">{selectedRecipe.carbs_g}g</div>
                                </div>
                                <div className="text-center border-l border-slate-200">
                                    <div className="text-xs text-slate-500 mb-1">Gordura</div>
                                    <div className="font-bold text-slate-900">{selectedRecipe.fat_g}g</div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-[var(--color-primary)] rounded-full" /> Ingredientes
                                    </h3>
                                    <ul className="space-y-3">
                                        {selectedRecipe.ingredients?.map((ing: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                                                <span>{ing}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-amber-500 rounded-full" /> Modo de Preparo
                                    </h3>
                                    <div className="space-y-6">
                                        {selectedRecipe.instructions?.map((step: string, i: number) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm">
                                                    {i + 1}
                                                </div>
                                                <p className="text-slate-700 mt-1 leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedRecipe(null)}
                                className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={addToDiary}
                                disabled={loggingMeal}
                                className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold rounded-xl shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2"
                            >
                                {loggingMeal ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                                Adicionar ao Diário
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RecipeCard({ recipe, isFavorite, onToggleFavorite, onClick }: {
    recipe: Recipe;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onClick: () => void;
}) {
    // Calculando porcentagens relativas para barra de macros visual
    const total = recipe.protein_g + recipe.fat_g + recipe.carbs_g || 1;
    const pP = (recipe.protein_g / total) * 100;
    const pF = (recipe.fat_g / total) * 100;
    const pC = (recipe.carbs_g / total) * 100;

    return (
        <article
            onClick={onClick}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col h-full"
        >
            <div className="relative h-52 overflow-hidden bg-slate-100">
                {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                )}

                <div className="absolute top-3 left-3 flex flex-wrap gap-2 pr-12">
                    {recipe.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold text-slate-700 shadow-sm">
                            {tag}
                        </span>
                    ))}
                    {recipe.is_ai_generated && (
                        <span className="px-2.5 py-1 bg-blue-500/90 backdrop-blur-md rounded-lg text-xs font-bold text-white shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> IA
                        </span>
                    )}
                </div>

                <button
                    onClick={onToggleFavorite}
                    className={`absolute top-3 right-3 p-2 backdrop-blur-md rounded-full transition-colors shadow-sm ${isFavorite ? "bg-white text-red-500" : "bg-white/30 text-white hover:bg-white hover:text-red-500"
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </button>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900 leading-snug line-clamp-2">{recipe.title}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4 uppercase tracking-wide">
                    <div className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> {recipe.calories} KCAL</div>
                    {recipe.prep_time_minutes > 0 && (
                        <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {recipe.prep_time_minutes} MIN</div>
                    )}
                </div>

                <div className="mt-auto bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex h-1.5 rounded-full overflow-hidden w-full mb-3 bg-slate-200">
                        <div className="bg-[var(--color-primary)]" style={{ width: `${pP}%` }} />
                        <div className="bg-amber-400" style={{ width: `${pF}%` }} />
                        <div className="bg-blue-400" style={{ width: `${pC}%` }} />
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{recipe.protein_g}g Prot</span>
                        <span className="text-slate-700">{recipe.fat_g}g Gord</span>
                        <span className="text-slate-700">{recipe.carbs_g}g Carb</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
