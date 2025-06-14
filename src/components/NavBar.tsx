// src/app/components/Navbar.tsx

"use client";
import { Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, HomeIcon, ChartBarIcon, ArrowsRightLeftIcon, ChartPieIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Fragment, useState } from 'react';

interface NavigationItem {
    name: string;
    href: string;
    status: 'unavailable' | 'progress' | 'demo';
    icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
    { name: 'Home', href: '/home', status: 'unavailable', icon: HomeIcon },
    { name: 'Dashboard', href: '/dashboard', status: 'progress', icon: ChartBarIcon },
    { name: 'Import/Export', href: '/migration', status: 'demo', icon: ArrowsRightLeftIcon },
    { name: 'Statistics', href: '/statistics', status: 'progress', icon: ChartPieIcon },
];

const getStatusBadge = (status: NavigationItem['status']) => {
    const statusConfig = {
        unavailable: {
            text: 'Unavailable',
            className: 'bg-red-500/20 text-red-300 border border-red-500/30'
        },
        progress: {
            text: 'In progress',
            className: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        },
        demo: {
            text: 'Demo',
            className: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }
    };
    
    const config = statusConfig[status];
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${config.className}`}>
            {config.text}
        </span>
    );
};

function classNames(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = useState<'notifications' | 'profile' | 'mobile' | null>(null);

    if (pathname === "/login") return null;

    const toggleDropdown = (dropdown: 'notifications' | 'profile' | 'mobile') => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const closeDropdowns = () => {
        setActiveDropdown(null);
    };

    return (
        <nav className="bg-slate-800/95 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            onClick={() => toggleDropdown('mobile')}
                            className="group relative inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            {activeDropdown === 'mobile' ? (
                                <XMarkIcon aria-hidden="true" className="block size-6" />
                            ) : (
                                <Bars3Icon aria-hidden="true" className="block size-6" />
                            )}
                        </button>
                    </div>

                    {/* Logo and Navigation */}
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        {/* <div className="flex shrink-0 items-center">
                            <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <div className="h-4 w-4 bg-white rounded transform rotate-45 opacity-90"></div>
                            </div>
                        </div> */}
                        
                        {/* Desktop Navigation */}
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-2">
                                {navigation.map((item) => {
                                    const isCurrent = pathname === item.href;
                                    const IconComponent = item.icon;
                                    
                                    return (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            aria-current={isCurrent ? "page" : undefined}
                                            className={classNames(
                                                isCurrent
                                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white hover:translate-x-1",
                                                "group relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out flex items-center justify-between gap-3 min-w-[180px] overflow-hidden"
                                            )}
                                            onClick={closeDropdowns}
                                        >
                                            {/* Hover effect background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            <div className="flex items-center gap-3 relative z-10">
                                                <IconComponent className="h-5 w-5 opacity-80" />
                                                <span>{item.name}</span>
                                            </div>
                                            
                                            <div className="relative z-10">
                                                {getStatusBadge(item.status)}
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Right side actions */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 gap-2">
                        {/* Notification dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('notifications')}
                                className="relative rounded-lg bg-white/10 p-2 text-slate-400 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">View notifications</span>
                                <BellIcon aria-hidden="true" className="size-5" />
                                {/* Notification badge */}
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </button>
                            
                            <Transition
                                show={activeDropdown === 'notifications'}
                                enter="transition duration-200 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-150 ease-in"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-slate-800/95 backdrop-blur-xl shadow-xl ring-1 ring-white/10 border border-white/10">
                                    <div className="py-2">
                                        <div className="px-4 py-2 border-b border-white/10">
                                            <h3 className="text-sm font-semibold text-white">Notifications</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            <div className="px-4 py-3 hover:bg-white/5 transition-colors duration-150">
                                                <p className="text-sm text-slate-300">New user registered</p>
                                                <p className="text-xs text-slate-400 mt-1">2 minutes ago</p>
                                            </div>
                                            <div className="px-4 py-3 hover:bg-white/5 transition-colors duration-150">
                                                <p className="text-sm text-slate-300">Dashboard updated successfully</p>
                                                <p className="text-xs text-slate-400 mt-1">1 hour ago</p>
                                            </div>
                                            <div className="px-4 py-3 hover:bg-white/5 transition-colors duration-150">
                                                <p className="text-sm text-slate-300">System maintenance scheduled</p>
                                                <p className="text-xs text-slate-400 mt-1">3 hours ago</p>
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 border-t border-white/10">
                                            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-150">
                                                View all notifications
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </div>

                        {/* Profile dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('profile')}
                                className="relative flex rounded-lg bg-white/10 p-1.5 text-slate-400 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Open user menu</span>
                                <UserCircleIcon aria-hidden="true" className="size-6" />
                            </button>
                            
                            <Transition
                                show={activeDropdown === 'profile'}
                                enter="transition duration-200 ease-out"
                                enterFrom="transform scale-95 opacity-0"
                                enterTo="transform scale-100 opacity-100"
                                leave="transition duration-150 ease-in"
                                leaveFrom="transform scale-100 opacity-100"
                                leaveTo="transform scale-95 opacity-0"
                            >
                                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-slate-800/95 backdrop-blur-xl shadow-xl ring-1 ring-white/10 border border-white/10">
                                    <div className="py-2">
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-150"
                                        >
                                            Your Profile
                                        </a>
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-150"
                                        >
                                            Settings
                                        </a>
                                        <div className="border-t border-white/10 my-1"></div>
                                        <button
                                            onClick={() => signOut({ callbackUrl: "/login" })}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors duration-150"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <Transition
                show={activeDropdown === 'mobile'}
                enter="transition duration-200 ease-out"
                enterFrom="transform scale-y-0 opacity-0"
                enterTo="transform scale-y-100 opacity-100"
                leave="transition duration-150 ease-in"
                leaveFrom="transform scale-y-100 opacity-100"
                leaveTo="transform scale-y-0 opacity-0"
            >
                <div className="origin-top absolute top-full left-0 w-full z-50 bg-slate-800/95 backdrop-blur-xl border-b border-white/10 sm:hidden">
                    <div className="space-y-2 px-4 pt-4 pb-4">
                        {navigation.map((item) => {
                            const isCurrent = pathname === item.href;
                            const IconComponent = item.icon;
                            
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    aria-current={isCurrent ? "page" : undefined}
                                    className={classNames(
                                        isCurrent
                                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                            : "text-slate-300 hover:bg-white/10 hover:text-white",
                                        "group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200"
                                    )}
                                    onClick={closeDropdowns}
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComponent className="h-5 w-5 opacity-80" />
                                        <span>{item.name}</span>
                                    </div>
                                    {getStatusBadge(item.status)}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </Transition>
        </nav>
    )
}