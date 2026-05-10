"use client";
import Navbar from "@/layout/Navbar";
import useAppStore from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { CloudRain, Sun, MapPin, TrendingUp, RefreshCcw, Leaf, AlertCircle, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from 'next/link';

export default function Dashboard() {
    const t = useAppStore((s) => s.t);
    const [weather, setWeather] = useState(null);
    const [marketPrices, setMarketPrices] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            // Wait for both fetch requests simultaneously
            const [weatherRes, marketRes] = await Promise.all([
                fetch(`${baseUrl}/api/weather/weather/Nagpur`).then(res => res.ok ? res.json() : null).catch(() => null),
                fetch(`${baseUrl}/api/market/market-prices/Wheat`).then(res => res.ok ? res.json() : null).catch(() => null)
            ]);
            setWeather(weatherRes);
            setMarketPrices(marketRes);
        } catch (error) {
            console.error("Dashboard data error: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const getTemp = (w) => w?.main?.temp ?? w?.current?.temp ?? '--';
    const getCondition = (w) => w?.weather?.[0]?.description ?? w?.current?.condition ?? '--';
    const getCity = (w) => w?.name ?? 'Nagpur';

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-text">{t('dashboard')}</h1>
                        <p className="text-text-secondary mt-1">Real-time insights for your farming needs.</p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="bg-surface hover:bg-surface-light p-3 rounded-full transition-colors border border-surface-light disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-5 h-5 text-primary ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Weather & Quick Links */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Weather Widget */}
                        <div className="bg-surface p-6 rounded-2xl border border-surface-light relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sun className="w-24 h-24" />
                            </div>
                            <div className="flex items-center gap-2 mb-4 text-text-secondary relative z-10">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="font-bold">{getCity(weather)}</span>
                            </div>

                            {loading ? (
                                <div className="h-24 flex items-center justify-center">
                                    <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : (
                                <div className="relative z-10">
                                    <div className="text-5xl font-black text-text mb-2">
                                        {getTemp(weather)}°C
                                    </div>
                                    <div className="text-lg font-medium text-text-secondary capitalize flex items-center gap-2">
                                        <CloudRain className="w-5 h-5 text-primary" />
                                        {getCondition(weather)}
                                    </div>
                                    {weather?.source && (
                                        <div className="mt-4 text-xs font-semibold px-2 py-1 bg-warning/20 text-orange-600 rounded inline-flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> API Key Missing (Mock Data)
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Insights Link */}
                        <Link href="/yield-predictor" className="group block bg-primary text-white p-6 rounded-2xl border border-primary-dark hover:bg-primary-dark transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <ArrowUpRight className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-bold text-xl mb-1">{t('yieldPredictor')}</h3>
                            <p className="text-primary-light text-sm opacity-90">Calculate expected crop output based on soil testing.</p>
                        </Link>

                        <Link href="/crop-advisor" className="group block bg-surface p-6 rounded-2xl border border-surface-light hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Leaf className="w-6 h-6 text-primary" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="font-bold text-text text-xl mb-1">{t('cropAdvisor')}</h3>
                            <p className="text-text-secondary text-sm">Find out what to plant next.</p>
                        </Link>
                    </div>

                    {/* Right Column: Market Prices */}
                    <div className="lg:col-span-2">
                        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-surface-light h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-accent/10 rounded-xl">
                                        <TrendingUp className="w-6 h-6 text-accent" />
                                    </div>
                                    <h2 className="text-xl font-bold text-text">Live Mandi Rates</h2>
                                </div>
                                {marketPrices && (
                                    <div className="px-4 py-1.5 bg-accent/20 text-accent-dark font-bold text-sm rounded-full">
                                        {marketPrices.commodity}
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center text-text-secondary gap-4">
                                    <RefreshCcw className="w-10 h-10 text-accent animate-spin" />
                                    Fetching latest prices...
                                </div>
                            ) : marketPrices?.prices ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b-2 border-surface-light text-text-secondary text-sm uppercase tracking-wider">
                                                <th className="pb-4 font-bold">Mandi (Market)</th>
                                                <th className="pb-4 font-bold">Price Range</th>
                                                <th className="pb-4 font-bold">Unit</th>
                                                <th className="pb-4 font-bold text-right">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {marketPrices.prices.map((item, idx) => (
                                                <tr key={idx} className="border-b border-surface-light last:border-0 hover:bg-surface-light transition-colors">
                                                    <td className="py-4 font-bold text-text">{item.mandi}</td>
                                                    <td className="py-4 font-black flex items-center gap-1 text-lg">
                                                        <span className="text-sm font-medium text-text-secondary">₹</span>
                                                        {item.price}
                                                    </td>
                                                    <td className="py-4 text-text-secondary">{item.unit}</td>
                                                    <td className="py-4 text-right">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${item.trend.toLowerCase() === 'up'
                                                                ? 'bg-green-100 text-green-700'
                                                                : item.trend.toLowerCase() === 'down'
                                                                    ? 'bg-red-100 text-red-700'
                                                                    : 'bg-gray-200 text-gray-700'
                                                            }`}>
                                                            {item.trend}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-text-secondary border-2 border-dashed border-surface-light rounded-xl">
                                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                                    <p>Market data could not be retrieved at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
