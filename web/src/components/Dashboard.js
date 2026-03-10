"use client";
import {
    Cloud,
    TrendingUp,
    MapPin,
    Leaf,
    Bug,
    Search,
    AlertTriangle,
    Lightbulb,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import useAppStore from '@/store/useAppStore';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-surface p-6 rounded-xl border border-surface-light border-l-4`} style={{ borderLeftColor: color }}>
        <Icon className="w-8 h-8 mb-4" style={{ color }} />
        <div className="text-3xl font-extrabold text-text mb-1">{value}</div>
        <div className="text-sm text-text-secondary">{label}</div>
    </div>
);

const QuickAction = ({ icon: Icon, label, path, color, description }) => (
    <Link href={path} className="group">
        <div className="bg-surface p-6 rounded-xl border border-surface-light hover:border-primary/50 transition-all h-full">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 bg-[${color}22] group-hover:scale-110 transition-transform`} style={{ backgroundColor: `${color}1A` }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <h3 className="text-lg font-bold text-text mb-2 group-hover:text-primary transition-colors">{label}</h3>
            <p className="text-sm text-text-secondary mb-4">{description}</p>
            <div className="flex items-center gap-1 text-primary text-sm font-semibold">
                Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Link>
);

export default function Dashboard() {
    const t = useAppStore((s) => s.t);

    return (
        <div className="container mx-auto px-4 pt-24 pb-12">
            {/* Hero */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-text mb-2">{t('welcome')}</h1>
                    <p className="text-xl text-text-secondary">{t('subtitle')}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-surface-light border-2 border-primary flex items-center justify-center text-3xl shadow-lg shadow-primary/20">
                    👨‍🌾
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Main Stats & Alerts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Weather Widget */}
                    <div className="bg-gradient-to-br from-primary-dark/80 to-primary/60 p-8 rounded-2xl border border-primary/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-primary/20 group-hover:scale-125 transition-transform duration-700">
                            <Cloud className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-2 text-primary font-bold mb-4">
                                    <MapPin className="w-4 h-4" /> Nagpur, Maharashtra
                                </div>
                                <div className="text-7xl font-black text-text mb-2">28°C</div>
                                <div className="text-xl text-text-secondary capitalize font-medium">Partly Cloudy</div>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 bg-surface/30 rounded-xl backdrop-blur-sm border border-white/5">
                                <Cloud className="w-10 h-10 text-primary" />
                                <span className="text-sm font-bold text-text">65% Humidity</span>
                                <span className="text-xs text-text-secondary">Low probability of rain</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon={Leaf} label="Crops Tracked" value="3" color="#2ECC71" />
                        <StatCard icon={AlertTriangle} label="Active Alerts" value="1" color="#F39C12" />
                        <StatCard icon={TrendingUp} label="Yield Score" value="8.2" color="#5DADE2" />
                        <StatCard icon={Search} label="Market Status" value="Open" color="#F1C40F" />
                    </div>

                    {/* Weather Alert */}
                    <div className="bg-warning/5 border border-warning/30 p-6 rounded-xl flex items-start gap-4 animate-pulse">
                        <div className="p-3 bg-warning/20 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <h4 className="font-bold text-warning mb-1">Weather Advisory</h4>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Light rain expected in next 48h. We advise delaying fertilizer spraying until the weather clears.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Col: Quick Actions & Tips */}
                <div className="space-y-8">
                    <div className="bg-surface border border-surface-light p-8 rounded-2xl">
                        <h2 className="text-2xl font-black text-text mb-6">⚡ {t('search')}</h2>
                        <div className="space-y-4">
                            <QuickAction
                                icon={Leaf} label={t('cropAdvisor')}
                                path="/crop-advisor" color="#2ECC71"
                                description="Get AI-powered suggestions based on your soil type."
                            />
                            <QuickAction
                                icon={Bug} label={t('pestAnalyzer')}
                                path="/pest-analyzer" color="#E74C3C"
                                description="Upload images to detect crop diseases and pests."
                            />
                            <QuickAction
                                icon={TrendingUp} label={t('marketPrices')}
                                path="/market-prices" color="#F39C12"
                                description="Check live mandi prices for your local area."
                            />
                        </div>
                    </div>

                    {/* Tip Card */}
                    <div className="bg-surface border border-surface-light p-8 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 text-primary/10">
                            <Lightbulb className="w-16 h-16" />
                        </div>
                        <h4 className="text-primary font-bold flex items-center gap-2 mb-4">
                            <Lightbulb className="w-5 h-5" /> Tip of the Day
                        </h4>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Black soil (Regur) retains moisture well and is extremely productive for cotton and soybean. Ensure proper drainage to avoid waterlogging during monsoons.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
