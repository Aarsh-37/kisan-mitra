"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import AuthLayout from "@/components/auth/AuthLayout";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

function getStrength(pass) {
    let score = 0;
    if (!pass) return { score: 0, label: "", color: "" };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    const levels = [
        { label: "", color: "" },
        { label: "Weak", color: "bg-red-500" },
        { label: "Fair", color: "bg-orange-400" },
        { label: "Good", color: "bg-yellow-400" },
        { label: "Strong", color: "bg-primary" },
    ];
    return { score, ...levels[score] };
}

function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", terms: false });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const strength = getStrength(form.password);
    const passMatch = form.password && form.confirmPassword && form.password !== form.confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
        if (!form.terms) return setError("Please agree to the Terms & Conditions.");
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Registration failed.");
            } else {
                // Auto-sign-in after registration
                await signIn("credentials", { email: form.email, password: form.password, callbackUrl });
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    const inputClass = "w-full bg-surface-light border border-surface-light rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm";

    return (
        <AuthLayout title="Create account" subtitle="Start your Smart Crop journey today">
            <OAuthButtons callbackUrl={callbackUrl} />

            <div className="flex items-center gap-3 mb-6">
                <hr className="flex-1 border-surface-light" />
                <span className="text-text-secondary text-xs font-medium">or create with email</span>
                <hr className="flex-1 border-surface-light" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium">
                        {error}
                    </div>
                )}
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Full Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Rajesh Kumar" className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Email address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="farmer@example.com" className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Password</label>
                    <div className="relative">
                        <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required placeholder="Minimum 8 characters" className={`${inputClass} pr-10`} />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text">
                            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {/* Strength Indicator */}
                    {form.password && (
                        <div className="mt-2">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-surface-light"}`} />
                                ))}
                            </div>
                            <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                                {strength.score === 4 && <ShieldCheck className="w-3 h-3 text-primary" />}
                                {strength.label}
                            </p>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-bold text-text-secondary mb-2">Confirm Password</label>
                    <div className="relative">
                        <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Re-enter your password" className={`${inputClass} pr-10 ${passMatch ? "border-red-400" : ""}`} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {passMatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} className="w-4 h-4 accent-primary mt-0.5" />
                    <span className="text-sm text-text-secondary">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary font-semibold hover:underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-primary font-semibold hover:underline">Privacy Policy</Link>
                    </span>
                </label>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-8">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-primary hover:text-primary-dark">
                    Sign In
                </Link>
            </p>
        </AuthLayout>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="animate-pulse h-96 bg-surface-light rounded-xl" />}>
            <SignUpForm />
        </Suspense>
    );
}
