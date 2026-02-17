"use client";

import { Sparkles, Star, Flame, Clock, Heart, Search, ArrowRight, ChevronDown } from "lucide-react";

export default function RecipesPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
            {/* Hero Search */}
            <div className="max-w-3xl mx-auto mb-12 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">What are you <span className="text-[var(--color-primary)]">craving</span> today?</h1>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                    <div className="relative flex items-center bg-white rounded-xl shadow-lg border border-slate-100 p-2">
                        <div className="flex-shrink-0 pl-3 pr-2 text-[var(--color-primary)]">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <input className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-slate-400 text-slate-800 py-3 outline-none" placeholder="Describe a meal (e.g., 'High protein dinner under 500 cal')" type="text" />
                        <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold px-6 py-3 rounded-lg transition-all transform active:scale-95 flex items-center gap-2">
                            <span>Generate</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Quick Filter Chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {["🔥 Trending Now", "🥗 Post-Workout", "🥑 Keto Basics", "⏱️ Quick & Easy"].map(chip => (
                        <button key={chip} className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors">
                            {chip}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <RecipeCard title="Spicy AI Avocado & Egg Toast" rating={4.9} kcal={320} time="10 min" tags={["High Protein"]} protein={12} fat={15} carb={20} pctP={40} pctF={35} pctC={25} />
                <RecipeCard title="Zesty Lemon Herb Chicken" rating={4.7} kcal={450} time="25 min" tags={["Keto", "Low Carb"]} protein={45} fat={10} carb={5} pctP={65} pctF={25} pctC={10} />
                <RecipeCard title="Rainbow Power Bowl" rating={4.8} kcal={380} time="15 min" tags={["Vegan"]} protein={12} fat={14} carb={55} pctP={20} pctF={30} pctC={50} />
                <RecipeCard title="Ginger Glazed Salmon" rating={5.0} kcal={410} time="20 min" tags={["Omega-3", "Paleo"]} protein={35} fat={22} carb={8} pctP={45} pctF={45} pctC={10} />
                <RecipeCard title="Superfood Detox Salad" rating={4.6} kcal={180} time="5 min" tags={["Raw", "Low Cal"]} protein={5} fat={8} carb={22} pctP={15} pctF={20} pctC={65} />
                <RecipeCard title="Cauliflower Crust Pizza" rating={4.5} kcal={290} time="45 min" tags={["Cheat Meal"]} protein={18} fat={12} carb={28} pctP={25} pctF={35} pctC={40} />
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
                <button className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors shadow-sm">
                    Load More Recipes
                </button>
            </div>
        </div>
    );
}

function RecipeCard({ title, rating, kcal, time, tags, protein, fat, carb, pctP, pctF, pctC }: {
    title: string; rating: number; kcal: number; time: string; tags: string[];
    protein: number; fat: number; carb: number; pctP: number; pctF: number; pctC: number;
}) {
    const tagColors: Record<string, string> = {
        "High Protein": "text-[var(--color-primary)]",
        "Keto": "text-emerald-500",
        "Low Carb": "text-blue-500",
        "Vegan": "text-green-600",
        "Omega-3": "text-[var(--color-primary)]",
        "Paleo": "text-indigo-500",
        "Raw": "text-green-500",
        "Low Cal": "text-rose-500",
        "Cheat Meal": "text-purple-500",
    };

    return (
        <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group border border-slate-100">
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <span className="text-5xl">🍽️</span>
                <div className="absolute top-3 left-3 flex gap-2">
                    {tags.map(tag => (
                        <span key={tag} className={`px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold ${tagColors[tag] || "text-slate-600"}`}>{tag}</span>
                    ))}
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-white transition-colors">
                    <Heart className="w-4 h-4" />
                </button>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{title}</h3>
                    <span className="flex items-center text-sm font-medium text-amber-500">
                        <Star className="w-4 h-4 mr-1 fill-amber-500" />{rating}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1"><Flame className="w-4 h-4" /> {kcal} kcal</div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {time}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Macros Breakdown</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden w-full mb-2">
                        <div className="bg-[var(--color-primary)]" style={{ width: `${pctP}%` }} />
                        <div className="bg-amber-400" style={{ width: `${pctF}%` }} />
                        <div className="bg-blue-400" style={{ width: `${pctC}%` }} />
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700">{protein}g Protein</span>
                        <span className="text-slate-700">{fat}g Fat</span>
                        <span className="text-slate-700">{carb}g Carb</span>
                    </div>
                </div>
            </div>
        </article>
    );
}
