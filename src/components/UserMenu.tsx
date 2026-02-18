"use client";

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

function getUserInitials(user: SupabaseUser | null): string {
    if (!user) return "?";
    if (user.user_metadata?.full_name) {
        const parts = user.user_metadata.full_name.trim().split(" ");
        return (parts[0]?.[0] || "").toUpperCase() + (parts[parts.length - 1]?.[0] || "").toUpperCase();
    }
    return (user.email?.[0] || "?").toUpperCase();
}

function getUserDisplayName(user: SupabaseUser | null): string {
    if (!user) return "User";
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
}

export default function UserMenu() {
    const router = useRouter();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [open, setOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleLogout() {
        setLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {getUserInitials(user)}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden md:block max-w-[120px] truncate">
                    {getUserDisplayName(user)}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 truncate">{getUserDisplayName(user)}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1.5">
                        <button
                            onClick={() => {
                                setOpen(false);
                                router.push("/profile");
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                        >
                            <User className="w-4 h-4" />
                            <span>Minha conta</span>
                        </button>
                    </div>

                    {/* Divider + Logout */}
                    <div className="border-t border-slate-100 pt-1.5">
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            {loggingOut ? (
                                <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                                <LogOut className="w-4 h-4" />
                            )}
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
