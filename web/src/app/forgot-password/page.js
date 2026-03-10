"use client";
import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        // Simulate API call for password reset email  
        // In production, this would call an endpoint that sends a reset email via nodemailer
        await new Promise((r) => setTimeout(r, 1200));
        setSubmitted(true);
        setLoading(false);
    };

    return (
        <AuthLayout
            title="Forgot password?"
            subtitle="Enter your email and we'll send a reset link."
        >
            {submitted ? (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-black text-text mb-3">Check your inbox</h3>
                    <p className="text-text-secondary leading-relaxed mb-8">
                        If an account exists for <strong>{email}</strong>, we've sent a password reset link. Please check your spam folder too.
                    </p>
                    <Link
                        href="/login"
                        className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-dark transition-all"
                    >
                        Back to Sign In
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 font-medium">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="farmer@example.com"
                            className="w-full bg-surface-light border border-surface-light rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    <Link
                        href="/login"
                        className="block text-center text-sm font-semibold text-text-secondary hover:text-text mt-2 transition-colors"
                    >
                        ← Back to Sign In
                    </Link>
                </form>
            )}
        </AuthLayout>
    );
}
