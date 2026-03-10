"use client";
import Navbar from "@/layout/Navbar";
import useAppStore from "@/store/useAppStore";
import { Settings as SettingsIcon, Globe, Mic, Bell, Shield, Info, Palette } from "lucide-react";

const SettingItem = ({ icon: Icon, title, description, badge }) => (
    <div className="bg-surface p-6 rounded-2xl border border-surface-light flex items-center justify-between hover:bg-surface-light transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h3 className="font-bold text-text">{title}</h3>
                <p className="text-xs text-text-secondary">{description}</p>
            </div>
        </div>
        {badge && (
            <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-full tracking-widest">
                {badge}
            </span>
        )}
    </div>
);

export default function Settings() {
    const t = useAppStore((s) => s.t);
    const lang = useAppStore((s) => s.language);
    const setLang = useAppStore((s) => s.setLanguage);

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-surface rounded-xl border border-surface-light">
                        <SettingsIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-black text-text">{t('settings')}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* General Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-text-secondary flex items-center gap-2">
                            <Globe className="w-5 h-5" /> Preferences
                        </h2>

                        {/* Language Selector */}
                        <div className="bg-surface p-6 rounded-2xl border border-surface-light">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text">{t('language')}</h3>
                                    <p className="text-xs text-text-secondary">App language selection</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setLang('en')}
                                    className={`py-3 rounded-xl border font-bold text-sm transition-all ${lang === 'en' ? 'bg-primary border-primary text-black' : 'bg-surface-light border-surface-light text-text hover:border-primary/50'}`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setLang('hi')}
                                    className={`py-3 rounded-xl border font-bold text-sm transition-all ${lang === 'hi' ? 'bg-primary border-primary text-black' : 'bg-surface-light border-surface-light text-text hover:border-primary/50'}`}
                                >
                                    हिंदी (Hindi)
                                </button>
                            </div>
                        </div>

                        <SettingItem
                            icon={Mic}
                            title={t('voice')}
                            description="Enable Hindi/Marathi voice queries"
                            badge="Coming Soon"
                        />
                    </div>

                    {/* Account & Info Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-text-secondary flex items-center gap-2">
                            <Shield className="w-5 h-5" /> System
                        </h2>
                        <div className="space-y-4">
                            <SettingItem icon={Bell} title="Notifications" description="Manage alerts and news" />
                            <SettingItem icon={Palette} title="Accessibility" description="Contrast and font resizing" />
                            <SettingItem icon={Info} title="Help Center" description="Tutorials and contact support" />
                        </div>

                        {/* App Branding */}
                        <div className="mt-8 pt-8 border-t border-surface-light text-center">
                            <div className="text-2xl mb-2">🌾</div>
                            <div className="text-lg font-black bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                                Smart Crop Advisory
                            </div>
                            <div className="text-xs text-text-secondary mt-1">Version 1.0.0-web</div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
