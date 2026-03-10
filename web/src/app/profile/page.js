"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/layout/Navbar";
import { User, Phone, MapPin, Sprout, Tractor, Loader2, Save, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        location: "",
        farmSize: "",
        farmingType: "Organic",
        bio: ""
    });

    useEffect(() => {
        if (session?.user) {
            setForm({
                name: session.user.name || "",
                phone: session.user.phone || "",
                location: session.user.location || "",
                farmSize: session.user.farmSize || "",
                farmingType: session.user.farmingType || "Organic",
                bio: session.user.bio || ""
            });
            setLoading(false);
        }
    }, [session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setSuccess(true);
                await update(); // Update session data
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    const inputClass = "w-full bg-surface border border-surface-light rounded-xl px-4 py-3 text-text placeholder-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-28 pb-12 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-primary/10 rounded-2xl">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-text">Farmer Profile</h1>
                        <p className="text-text-secondary italic">Manage your farming details and personal information.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Summary Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-surface p-6 rounded-2xl border border-surface-light text-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt={form.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-primary" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-text">{form.name}</h2>
                            <p className="text-text-secondary text-sm mb-4">{session?.user?.email}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" /> Verified Farmer
                            </div>
                        </div>

                        <div className="bg-surface p-6 rounded-2xl border border-surface-light">
                            <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                                <Tractor className="w-4 h-4 text-primary" /> Farm Quick View
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-surface-light pb-2">
                                    <span className="text-text-secondary">Type</span>
                                    <span className="font-bold">{form.farmingType}</span>
                                </div>
                                <div className="flex justify-between border-b border-surface-light pb-2">
                                    <span className="text-text-secondary">Size</span>
                                    <span className="font-bold">{form.farmSize ? `${form.farmSize} Acres` : 'Not set'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Location</span>
                                    <span className="font-bold">{form.location || 'Not set'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Edit Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-2xl border border-surface-light space-y-6 relative">
                            {success && (
                                <div className="absolute top-4 right-8 flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-200 animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 className="w-5 h-5" /> Profile Updated!
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <User className="w-4 h-4" /> Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className={inputClass}
                                        placeholder="Rajesh Kumar"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className={inputClass}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Location/Village
                                    </label>
                                    <input
                                        type="text"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        className={inputClass}
                                        placeholder="Nagpur, Maharashtra"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                        <Sprout className="w-4 h-4" /> Farm Size (Acres)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={form.farmSize}
                                        onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
                                        className={inputClass}
                                        placeholder="5.5"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                                    <Tractor className="w-4 h-4" /> Farming Strategy
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['Organic', 'Conventional', 'Hydroponic', 'Sustainable'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setForm({ ...form, farmingType: type })}
                                            className={`py-3 rounded-xl border-2 font-bold transition-all ${form.farmingType === type
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-surface-light bg-transparent text-text-secondary hover:border-surface-dark'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-secondary">Short Bio / Farming History</label>
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    className={`${inputClass} min-h-[120px] resize-none`}
                                    placeholder="I have been practicing organic farming for 10 years..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {saving ? "Saving Changes..." : "Save Farmer Profile"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
