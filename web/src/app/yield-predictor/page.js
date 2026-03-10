"use client";
import Navbar from "@/layout/Navbar";
import useAppStore from "@/store/useAppStore";
import { useState } from "react";
import { TrendingUp, Send, RefreshCcw, Leaf, Info } from "lucide-react";
// Import our newly compiled standalone regression model
import { predictYield } from "@/utils/yieldModel";

export default function MarketPrices() {
    const t = useAppStore((s) => s.t);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Using the exact 8 features from Crop_Yield_Prediction.csv
    const [formData, setFormData] = useState({
        Nitrogen: '',
        Phosphorus: '',
        Potassium: '',
        Temperature: '',
        Humidity: '',
        pH_Value: '',
        Rainfall: '',
        Crop: 'Rice'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Visual delay to feel like processing
            await new Promise(r => setTimeout(r, 600));

            // Run offline Inference using the new Random Forest JS Regression Tree
            const expectedYield = predictYield({
                Nitrogen: parseFloat(formData.Nitrogen) || 0,
                Phosphorus: parseFloat(formData.Phosphorus) || 0,
                Potassium: parseFloat(formData.Potassium) || 0,
                Temperature: parseFloat(formData.Temperature) || 0,
                Humidity: parseFloat(formData.Humidity) || 0,
                pH_Value: parseFloat(formData.pH_Value) || 0,
                Rainfall: parseFloat(formData.Rainfall) || 0,
                Crop: formData.Crop
            });

            setResult({
                yield: expectedYield.toFixed(2),
                confidence: "100% Client-Side",
                advice: `Based on your exact conditions, the AI predicts a potential yield of ${expectedYield.toFixed(2)} units.`,
            });
        } catch (error) {
            console.error("Client side yield prediction failed: ", error);
            alert("Yield Prediction engine error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-text">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-xl">
                            <TrendingUp className="w-8 h-8 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black">Yield Predictor</h1>
                            <p className="text-text-secondary text-sm">Estimate production volume instantly entirely offline.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-surface p-8 rounded-2xl border border-surface-light">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">Target Crop</label>
                                <select name="Crop" value={formData.Crop} onChange={handleChange} className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors">
                                    <option value="Rice">Rice</option>
                                    <option value="Wheat">Wheat</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Sugarcane">Sugarcane</option>
                                    <option value="Maize">Maize</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Nitrogen (N)</label>
                                    <input type="number" name="Nitrogen" value={formData.Nitrogen} onChange={handleChange} required placeholder="e.g. 90" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Phosphorus (P)</label>
                                    <input type="number" name="Phosphorus" value={formData.Phosphorus} onChange={handleChange} required placeholder="e.g. 42" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Potassium (K)</label>
                                    <input type="number" name="Potassium" value={formData.Potassium} onChange={handleChange} required placeholder="e.g. 43" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">pH Level</label>
                                    <input type="number" name="pH_Value" value={formData.pH_Value} onChange={handleChange} required step="0.1" placeholder="e.g. 6.5" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Temperature (°C)</label>
                                    <input type="number" name="Temperature" value={formData.Temperature} onChange={handleChange} required step="0.1" placeholder="e.g. 20.8" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Humidity (%)</label>
                                    <input type="number" name="Humidity" value={formData.Humidity} onChange={handleChange} required step="0.1" placeholder="e.g. 82.0" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-text-secondary mb-2">Rainfall (mm)</label>
                                <input type="number" name="Rainfall" value={formData.Rainfall} onChange={handleChange} required step="0.1" placeholder="e.g. 202.9" className="w-full bg-surface-light border border-surface-light rounded-lg px-4 py-3 text-text focus:border-accent outline-none transition-colors" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {loading ? "Calculating..." : "Predict Yield"}
                            </button>
                        </form>
                    </div>

                    {/* Result */}
                    <div className="flex flex-col">
                        {result ? (
                            <div className="bg-surface p-8 rounded-2xl border border-accent/20 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full uppercase tracking-wider">Estimated Yield</span>
                                    <span className="text-text-secondary text-xs">{result.confidence}</span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <h2 className="text-5xl font-black text-accent">{result.yield}</h2>
                                    <span className="text-xl text-text-secondary font-medium">units</span>
                                </div>
                                <p className="text-text-secondary leading-relaxed mb-8">{result.advice}</p>

                                <div className="bg-surface-light p-6 rounded-xl border border-surface-light">
                                    <h4 className="font-bold text-text mb-2 flex items-center gap-2">
                                        📈 Pricing Notice
                                    </h4>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        Multiplied by current Mandi baseline rates, you can leverage this yield prediction to estimate total revenue per hectare!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface p-8 rounded-2xl border border-surface-light border-dashed flex-1 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-surface-light rounded-full flex items-center justify-center mb-6">
                                    <TrendingUp className="w-10 h-10 text-text-secondary/20" />
                                </div>
                                <h3 className="text-xl font-bold text-text mb-2">Awaiting Parameters</h3>
                                <p className="text-sm text-text-secondary max-w-[200px]">
                                    Enter your specific farming parameters to estimate your potential yield volume using AI.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-12 bg-surface-light/50 p-6 rounded-xl border border-surface-light flex items-start gap-4">
                    <Info className="w-5 h-5 text-text-secondary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-text-secondary leading-relaxed">
                        Predictions are calculated directly in your browser using a RandomForest regression model transpiled to isolated JS. Values are estimates and subject to environmental variances not captured by baseline metrics.
                    </p>
                </div>
            </div>
        </main>
    );
}
