"use client";
import Link from "next/link";
import { Sprout } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side — Illustration Panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-white">
                <Link href="/" className="flex items-center gap-3">
                    <span className="text-3xl">🌾</span>
                    <span className="text-xl font-black">Smart Crop</span>
                </Link>

                <div>
                    <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-8">
                        <Sprout className="w-12 h-12 text-white opacity-80" />
                    </div>
                    <h2 className="text-4xl font-black leading-tight mb-4">
                        Empower your farm with AI intelligence
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed max-w-sm">
                        Join thousands of farmers using data-driven insights to maximize yield and reduce cost.
                    </p>
                    <div className="flex gap-6 mt-10">
                        {[
                            { value: "95%", label: "Prediction Accuracy" },
                            { value: "400+", label: "Farms Managed" },
                            { value: "24/7", label: "AI Support" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl font-black">{stat.value}</div>
                                <div className="text-white/60 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-white/40 text-xs">© 2026 Smart Crop Advisory System</p>
            </div>

            {/* Right Side — Form Panel */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-background">
                {/* Mobile Logo */}
                <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
                    <span className="text-2xl">🌾</span>
                    <span className="text-xl font-black text-primary">Smart Crop</span>
                </Link>

                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-black text-text mb-2">{title}</h1>
                    <p className="text-text-secondary mb-8">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}
