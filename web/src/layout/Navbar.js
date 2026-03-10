"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Leaf,
    Bug,
    TrendingUp,
    Settings,
    Menu,
    X,
    LayoutDashboard,
    LogIn,
    LogOut,
    UserCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import useAppStore from '@/store/useAppStore';

const navItems = [
    { name: 'dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'cropAdvisor', icon: Leaf, path: '/crop-advisor' },
    { name: 'pestAnalyzer', icon: Bug, path: '/pest-analyzer' },
    { name: 'yieldPredictor', icon: TrendingUp, path: '/yield-predictor' },
    { name: 'settings', icon: Settings, path: '/settings' },
];

export default function Navbar() {
    const pathname = usePathname();
    const t = useAppStore((s) => s.t);
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-surface-light z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl">🌾</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent hidden sm:block">
                                Smart Crop
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text-secondary hover:text-text hover:bg-surface-light'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {t(item.name)}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {session ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className="flex items-center gap-3 group transition-all">
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt={session.user.name} className="w-8 h-8 rounded-full object-cover border-2 border-primary/30 group-hover:border-primary" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20">
                                            <UserCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                    <div className="flex flex-col -space-y-1">
                                        <span className="text-sm font-bold text-text group-hover:text-primary transition-colors">{session.user?.name?.split(' ')[0]}</span>
                                        <span className="text-[10px] text-text-secondary font-medium">View Profile</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-1.5 text-text-secondary hover:text-red-500 transition-colors text-sm font-semibold"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text transition-colors">
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Link>
                                <Link href="/signup" className="bg-primary hover:bg-primary-dark text-white text-sm font-bold px-4 py-2 rounded-lg transition-all">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text hover:bg-surface-light focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-surface border-b border-surface-light">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:text-text hover:bg-surface-light'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {t(item.name)}
                                </Link>
                            );
                        })}
                        <div className="border-t border-surface-light pt-3 mt-1">
                            {session ? (
                                <button
                                    onClick={() => { setIsOpen(false); signOut({ callbackUrl: '/' }); }}
                                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md w-full"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 text-base font-medium text-text-secondary hover:bg-surface-light rounded-md">
                                        <LogIn className="w-5 h-5" />
                                        Sign In
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 text-base font-bold text-primary hover:bg-primary/10 rounded-md">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
