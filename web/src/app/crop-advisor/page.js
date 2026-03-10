"use client";
import Navbar from "@/layout/Navbar";
import useAppStore from "@/store/useAppStore";
import { useState } from "react";
import { Leaf, Send, RefreshCcw } from "lucide-react";
// Import the generated pure JS machine learning model
import { predictCrop } from "@/utils/cropModel";

export default function CropAdvisor() {
    const t = useAppStore((s) => s.t);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [formData, setFormData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Give UI a tiny visual delay to feel like "calculating" since JS is instant
            await new Promise(r => setTimeout(r, 600));

            // Native Client-side predictions using transpiled ML model!
            const recommendedCrop = predictCrop({
                N: parseFloat(formData.N) || 0,
                P: parseFloat(formData.P) || 0,
                K: parseFloat(formData.K) || 0,
                temperature: parseFloat(formData.temperature) || 0,
                humidity: parseFloat(formData.humidity) || 0,
                ph: parseFloat(formData.ph) || 0,
                rainfall: parseFloat(formData.rainfall) || 0
            });

            setResult({
                crop: recommendedCrop,
                confidence: "100% Client-Side",
                advice: `Based on your inputs, ${recommendedCrop} is recommended for planting.`,
                fertilizer: "Apply NPK fertilizers as appropriate to growth stages."
            });
        } catch (error) {
            console.error("Client side prediction failed: ", error);
            alert("Prediction engine error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-text">{t('cropAdvisor')}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-surface p-8 rounded-2xl border border-surface-light">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Nitrogen (N)</label>
                                    <input type="number" name="N" value={formData.N} onChange={handleChange} required placeholder="e.g. 90" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-primary outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Phosphorus (P)</label>
                                    <input type="number" name="P" value={formData.P} onChange={handleChange} required placeholder="e.g. 42" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-primary outline-none transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Potassium (K)</label>
                                    <input type="number" name="K" value={formData.K} onChange={handleChange} required placeholder="e.g. 43" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-primary outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">pH Level</label>
                                    <input type="number" name="ph" value={formData.ph} onChange={handleChange} required step="0.1" placeholder="e.g. 6.5" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-primary outline-none transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Temperature (°C)</label>
                                    <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required step="0.1" placeholder="e.g. 20.8" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-primary outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Humidity (%)</label>
                                    <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} required step="0.1" placeholder="e.g. 82.0" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-primary outline-none transition-colors" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">Rainfall (mm)</label>
                                <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} required step="0.1" placeholder="e.g. 202.9" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-primary outline-none transition-colors" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {loading ? t('loading') : t('recommend')}
                            </button>
                        </form>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col">
                        {result ? (
                            <div className="bg-surface p-8 rounded-2xl border border-primary/30 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider">Recommended</span>
                                    <span className="text-text-secondary text-xs">{result.confidence}</span>
                                </div>
                                <h2 className="text-5xl font-black text-primary mb-4 capitalize">{result.crop}</h2>
                                <p className="text-text-secondary leading-relaxed mb-8">{result.advice}</p>

                                <div className="bg-surface-light p-6 rounded-xl border border-surface-light">
                                    <h4 className="font-bold text-text mb-2 flex items-center gap-2">
                                        🛡️ Action Plan
                                    </h4>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {result.fertilizer}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface p-8 rounded-2xl border border-surface-light border-dashed flex-1 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mb-6">
                                    <Leaf className="w-10 h-10 text-text-secondary/20" />
                                </div>
                                <h3 className="text-xl font-bold text-text mb-2">Waiting for Data</h3>
                                <p className="text-sm text-text-secondary max-w-[200px]">
                                    Enter your soil parameters to receive AI crop suggestions.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

