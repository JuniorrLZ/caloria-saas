"use client";

import { Users, Heart, MessageCircle, Share2, Camera, ChefHat, Bookmark, Rocket, MoreHorizontal, Quote } from "lucide-react";

export default function CommunityPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6">
                    {/* User Mini Stats */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold text-lg">SJ</div>
                            <div>
                                <h3 className="font-bold text-slate-900">Sarah Jenkins</h3>
                                <p className="text-xs text-slate-500 font-medium">Pro Member</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-center divide-x divide-slate-100">
                            <div className="px-2 w-1/3"><div className="text-xl font-bold text-[var(--color-primary)]">12</div><div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Streak</div></div>
                            <div className="px-2 w-1/3"><div className="text-xl font-bold text-[var(--color-primary)]">850</div><div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Points</div></div>
                            <div className="px-2 w-1/3"><div className="text-xl font-bold text-[var(--color-primary)]">4</div><div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Badges</div></div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                        <nav className="space-y-1">
                            <a className="flex items-center gap-3 px-4 py-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg font-semibold transition-colors" href="#">
                                <Users className="w-5 h-5" /> Feed
                            </a>
                            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors" href="#">
                                <Heart className="w-5 h-5" /> My Challenges
                            </a>
                            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors" href="#">
                                <Users className="w-5 h-5" /> Find Groups
                            </a>
                            <a className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors" href="#">
                                <Bookmark className="w-5 h-5" /> Saved Recipes
                            </a>
                        </nav>
                    </div>

                    {/* Daily Quote */}
                    <div className="bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                        <Quote className="absolute top-2 right-2 w-16 h-16 text-white/20" />
                        <p className="font-medium relative z-10 italic">&quot;The only bad workout is the one that didn&apos;t happen.&quot;</p>
                        <div className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-100 relative z-10">Daily Motivation</div>
                    </div>
                </aside>

                {/* Center Column (Feed) */}
                <section className="col-span-1 lg:col-span-6 space-y-6">
                    {/* Create Post */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-bold shrink-0">S</div>
                            <div className="flex-1">
                                <div className="bg-slate-100 rounded-full px-4 py-2.5 text-slate-500 text-sm cursor-text hover:bg-slate-200 transition-colors">
                                    Share your progress or a new recipe...
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-3 pt-3 border-t border-slate-100">
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-500 text-sm font-medium transition-colors">
                                    <Camera className="w-4 h-4 text-green-500" /> Photo
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-slate-500 text-sm font-medium transition-colors">
                                    <ChefHat className="w-4 h-4 text-orange-500" /> Recipe
                                </button>
                            </div>
                            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-[var(--color-primary)]/30">Post</button>
                        </div>
                    </div>

                    {/* Feed Item: Transformation */}
                    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">MT</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Mike Thompson</h4>
                                    <p className="text-xs text-slate-500">Shared a transformation • 2h ago</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                        </div>
                        <div className="px-4 pb-3">
                            <p className="text-slate-700 text-sm leading-relaxed">
                                Finally hitting my stride with the 30-day keto challenge! Down 15lbs and feeling more energetic than ever. Huge thanks to this community for the motivation! 🔥💪
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-0.5 h-64 sm:h-80 w-full bg-slate-100">
                            <div className="relative h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                <span className="text-slate-500 text-sm font-medium">Before Photo</span>
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded">BEFORE</div>
                            </div>
                            <div className="relative h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span className="text-blue-500 text-sm font-medium">After Photo</span>
                                <div className="absolute bottom-2 left-2 bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-1 rounded">AFTER</div>
                            </div>
                        </div>
                        <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors group">
                                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">245</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">42</span>
                                </button>
                            </div>
                            <button className="text-slate-400 hover:text-[var(--color-primary)] transition-colors"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </article>

                    {/* Feed Item: Recipe */}
                    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">ER</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Elena Rodriguez</h4>
                                    <p className="text-xs text-slate-500">Shared a recipe • 4h ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">High Protein</span>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="px-4 pb-3">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Avocado &amp; Egg Breakfast Toast</h3>
                            <p className="text-slate-700 text-sm">Quick, easy, and packed with healthy fats. The perfect post-workout meal! 🥑🍳</p>
                        </div>
                        <div className="relative aspect-video w-full bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center">
                            <span className="text-green-600 font-medium">🥑 Recipe Image</span>
                            <div className="absolute bottom-3 right-3 flex gap-2">
                                <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold">450 kcal</span>
                                <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold">15m prep</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 flex justify-between items-center">
                            <div className="flex gap-4 text-sm font-medium text-slate-600">
                                <span><strong className="text-slate-900">24g</strong> Protein</span>
                                <span><strong className="text-slate-900">18g</strong> Fat</span>
                                <span><strong className="text-slate-900">32g</strong> Carbs</span>
                            </div>
                            <button className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1">
                                <Bookmark className="w-3 h-3" /> Save Recipe
                            </button>
                        </div>
                        <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors group">
                                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-medium">89</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-slate-500 hover:text-[var(--color-primary)] transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm font-medium">12</span>
                                </button>
                            </div>
                            <button className="text-slate-400 hover:text-[var(--color-primary)] transition-colors"><Share2 className="w-5 h-5" /></button>
                        </div>
                    </article>
                </section>

                {/* Right Column */}
                <aside className="col-span-1 lg:col-span-3 space-y-6">
                    {/* Active Challenge Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="relative h-24 bg-[var(--color-primary)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-4 text-white">
                                <h3 className="font-bold text-lg">Sugar Detox Challenge</h3>
                                <p className="text-xs text-white/80">Day 12 of 30</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                    <span className="text-slate-500">Progress</span>
                                    <span className="text-[var(--color-primary)]">40%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: "40%" }} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">A</div>
                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-pink-100 text-pink-600 flex items-center justify-center text-[10px] font-bold">B</div>
                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+1.2k</div>
                                </div>
                                <span className="text-xs text-slate-500 font-medium">Participants</span>
                            </div>
                            <button className="w-full py-2 bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg font-semibold text-sm transition-colors">
                                Check In Today
                            </button>
                        </div>
                    </div>

                    {/* Leaderboard Widget */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Leaderboard</h3>
                            <a className="text-xs text-[var(--color-primary)] font-semibold hover:underline" href="#">View All</a>
                        </div>
                        <div className="space-y-4">
                            <LeaderboardItem rank={1} name="User_Fit_99" pts="2,400" color="text-yellow-500" badge="👑" />
                            <LeaderboardItem rank={2} name="HealthyMike" pts="2,100" color="text-slate-400" />
                            <LeaderboardItem rank={3} name="SarahRuns" pts="1,950" color="text-orange-400" />
                        </div>
                    </div>

                    {/* New Challenge Promo */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Rocket className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Upcoming Challenge</h3>
                        <p className="text-sm text-slate-500 mb-4">&quot;Spring into Action&quot; starts in 3 days. Join 400+ others!</p>
                        <button className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors">
                            View Details
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function LeaderboardItem({ rank, name, pts, color, badge }: { rank: number; name: string; pts: string; color: string; badge?: string }) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className={`w-6 text-center font-bold ${color} text-sm`}>{rank}</div>
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">{name[0]}</div>
                    {badge && <span className="absolute -bottom-1 -right-1 text-xs">{badge}</span>}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">{name}</h4>
                    <p className="text-xs text-slate-500">Global Rank</p>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-sm text-slate-900">{pts}</div>
                <div className="text-[10px] text-slate-400 font-semibold">PTS</div>
            </div>
        </div>
    );
}
