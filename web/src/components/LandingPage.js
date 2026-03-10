"use client";
import Link from 'next/link';
import { useState } from 'react';
import {
    Leaf,
    Bug,
    TrendingUp,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Sprout,
    Tractor,
    Droplets
} from 'lucide-react';
import Navbar from '@/layout/Navbar';

const ServiceCard = ({ icon: Icon, title, description, path, color }) => (
    <div className="bg-surface p-8 rounded-xl border border-surface-light hover:border-primary transition-all flex flex-col items-center text-center">
        <div className={`p-4 rounded-full mb-6`} style={{ backgroundColor: `${color}1A` }}>
            <Icon className="w-8 h-8" style={{ color }} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-text-secondary mb-6 leading-relaxed">{description}</p>
        <Link
            href={path}
            className="mt-auto font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
        >
            Explore Tool <span className="text-lg">→</span>
        </Link>
    </div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-surface-light last:border-0">
            <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-bold pr-8">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
            </button>
            {isOpen && (
                <div className="pb-6 text-text-secondary leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

export default function LandingPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Placeholder for background image */}
                <div className="absolute inset-0 bg-[#E8F0E3] z-0">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-primary)_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
                </div>

                <div className="container relative z-10 mx-auto px-4 max-w-7xl">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-black text-text mb-6 leading-tight">
                            Empowering Farmers with <span className="text-primary">Smart Organic</span> Practices
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed max-w-2xl">
                            Access real-time crop advisory, AI-driven pest analysis, predictive yield modeling, and live market trends via our smart dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/crop-advisor" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg text-center transition-colors">
                                Start Free Advisory
                            </Link>
                            <Link href="#services" className="bg-white border-2 border-surface-light hover:border-primary text-text font-bold py-4 px-8 rounded-lg text-center transition-colors">
                                Explore Features
                            </Link>
                        </div>
                    </div>

                    {/* Overlaid Value Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-light">
                            <div className="text-3xl font-black text-primary mb-1">95%</div>
                            <div className="text-sm font-semibold text-text-secondary">Organic Focus</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-light">
                            <div className="text-3xl font-black text-accent mb-1">400+</div>
                            <div className="text-sm font-semibold text-text-secondary">Local Farms</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-light">
                            <div className="text-3xl font-black text-primary mb-1">24/7</div>
                            <div className="text-sm font-semibold text-text-secondary">AI Support</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-surface-light">
                            <div className="text-3xl font-black text-accent mb-1">100%</div>
                            <div className="text-sm font-semibold text-text-secondary">Free Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-sm font-black text-primary uppercase tracking-wider mb-2">Our Solutions</h2>
                        <h3 className="text-3xl md:text-4xl font-black text-text mb-4">Comprehensive Agricultural Offerings</h3>
                        <p className="text-text-secondary text-lg">Everything you need to manage your farm efficiently and increase profitability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={Leaf}
                            title="Crop Advisor"
                            description="Get personalized crop recommendations based on your soil type, NPK levels, and local weather patterns."
                            path="/crop-advisor"
                            color="#3E8E41"
                        />
                        <ServiceCard
                            icon={Bug}
                            title="Pest Analyzer"
                            description="Instantly identify plant diseases by uploading a photo. Receive actionable, organic treatment plans."
                            path="/pest-analyzer"
                            color="#F0C43D"
                        />
                        <ServiceCard
                            icon={TrendingUp}
                            title="Yield Predictor"
                            description="Estimate your crop yield volume instantly entirely offline based on your specific farming parameters."
                            path="/yield-predictor"
                            color="#3E8E41"
                        />
                    </div>
                </div>
            </section>

            {/* About/Features Section */}
            <section className="py-24 bg-surface">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <div className="aspect-[4/3] bg-primary/10 rounded-2xl border-2 border-primary/20 flex items-center justify-center relative overflow-hidden">
                                {/* Decorative graphic placeholder */}
                                <Sprout className="w-32 h-32 text-primary opacity-50" />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <h2 className="text-sm font-black text-primary uppercase tracking-wider mb-2">Why Choose Us</h2>
                            <h3 className="text-3xl md:text-4xl font-black text-text mb-6 leading-tight">We're Top Agriculture & Organic Enterprises</h3>
                            <p className="text-text-secondary mb-8 text-lg leading-relaxed">
                                Our platform bridges the gap between traditional farming and modern technology, ensuring sustainable growth and better yields for every farmer.
                            </p>

                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                    <span className="font-semibold text-lg">Data-driven Organic Insights</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                    <span className="font-semibold text-lg">AI Pest Diagnosis (95%+ accuracy)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                    <span className="font-semibold text-lg">Real-time Local Market Trends</span>
                                </li>
                            </ul>

                            <Link href="/about" className="inline-block bg-white border-2 border-surface-light hover:border-primary text-text font-bold py-3 px-8 rounded-lg transition-colors">
                                Discover More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Ready to transform your farm?</h2>
                    <p className="text-primary-light text-lg mb-10 text-white/90">Join thousands of farmers making smarter, organic decisions every day.</p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-accent hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <Tractor className="w-5 h-5" /> Start Farming Smarter
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/20">
                            <Droplets className="w-5 h-5" /> View Soil Guide
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-black text-primary uppercase tracking-wider mb-2">Support</h2>
                        <h3 className="text-3xl md:text-4xl font-black text-text">Frequently Answered Questions</h3>
                    </div>

                    <div className="bg-white border border-surface-light rounded-2xl p-4 md:p-8 shadow-sm">
                        <FAQItem
                            question="Is this service completely free?"
                            answer="Yes, the core advisory, pest analysis, and market price features are 100% free for all farmers. We believe in accessible agricultural technology."
                        />
                        <FAQItem
                            question="How accurate is the Pest Analyzer?"
                            answer="Our AI model is trained on thousands of plant disease images and achieves over 95% accuracy for common leaf diseases. However, we always recommend consulting a local expert for severe infestations."
                        />
                        <FAQItem
                            question="Can I use the app in my local language?"
                            answer="Absolutely! Currently, we support English and Hindi. You can switch languages easily from the Settings page. More regional languages like Marathi are coming soon."
                        />
                        <FAQItem
                            question="Where does the market data come from?"
                            answer="We aggregate real-time data from eNAM and local APMC (Agricultural Produce Market Committee) mandis to provide you with the most accurate pricing trends."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-surface py-12 border-t border-surface-light">
                <div className="container mx-auto px-4 text-center text-text-secondary font-semibold">
                    <p>© 2026 Smart Crop Advisory System. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
