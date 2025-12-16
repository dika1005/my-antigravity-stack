'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts'

export function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuthContext()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await logout()
        setDropdownOpen(false)
        router.push('/')
    }

    return (
        <header 
            className={`
                sticky top-0 z-50 transition-all duration-500 ease-out
                ${scrolled 
                    ? 'bg-black/80 backdrop-blur-2xl shadow-2xl shadow-black/50 border-b border-white/5' 
                    : 'bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm'
                }
            `}
        >
            <div className="max-w-[1920px] mx-auto">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    
                    {/* Logo Section */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group shrink-0"
                    >
                        {/* Logo Image */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                <Image
                                    src="/logo.png"
                                    alt="Marlboro Gallery"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            </div>
                        </div>
                        
                        {/* Logo Text */}
                        <div className="hidden sm:flex flex-col">
                            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                                Marlboro
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase -mt-0.5">
                                Gallery
                            </span>
                        </div>
                    </Link>

                    {/* Search Bar - Center */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-6 lg:mx-12">
                        <div 
                            className={`
                                relative w-full transition-all duration-300
                                ${searchFocused ? 'scale-[1.02]' : 'scale-100'}
                            `}
                        >
                            {/* Search Glow Effect */}
                            <div 
                                className={`
                                    absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-pink-500/20 blur-xl transition-opacity duration-300
                                    ${searchFocused ? 'opacity-100' : 'opacity-0'}
                                `}
                            />
                            
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search images, galleries, users..."
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className={`
                                        w-full px-5 py-3 pl-12 rounded-2xl 
                                        bg-white/[0.03] hover:bg-white/[0.06]
                                        border border-white/[0.08] hover:border-white/[0.12]
                                        text-white text-sm placeholder-gray-500
                                        focus:outline-none focus:bg-white/[0.08] focus:border-violet-500/50
                                        transition-all duration-300
                                    `}
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <SearchIcon className={`w-4 h-4 transition-colors duration-300 ${searchFocused ? 'text-violet-400' : 'text-gray-500'}`} />
                                </div>
                                
                                {/* Search shortcut hint */}
                                <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${searchFocused ? 'opacity-0' : 'opacity-100'}`}>
                                    <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-500 font-mono">
                                        ⌘K
                                    </kbd>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Mobile Search Button */}
                        <button className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                            <SearchIcon className="w-5 h-5" />
                        </button>

                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                            </div>
                        ) : isAuthenticated && user ? (
                            <>
                                {/* Notifications Bell */}
                                <button className="hidden sm:flex relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200">
                                    <BellIcon className="w-5 h-5" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 ring-2 ring-black" />
                                </button>

                                {/* Upload Button */}
                                <Link
                                    href="/upload"
                                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white text-sm font-medium 
                                    hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 
                                    transition-all duration-300 
                                    shadow-lg shadow-violet-500/25 hover:shadow-fuchsia-500/40
                                    hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    <span>Upload</span>
                                </Link>

                                {/* User Avatar Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className={`
                                            flex items-center gap-2 p-1 rounded-xl transition-all duration-200
                                            ${dropdownOpen ? 'bg-white/10' : 'hover:bg-white/5'}
                                        `}
                                    >
                                        <div className="relative">
                                            {user.avatar ? (
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name || 'User'}
                                                    width={38}
                                                    height={38}
                                                    className="rounded-xl ring-2 ring-white/10 object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-[38px] h-[38px] rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white/10">
                                                    {(user.name || user.email)[0].toUpperCase()}
                                                </div>
                                            )}
                                            {/* Online indicator */}
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                                        </div>
                                        <ChevronDownIcon className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-gray-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                            {/* User Info Header */}
                                            <div className="p-4 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border-b border-white/5">
                                                <div className="flex items-center gap-3">
                                                    {user.avatar ? (
                                                        <Image
                                                            src={user.avatar}
                                                            alt={user.name || 'User'}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-xl ring-2 ring-white/10"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                                                            {(user.name || user.email)[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-semibold truncate">{user.name || 'User'}</p>
                                                        <p className="text-gray-400 text-sm truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                                        <UserIcon className="w-4 h-4 text-violet-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">My Profile</p>
                                                        <p className="text-xs text-gray-500">View your public profile</p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
                                                        <GridIcon className="w-4 h-4 text-fuchsia-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">My Galleries</p>
                                                        <p className="text-xs text-gray-500">Manage your collections</p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    href="/bookmarks"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                                        <BookmarkIcon className="w-4 h-4 text-pink-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Saved</p>
                                                        <p className="text-xs text-gray-500">Your bookmarked images</p>
                                                    </div>
                                                </Link>
                                                <Link
                                                    href="/settings"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center">
                                                        <SettingsIcon className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Settings</p>
                                                        <p className="text-xs text-gray-500">Account preferences</p>
                                                    </div>
                                                </Link>
                                            </div>

                                            {/* Logout */}
                                            <div className="p-2 border-t border-white/5">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                                                >
                                                    <LogoutIcon className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 text-sm bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white rounded-xl font-medium 
                                    hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 
                                    transition-all duration-300 
                                    shadow-lg shadow-violet-500/25 hover:shadow-fuchsia-500/40
                                    hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

// Icons
function SearchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    )
}

function BellIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    )
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    )
}

function ChevronDownIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )
}

function UserIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    )
}

function GridIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    )
}

function BookmarkIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
    )
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )
}

function LogoutIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    )
}
