"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
    Users,
    Heart,
    MessageCircle,
    Share2,
    Camera,
    ChefHat,
    Bookmark,
    Rocket,
    MoreHorizontal,
    Quote,
    Loader2,
    Send,
    X,
    Image as ImageIcon,
    Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Profile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null; // Fallback
};

type Post = {
    id: string;
    user_id: string;
    type: "text" | "recipe" | "progress";
    content: string;
    image_url: string | null;
    created_at: string;
    // Client-side joined data
    author?: Profile;
    likes_count?: number;
    comments_count?: number;
    user_has_liked?: boolean;
    user_has_saved?: boolean;
};

type Comment = {
    id: string;
    post_id: string;
    user_id: string;
    comment: string;
    created_at: string;
    author?: Profile;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function timeAgo(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos atrás";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses atrás";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias atrás";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h atrás";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m atrás";
    return "agora mesmo";
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */
export default function CommunityPage() {
    const supabase = createClient();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);

    // New Post State
    const [newPostContent, setNewPostContent] = useState("");
    const [newPostType, setNewPostType] = useState<"text" | "recipe" | "progress">("text");
    const [newPostImage, setNewPostImage] = useState<File | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        // 1. Get Current User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }
        setCurrentUser(user);

        // 2. Get User Profile
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (profile) setUserProfile(profile);

        // 3. Fetch Posts
        const { data: rawPosts, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
            return;
        }

        if (!rawPosts) {
            setPosts([]);
            setLoading(false);
            return;
        }

        // 4. Enrich Posts (Authors + Likes + Comments + Saved)
        const userIds = Array.from(new Set(rawPosts.map((p) => p.user_id)));
        let profilesMap = new Map();

        if (userIds.length > 0) {
            const { data: profiles } = await supabase.from("profiles").select("*").in("id", userIds);
            if (profiles) {
                profilesMap = new Map(profiles.map((p) => [p.id, p]));
            }
        }

        const postIds = rawPosts.map(p => p.id);

        // Optimized fetching: only for these posts
        const [
            { data: allLikes },
            { data: allComments },
            { data: userLikes },
            { data: userSaved }
        ] = await Promise.all([
            // Fetch likes only for these posts
            postIds.length > 0 ? supabase.from("post_likes").select("post_id").in("post_id", postIds) : { data: [] },
            // Fetch comments count only for these posts
            postIds.length > 0 ? supabase.from("post_comments").select("post_id").in("post_id", postIds) : { data: [] },
            // Fetch user specific interactions
            postIds.length > 0 ? supabase.from("post_likes").select("post_id").eq("user_id", user.id).in("post_id", postIds) : { data: [] },
            postIds.length > 0 ? supabase.from("saved_recipes").select("post_id").eq("user_id", user.id).in("post_id", postIds) : { data: [] }
        ]);

        const enrichedPosts = rawPosts.map((post) => {
            const author = profilesMap.get(post.user_id) || {
                id: post.user_id,
                full_name: "Usuário",
                avatar_url: null,
                email: null
            };

            const likesCount = allLikes?.filter(l => l.post_id === post.id).length || 0;
            const commentsCount = allComments?.filter(c => c.post_id === post.id).length || 0;
            const userHasLiked = userLikes?.some(l => l.post_id === post.id) || false;
            const userHasSaved = userSaved?.some(s => s.post_id === post.id) || false;

            return {
                ...post,
                author: author as Profile,
                likes_count: likesCount,
                comments_count: commentsCount,
                user_has_liked: userHasLiked,
                user_has_saved: userHasSaved
            };
        });

        setPosts(enrichedPosts);
        setLoading(false);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreatePost = async () => {
        if (!newPostContent.trim() && !newPostImage) return;
        if (!currentUser) return;

        setIsPosting(true);

        try {
            let imageUrl = null;
            if (newPostImage) {
                const fileExt = newPostImage.name.split(".").pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const { error: uploadError, data } = await supabase.storage
                    .from("community")
                    .upload(fileName, newPostImage);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage.from("community").getPublicUrl(fileName);
                imageUrl = publicUrl;
            }

            const { error } = await supabase.from("posts").insert({
                user_id: currentUser.id,
                content: newPostContent,
                type: newPostType,
                image_url: imageUrl,
            });

            if (error) throw error;

            setNewPostContent("");
            setNewPostImage(null);
            setNewPostType("text");
            // Refresh feed
            fetchData();

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Erro ao criar post");
        } finally {
            setIsPosting(false);
        }
    };

    const toggleLike = async (post: Post) => {
        if (!currentUser) return;

        // Optimistic update
        const isLiked = post.user_has_liked;
        const newPosts = posts.map(p => {
            if (p.id === post.id) {
                return {
                    ...p,
                    user_has_liked: !isLiked,
                    likes_count: (p.likes_count || 0) + (isLiked ? -1 : 1)
                };
            }
            return p;
        });
        setPosts(newPosts);

        try {
            if (isLiked) {
                await supabase.from("post_likes").delete().match({ post_id: post.id, user_id: currentUser.id });
            } else {
                await supabase.from("post_likes").insert({ post_id: post.id, user_id: currentUser.id });
            }
        } catch (err) {
            console.error("Error toggling like", err);
            // Revert on error? For now simple console log
        }
    };

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const toggleSave = async (post: Post) => {
        if (!currentUser) return;

        const isSaved = post.user_has_saved;
        const newPosts = posts.map(p => {
            if (p.id === post.id) {
                return {
                    ...p,
                    user_has_saved: !isSaved,
                };
            }
            return p;
        });
        setPosts(newPosts);

        try {
            if (isSaved) {
                await supabase.from("saved_recipes").delete().match({ post_id: post.id, user_id: currentUser.id });
                showToast("Receita removida!");
            } else {
                await supabase.from("saved_recipes").insert({ post_id: post.id, user_id: currentUser.id });
                showToast("Receita salva!");
            }
        } catch (err) {
            console.error("Error toggling save", err);
            showToast("Erro ao salvar.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 relative">
            {toastMessage && (
                <div className="fixed top-20 right-5 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                    {toastMessage}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6">
                    {/* User Mini Stats */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        {userProfile ? (
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-lg overflow-hidden">
                                    {userProfile.avatar_url ? (
                                        <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        (userProfile.full_name?.[0] || currentUser?.email?.[0] || "U").toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 truncate max-w-[150px]">{userProfile.full_name || currentUser?.email}</h3>
                                    <p className="text-xs text-slate-500 font-medium">Membro da Comunidade</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-12 bg-slate-100 animate-pulse rounded-full mb-4 w-12" />
                        )}
                        <div className="flex justify-between items-center text-center divide-x divide-slate-100">
                            <div className="px-2 w-1/3"><div className="text-xl font-bold text-[var(--color-primary)]">--</div><div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Sequência</div></div>
                            <div className="px-2 w-1/3"><div className="text-xl font-bold text-[var(--color-primary)]">--</div><div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Pontos</div></div>
                            <div className="px-2 w-1/3"><div className="text-xl font-bold text-[var(--color-primary)]">--</div><div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Insígnias</div></div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                        <nav className="space-y-1">
                            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg font-semibold transition-colors">
                                <Users className="w-5 h-5" /> Feed
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                                <Heart className="w-5 h-5" /> Meus Desafios
                            </button>
                            <a href="/saved-recipes" className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                                <Bookmark className="w-5 h-5" /> Receitas Salvas
                            </a>
                        </nav>
                    </div>

                    {/* Daily Quote */}
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                        <Quote className="absolute top-2 right-2 w-16 h-16 text-white/20" />
                        <p className="font-medium relative z-10 italic">&quot;O único treino ruim é aquele que não aconteceu.&quot;</p>
                        <div className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-100 relative z-10">Motivação Diária</div>
                    </div>
                </aside>

                {/* Center Column (Feed) */}
                <section className="col-span-1 lg:col-span-6 space-y-6">
                    {/* Create Post */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-[var(--color-primary)]/20">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold shrink-0 overflow-hidden">
                                {userProfile?.avatar_url ? (
                                    <img src={userProfile.avatar_url} alt="Me" className="w-full h-full object-cover" />
                                ) : (
                                    (userProfile?.full_name?.[0] || currentUser?.email?.[0] || "U").toUpperCase()
                                )}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Compartilhe seu progresso ou uma nova receita..."
                                    className="w-full bg-slate-50 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none resize-none min-h-[50px]"
                                    rows={newPostContent ? 3 : 1}
                                />
                                {newPostImage && (
                                    <div className="mt-2 relative inline-block">
                                        <img src={URL.createObjectURL(newPostImage)} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-200" />
                                        <button
                                            onClick={() => setNewPostImage(null)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-between mt-3 pt-3 border-t border-slate-100 items-center">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-500 text-sm font-medium transition-colors"
                                >
                                    <Camera className="w-4 h-4 text-green-500" /> <span className="hidden sm:inline">Foto</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && setNewPostImage(e.target.files[0])}
                                />

                                <button
                                    onClick={() => setNewPostType(newPostType === "recipe" ? "text" : "recipe")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${newPostType === "recipe" ? "bg-orange-50 text-orange-600" : "hover:bg-slate-50 text-slate-500"}`}
                                >
                                    <ChefHat className="w-4 h-4 text-orange-500" /> <span className="hidden sm:inline">Receita</span>
                                </button>
                                <button
                                    onClick={() => setNewPostType(newPostType === "progress" ? "text" : "progress")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${newPostType === "progress" ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-500"}`}
                                >
                                    <Rocket className="w-4 h-4 text-blue-500" /> <span className="hidden sm:inline">Progresso</span>
                                </button>
                            </div>
                            <button
                                onClick={handleCreatePost}
                                disabled={isPosting || (!newPostContent.trim() && !newPostImage)}
                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-[var(--color-primary)]/30 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isPosting && <Loader2 className="w-3 h-3 animate-spin" />}
                                Publicar
                            </button>
                        </div>
                    </div>

                    {/* Feed Loading & Items */}
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            Seja o primeiro a postar!
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                onLike={() => toggleLike(post)}
                                onSave={() => toggleSave(post)}
                                onDelete={() => {
                                    setPosts(posts.filter((p) => p.id !== post.id));
                                    showToast("Post apagado com sucesso!");
                                }}
                                supabase={supabase}
                                currentUser={currentUser}
                                showToast={showToast}
                            />
                        ))
                    )}
                </section>

                {/* Right Column */}
                <aside className="col-span-1 lg:col-span-3 space-y-6">
                    {/* Active Challenge Card (Placeholder) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden opacity-75">
                        {/* Hidden functionality - Placeholder */}
                        <div className="relative h-24 bg-[var(--color-primary)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-4 text-white">
                                <h3 className="font-bold text-lg">Desafio Detox</h3>
                                <p className="text-xs text-white/80">Em breve...</p>
                            </div>
                        </div>
                        <div className="p-4 text-center text-sm text-slate-500">
                            Funcionalidade de desafios em construção.
                        </div>
                    </div>

                    {/* Leaderboard Widget (Placeholder) */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 opacity-75">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Classificação</h3>
                        </div>
                        <p className="text-center text-sm text-slate-500">O ranking será habilitado em breve!</p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PostItem({
    post,
    onLike,
    onSave,
    onDelete,
    supabase,
    currentUser,
    showToast
}: {
    post: Post;
    onLike: () => void;
    onSave: () => void;
    onDelete: () => void;
    supabase: any;
    currentUser: any;
    showToast: (msg: string) => void;
}) {
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // 1. Delete image if exists
            if (post.image_url) {
                const url = new URL(post.image_url);
                // Extract path after /community/
                const path = url.pathname.split('/community/').pop();
                if (path) {
                    const { error: storageError } = await supabase.storage
                        .from('community')
                        .remove([decodeURIComponent(path)]);
                    if (storageError) console.error("Error deleting image:", storageError);
                }
            }

            // 2. Delete post from DB (cascade should handle likes/comments/saved)
            const { error } = await supabase.from('posts').delete().eq('id', post.id);
            if (error) throw error;

            // 3. Update UI
            onDelete();

        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Erro ao apagar post. Tente novamente.");
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const isOwner = currentUser?.id === post.user_id;

    return (
        <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 relative">
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
                        <h3 className="font-bold text-lg text-slate-900 mb-2">Apagar post?</h3>
                        <p className="text-slate-600 mb-6 text-sm">
                            Tem certeza que deseja apagar este post? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                                disabled={isDeleting}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Apagar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                        {post.author?.avatar_url ? (
                            <img src={post.author.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            (post.author?.full_name?.[0] || post.author?.email?.[0] || "U").toUpperCase()
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">{post.author?.full_name || "Usuário"}</h4>
                        <p className="text-xs text-slate-500">
                            {post.type === "recipe" ? "Compartilhou uma receita" : post.type === "progress" ? "Compartilhou um progresso" : "Publicou"} • {timeAgo(post.created_at)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {post.type === "recipe" && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md flex items-center gap-1">
                            <ChefHat className="w-3 h-3" /> Receita
                        </span>
                    )}
                    {isOwner && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setShowDeleteModal(true);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Apagar post
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-4 pb-3">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {post.content}
                </p>
            </div>

            {post.image_url && (
                <div className="w-full bg-slate-100 flex items-center justify-center relative">
                    <img
                        src={post.image_url}
                        alt="Post Content"
                        className="w-full h-auto max-h-[500px] object-cover"
                    />
                </div>
            )}

            <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-4">
                    <button
                        onClick={onLike}
                        className={`flex items-center gap-1.5 transition-colors group ${post.user_has_liked ? "text-red-500" : "text-slate-500 hover:text-red-500"}`}
                    >
                        <Heart className={`w-5 h-5 transition-transform ${post.user_has_liked ? "fill-current scale-110" : "group-hover:scale-110"}`} />
                        <span className="text-sm font-medium">{post.likes_count}</span>
                    </button>
                    <button
                        onClick={() => setCommentsOpen(!commentsOpen)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.comments_count}</span>
                    </button>
                </div>
                <div className="flex gap-2">
                    {post.type === "recipe" && (
                        <button
                            onClick={onSave}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${post.user_has_saved ? "bg-green-100 text-green-700" : "bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20"}`}
                        >
                            <Bookmark className={`w-3 h-3 ${post.user_has_saved ? "fill-current" : ""}`} />
                            {post.user_has_saved ? "Salva" : "Salvar"}
                        </button>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            {commentsOpen && (
                <CommentsSection
                    postId={post.id}
                    supabase={supabase}
                    currentUser={currentUser}
                    onCommentAdded={() => {
                        // Ideally we update parent state, but for MVP we rely on component state or simple reload/refetch triggers
                        // Here we just increment visually if we wanted, but let's keep it simple inside CommentsSection
                    }}
                />
            )}
        </article>
    );
}

function CommentsSection({ postId, supabase, currentUser, onCommentAdded }: { postId: string; supabase: any; currentUser: any; onCommentAdded: () => void }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("post_comments")
            .select(`
                *,
                author:user_id ( id, full_name, avatar_url, email )
            `) // Here assuming we can join directly because I'll fix the view or use correct select syntax if possible.
            // Actually, wait. I didn't create a relation.
            // So I must fetch manually or rely on 'user_id' -> 'profiles' manual join.
            // Let's use the manual fetch method again for consistency and safety.
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (data) {
            // Need to enrich authors manually since no explicit FK to profiles
            const userIds = Array.from(new Set(data.map((c: any) => c.user_id)));
            let profilesMap = new Map();

            if (userIds.length > 0) {
                const { data: profiles } = await supabase.from("profiles").select("*").in("id", userIds);
                if (profiles) {
                    profilesMap = new Map(profiles.map((p: any) => [p.id, p]));
                }
            }

            // @ts-ignore
            const enriched = data.map(c => ({
                ...c,
                author: profilesMap.get(c.user_id)
            }));
            setComments(enriched);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSendComment = async () => {
        if (!newComment.trim() || !currentUser) return;

        const { error } = await supabase.from("post_comments").insert({
            post_id: postId,
            user_id: currentUser.id,
            comment: newComment
        });

        if (!error) {
            setNewComment("");
            fetchComments();
            onCommentAdded();
        }
    };

    return (
        <div className="bg-slate-50 p-4 border-t border-slate-100">
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {loading ? <div className="text-center text-xs p-2">Carregando comentários...</div> :
                    comments.length === 0 ? <div className="text-center text-xs text-slate-400">Seja o primeiro a comentar.</div> :
                        comments.map(comment => (
                            <div key={comment.id} className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden">
                                    {comment.author?.avatar_url ? (
                                        <img src={comment.author.avatar_url} alt="Av" className="w-full h-full object-cover" />
                                    ) : (
                                        (comment.author?.full_name?.[0] || "U").toUpperCase()
                                    )}
                                </div>
                                <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-sm border border-slate-100 flex-1">
                                    <span className="font-bold text-slate-900 mr-2">{comment.author?.full_name || "Usuário"}</span>
                                    <span className="text-slate-700">{comment.comment}</span>
                                </div>
                            </div>
                        ))}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <button
                    onClick={handleSendComment}
                    disabled={!newComment.trim()}
                    className="bg-[var(--color-primary)] text-white p-2 rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Dummy leaderboard just to keep TS happy if used
function LeaderboardItem({ rank, name, pts, color, badge }: { rank: number; name: string; pts: string; color: string; badge?: string }) {
    return <></>;
}
