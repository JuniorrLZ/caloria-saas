"use client";

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
    /** Show icon only (compact mode) */
    iconOnly?: boolean;
    className?: string;
}

export default function LogoutButton({ iconOnly = false, className = "" }: LogoutButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleLogout() {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    if (iconOnly) {
        return (
            <button
                onClick={handleLogout}
                disabled={loading}
                className={`text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50 ${className}`}
                title="Sign out"
            >
                {loading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                ) : (
                    <LogOut className="w-4 h-4" />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors disabled:opacity-50 ${className}`}
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            ) : (
                <LogOut className="w-4 h-4" />
            )}
            <span>Sign Out</span>
        </button>
    );
}
