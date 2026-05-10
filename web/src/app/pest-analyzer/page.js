"use client";
import Navbar from "@/layout/Navbar";
import useAppStore from "@/store/useAppStore";
import { useState } from "react";
import { Bug, Upload, Search, RefreshCcw, ShieldCheck, AlertCircle } from "lucide-react";

export default function PestAnalyzer() {
    const t = useAppStore((s) => s.t);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(URL.createObjectURL(file));
        setLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${baseUrl}/api/pest/detect`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Backend unreachable");

            const data = await response.json();

            // Map backend response to UI structure
            const pestInfo = {
                "aphids": { desc: "Small sap-sucking insects that can cause leaf curling and transmit viruses.", symptoms: ["Curled leaves", "Sticky honeydew", "Stunted growth"] },
                "armyworm": { desc: "Larvae that feed in large groups, skeletonizing leaves and consuming entire plants.", symptoms: ["Ragged holes in leaves", "Groups of caterpillars", "Defoliation"] },
                "beetle": { desc: "Chewing pests that damage leaves, flowers, and stems of various crops.", symptoms: ["Holes in leaves", "Damaged flowers", "Visible beetles"] },
                "bollworm": { desc: "A major pest that bores into cotton bolls and other fruiting bodies.", symptoms: ["Holes in fruit/bolls", "Internal tissue damage", "Dropping of bolls"] },
                "grasshopper": { desc: "Powerful jumpers that consume large amounts of foliage rapidly.", symptoms: ["Large irregular holes in leaves", "Missing plant parts", "Visible swarms"] },
                "mites": { desc: "Tiny arachnids that cause speckling and webbing on the undersides of leaves.", symptoms: ["Yellow speckling", "Fine silk webbing", "Bronzing of leaves"] },
                "mosquito": { desc: "While not a crop pest, their presence indicates standing water which may affect crops.", symptoms: ["Standing water nearby", "Visible swarming"] },
                "sawfly": { desc: "Larvae resemble caterpillars and can quickly defoliate specific host plants.", symptoms: ["Skeletonized leaves", "Rolled leaves", "Waxy secretions"] },
                "stem_borer": { desc: "Pests that tunnel into stems, disrupting nutrient flow and causing 'dead hearts'.", symptoms: ["Holes in stems", "Wilted central leaves", "Weakened stalks"] },
                "Healthy": { desc: "Your crop appears to be in excellent health. No significant pest or disease signs detected.", symptoms: ["None"] }
            };

            const info = pestInfo[data.diagnosis] || { desc: `Analysis suggests the presence of ${data.diagnosis}.`, symptoms: ["Visible spots", "Discoloration"] };

            setResult({
                disease: data.diagnosis,
                confidence: `${Math.round(data.confidence * 100)}%`,
                description: info.desc,
                symptoms: info.symptoms,
                treatment: data.treatment
            });
        } catch (error) {
            console.error("Pest analysis failed, using fallback mock:", error);
            // Fallback for demo if backend is down
            setTimeout(() => {
                setResult({
                    disease: "Early Blight (Demo Mode)",
                    confidence: "88%",
                    description: "Early Blight is a common fungal disease caused by Alternaria solani. It affects leaves, stems, and fruits.",
                    symptoms: ["Dark spots with concentric rings", "Yellowing around spots", "Premature leaf drop"],
                    treatment: "Apply Mancozeb or Copper-based fungicides. Improve air circulation and avoid overhead watering."
                });
                setLoading(false);
            }, 1500);
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-red-500/10 rounded-xl">
                        <Bug className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-black text-text">{t('pestAnalyzer')}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upload Area */}
                    <div className="space-y-6">
                        <div className="bg-surface rounded-2xl border-2 border-dashed border-surface-light p-8 text-center relative hover:border-primary/50 transition-colors group">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleUpload}
                            />
                            {image ? (
                                <img src={image} alt="Upload" className="w-full h-64 object-cover rounded-xl mb-4" />
                            ) : (
                                <div className="py-12">
                                    <div className="w-16 h-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-text-secondary" />
                                    </div>
                                    <p className="text-text font-bold mb-1">{t('uploadImage')}</p>
                                    <p className="text-sm text-text-secondary">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                        </div>

                        <button className="w-full bg-surface border border-surface-light hover:bg-surface-light text-text font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                            <Search className="w-5 h-5" />
                            {t('search')}
                        </button>
                    </div>

                    {/* Analysis Area */}
                    <div className="flex flex-col">
                        {loading ? (
                            <div className="bg-surface p-12 rounded-2xl border border-surface-light flex-1 flex flex-col items-center justify-center text-center">
                                <RefreshCcw className="w-12 h-12 text-primary animate-spin mb-6" />
                                <h3 className="text-xl font-bold text-text mb-2">{t('analyzing')}</h3>
                                <p className="text-sm text-text-secondary">Our AI model is processing the image...</p>
                            </div>
                        ) : result ? (
                            <div className="bg-surface p-8 rounded-2xl border border-red-500/30 flex-1 animate-in zoom-in-95 duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full uppercase">Detected</span>
                                    <span className="text-text-secondary text-xs">{result.confidence} Confidence</span>
                                </div>
                                <h2 className="text-4xl font-black text-red-500 mb-4">{result.disease}</h2>
                                <p className="text-text-secondary text-sm leading-relaxed mb-6">{result.description}</p>

                                <div className="space-y-4">
                                    <div className="p-4 bg-surface-light rounded-xl border border-surface-light">
                                        <h4 className="text-sm font-bold text-text mb-2 flex items-center gap-2 uppercase tracking-wider">
                                            <AlertCircle className="w-4 h-4 text-orange-500" /> Symptoms
                                        </h4>
                                        <ul className="text-xs text-text-secondary space-y-1">
                                            {result.symptoms.map(s => <li key={s} className="flex items-center gap-2">• {s}</li>)}
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                                        <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-wider">
                                            <ShieldCheck className="w-4 h-4" /> Recommended Treatment
                                        </h4>
                                        <p className="text-xs text-text-secondary leading-relaxed">
                                            {result.treatment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-surface p-8 rounded-2xl border border-surface-light border-dashed flex-1 flex flex-col items-center justify-center text-center opacity-50">
                                <Bug className="w-12 h-12 text-text-secondary/20 mb-4" />
                                <p className="text-sm text-text-secondary">Upload an image to start analysis</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
