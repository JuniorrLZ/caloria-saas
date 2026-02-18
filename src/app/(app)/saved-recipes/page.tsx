"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import {
    Bookmark,
    Loader2,
    ChefHat,
    Trash2,
    ArrowLeft,
    Clock,
    Flame,
    ExternalLink
} from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type SavedRecipe = {
    id: string; // ID from saved_recipes table
    post_id: string;
    created_at: string;
    post: {
        id: string;
        content: string;
        image_url: string | null;
        type: "text" | "recipe" | "progress";
        created_at: string;
        author?: {
            full_name: string | null;
            avatar_url: string | null;
        };
    };
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function SavedRecipesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" /></div>}>
            <SavedRecipesContent />
        </Suspense>
    );
}

function SavedRecipesContent() {
    const supabase = createClient();
    const router = useRouter();
    const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedRecipes = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        // Fetch saved recipes and join with posts info
        const { data, error } = await supabase
            .from("saved_recipes")
            .select(`
                id,
                post_id,
                created_at,
                post:posts (
                    id,
                    content,
                    image_url,
                    type,
                    created_at,
                    user_id
                )
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching saved recipes:", error);
            setLoading(false);
            return;
        }

        if (data) {
            // Need to fetch author profiles manually if we want names
            // Extract post author IDs
            const authorIds = Array.from(new Set(data.map((item: any) => item.post?.user_id).filter(Boolean)));

            let profilesMap = new Map();
            if (authorIds.length > 0) {
                const { data: profiles } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", authorIds);
                if (profiles) {
                    profilesMap = new Map(profiles.map((p) => [p.id, p]));
                }
            }

            const formattedData = data.map((item: any) => ({
                ...item,
                post: {
                    ...item.post,
                    author: profilesMap.get(item.post.user_id)
                }
            })).filter((item: any) => item.post.type === "recipe"); // Ensure we only show actual recipes if mixed types are saved, though UI only allows recipes currently.

            setRecipes(formattedData);
        }
        setLoading(false);
    }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchSavedRecipes();
    }, [fetchSavedRecipes]);

    const handleRemove = async (savedId: string) => {
        // Optimistic update
        const previousRecipes = [...recipes];
        setRecipes(recipes.filter(r => r.id !== savedId));

        const { error } = await supabase
            .from("saved_recipes")
            .delete()
            .eq("id", savedId);

        if (error) {
            console.error("Error removing recipe:", error);
            alert("Erro ao remover receita.");
            setRecipes(previousRecipes); // Revert
        } else {
            // Optional: Toast "Receita removida!"
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/community" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Receitas Salvas</h1>
                    <p className="text-slate-500">Sua coleção pessoal de receitas da comunidade</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ChefHat className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Nenhuma receita salva</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">Explore a comunidade para encontrar e salvar receitas deliciosas compartilhadas por outros membros.</p>
                    <Link
                        href="/community"
                        className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[var(--color-primary)]/30"
                    >
                        Explorar Comunidade
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((saved) => (
                        <div key={saved.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col group hover:shadow-md transition-shadow">
                            <div className="relative aspect-video bg-slate-100">
                                {saved.post.image_url ? (
                                    <img src={saved.post.image_url} alt="Recipe" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-300">
                                        <ChefHat className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleRemove(saved.id)}
                                        className="bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                                        title="Remover dos salvos"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
                                    <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                        {saved.post.author?.avatar_url ? (
                                            <img src={saved.post.author.avatar_url} alt="Av" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-600 font-bold text-[10px]">
                                                {(saved.post.author?.full_name?.[0] || "?")}
                                            </div>
                                        )}
                                    </div>
                                    <span className="truncate">{saved.post.author?.full_name || "Desconhecido"}</span>
                                    <span>•</span>
                                    <span>{new Date(saved.created_at).toLocaleDateString("pt-BR")}</span>
                                </div>

                                <p className="text-slate-900 font-medium line-clamp-2 mb-4 flex-1">
                                    {saved.post.content}
                                </p>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                                    <div className="flex gap-3 text-xs font-semibold text-slate-500">
                                        {/* Placeholders for visual consistency since we don't extract macros yet from content */}
                                        <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> Receita</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
