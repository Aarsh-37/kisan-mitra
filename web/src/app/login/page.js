"use client";
import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [form, setForm] = useState({ email: "", password: "", remember: false });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { signIn } = await import("next-auth/react");
        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });
        setLoading(false);
        if (res?.error) {
            setError("Invalid email or password. Please try again.");
        } else {
            router.push(callbackUrl);
        }
    };

    const inputClass = "w-full bg-surface-light border border-surface-light rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm";

    return (
        <>
            <OAuthButtons callbackUrl={callbackUrl} />

            <div className="flex items-center gap-3 mb-6">
                <hr className="flex-1 border-surface-light" />
                <span className="text-text-secondary text-xs font-medium">or continue with email</span>
                <hr className="flex-1 border-surface-light" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Email address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="farmer@example.com" className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Password</label>
                    <div className="relative">
                        <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" className={`${inputClass} pr-10`} />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text transition-colors">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="w-4 h-4 accent-primary" />
                        <span className="text-sm text-text-secondary">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                        Forgot Password?
                    </Link>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-bold text-primary hover:text-primary-dark transition-colors">
                    Sign Up
                </Link>
            </p>
        </>
    );
}

export default function LoginPage() {
    return (
        <AuthLayout title="Welcome back" subtitle="Sign in to your Smart Crop account">
            <Suspense fallback={<div className="animate-pulse h-96 bg-surface-light rounded-xl" />}>
                <LoginForm />
            </Suspense>
        </AuthLayout>
    );
}
