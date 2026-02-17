"use client";

import { ChevronRight, ArrowRight, Lock, Check, X, CreditCard } from "lucide-react";

export default function SubscriptionPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumb & Header */}
            <div className="mb-10">
                <nav aria-label="Breadcrumb" className="flex mb-4">
                    <ol className="flex items-center space-x-2 text-sm text-slate-500">
                        <li><a className="hover:text-[var(--color-primary)] transition-colors" href="#">Settings</a></li>
                        <li><ChevronRight className="w-3 h-3" /></li>
                        <li className="font-medium text-slate-900">Subscription</li>
                    </ol>
                </nav>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subscription Management</h1>
                <p className="mt-2 text-slate-600">Manage your billing details and upgrade your plan to unlock more AI features.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Current Plan Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Current Plan</h2>
                            <div className="flex items-baseline justify-between mb-2">
                                <span className="text-2xl font-bold text-slate-900">Basic (Free)</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-6">Your plan renews automatically on <span className="font-semibold text-slate-900">Never</span>.</p>
                            <div className="space-y-3 pt-6 border-t border-slate-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Meal Plans Generated</span>
                                    <span className="font-medium text-slate-900">3 / 5</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-[var(--color-primary)] h-1.5 rounded-full" style={{ width: "60%" }} />
                                </div>
                            </div>
                            <div className="space-y-3 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Storage Used</span>
                                    <span className="font-medium text-slate-900">120 MB / 500 MB</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: "24%" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Payment Method</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">VISA</div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-900">•••• 4242</span>
                                <span className="text-xs text-slate-500">Expires 12/25</span>
                            </div>
                            <button className="ml-auto text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-medium">Edit</button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Lock className="w-4 h-4" />
                            Payments are secure and encrypted.
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2">
                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-slate-100 p-1 rounded-xl inline-flex relative">
                            <button className="relative z-10 px-8 py-2 text-sm font-medium text-slate-500 transition-colors w-[160px] text-center hover:text-slate-900">
                                Monthly Billing
                            </button>
                            <button className="relative z-10 px-8 py-2 text-sm font-medium text-slate-900 bg-white rounded-lg shadow-sm transition-colors w-[160px] text-center flex items-center justify-center gap-2">
                                Annual Billing
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Save 20%</span>
                            </button>
                        </div>
                    </div>

                    {/* Premium Card */}
                    <div className="relative bg-white rounded-2xl shadow-lg border-2 border-[var(--color-primary)]/20 overflow-hidden mb-8">
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/30 to-transparent rounded-full blur-2xl" />
                        <div className="p-8 md:p-10 grid md:grid-cols-2 gap-10 items-center">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] mb-4 border border-[var(--color-primary)]/10">
                                    RECOMMENDED UPGRADE
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Caloria Premium</h2>
                                <p className="text-slate-600 mb-6">Unlock the full power of AI for your health journey.</p>
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-bold tracking-tight text-slate-900">$9.99</span>
                                    <span className="text-lg text-slate-500 font-medium">/ month</span>
                                </div>
                                <span className="text-sm text-slate-400 block -mt-6 mb-8">Billed $119.88 yearly</span>
                                <button className="w-full bg-[var(--color-primary)] hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group">
                                    <span>Upgrade to Premium</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">14-day money-back guarantee. No questions asked.</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">What&apos;s included</h3>
                                <ul className="space-y-4">
                                    <FeatureItem text={<><strong className="text-slate-900 font-semibold">AI-Powered Meal Planning</strong> tailored to your metabolism.</>} />
                                    <FeatureItem text={<><strong className="text-slate-900 font-semibold">Advanced Analytics</strong> &amp; weekly PDF reports.</>} />
                                    <FeatureItem text="Priority Support from nutritionists." />
                                    <FeatureItem text="Ad-free experience across all devices." />
                                    <FeatureItem text="Unlimited photo food logging." />
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-900">Feature Comparison</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium w-1/2">Feature</th>
                                        <th className="px-6 py-3 font-medium text-center">Basic</th>
                                        <th className="px-6 py-3 font-medium text-center text-[var(--color-primary)]">Premium</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="px-6 py-4 text-slate-900 font-medium">Meal Suggestions</td>
                                        <td className="px-6 py-4 text-center text-slate-500">Limited (3/day)</td>
                                        <td className="px-6 py-4 text-center text-[var(--color-primary)] font-bold">Unlimited</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-slate-900 font-medium">Macro Tracking</td>
                                        <td className="px-6 py-4 text-center text-slate-500">Basic</td>
                                        <td className="px-6 py-4 text-center text-[var(--color-primary)] font-bold">Advanced</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-slate-900 font-medium">Data Export</td>
                                        <td className="px-6 py-4 text-center text-slate-300"><X className="w-4 h-4 mx-auto" /></td>
                                        <td className="px-6 py-4 text-center text-[var(--color-primary)]"><Check className="w-4 h-4 mx-auto" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <div className="flex gap-6">
                    <a className="hover:text-slate-800 transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-slate-800 transition-colors" href="#">Terms of Service</a>
                </div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> 256-bit SSL Secure</span>
                    <div className="h-4 w-px bg-slate-300" />
                    <button className="text-slate-400 hover:text-red-500 transition-colors">Cancel Subscription</button>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text }: { text: React.ReactNode }) {
    return (
        <li className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-slate-600 text-sm">{text}</span>
        </li>
    );
}
