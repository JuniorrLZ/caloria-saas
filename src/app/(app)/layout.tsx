"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Activity,
    Users,
    TrendingUp,
    ChefHat,
    Dumbbell,
    Calculator,
    HeartPulse,
    CreditCard,
    Settings,
    Flame,
    Bell,
    LogOut,
    Plus,
    Menu,
    X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

import UserMenu from "@/components/UserMenu";
import type { User } from "@supabase/supabase-js";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Food Diary", href: "/food-diary", icon: BookOpen },
    { label: "Bioimpedance", href: "/bioimpedance", icon: Activity },
    { label: "Community", href: "/community", icon: Users },
    { label: "Progress", href: "/progress", icon: TrendingUp },
    { label: "Recipes", href: "/recipes", icon: ChefHat },
    { label: "Training Plan", href: "/training", icon: Dumbbell },
    { label: "Nutrition Calc", href: "/calculator", icon: Calculator },
    { label: "Health Results", href: "/calculator-results", icon: HeartPulse },
    { label: "Subscription", href: "/subscription", icon: CreditCard },
    { label: "Settings", href: "/profile", icon: Settings },
];

function getUserInitials(user: User | null): string {
    if (!user) return "??";
    const name = user.user_metadata?.full_name || user.email || "";
    if (user.user_metadata?.full_name) {
        const parts = user.user_metadata.full_name.trim().split(" ");
        return (parts[0]?.[0] || "").toUpperCase() + (parts[parts.length - 1]?.[0] || "").toUpperCase();
    }
    return (user.email?.[0] || "?").toUpperCase();
}

function getUserDisplayName(user: User | null): string {
    if (!user) return "User";
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const currentPage = navItems.find((item) => pathname.startsWith(item.href));
    const pageTitle = currentPage?.label || "Dashboard";

    return (
        <div className="bg-[var(--color-background-light)] text-slate-800 font-[var(--font-display)] h-screen flex overflow-hidden selection:bg-primary/30">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          w-64 bg-[var(--color-surface-light)] border-r border-slate-200 flex flex-col
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">
                        Caloria<span className="text-primary">.AI</span>
                    </span>
                    <button
                        className="ml-auto lg:hidden text-slate-400 hover:text-slate-600"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Pro Card */}
                <div className="p-4 mt-auto">
                    <div className="bg-slate-900 rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-primary rounded-full blur-2xl opacity-40" />
                        <h3 className="text-white font-semibold relative z-10">Upgrade to Pro</h3>
                        <p className="text-slate-400 text-sm mt-1 mb-4 relative z-10">
                            Get detailed macro analysis and unlimited AI recipes.
                        </p>
                        <button className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-medium py-2.5 rounded-lg transition-colors relative z-10">
                            Upgrade Now
                        </button>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3 mt-6 mb-2 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {getUserInitials(user)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                {getUserDisplayName(user)}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email || "Not signed in"}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push(user ? "/profile" : "/login")}
                            className="text-slate-400 hover:text-primary transition-colors"
                            title={user ? "Minha conta" : "Fazer login"}
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-500 hover:text-slate-700"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden lg:block">
                            <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
                        </div>
                        <span className="text-lg font-bold text-slate-900 lg:hidden">
                            Caloria<span className="text-primary">.AI</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 text-sm">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Log Meal</span>
                        </button>
                        <UserMenu />
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
