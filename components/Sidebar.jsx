'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
    Home, BookOpen, Play, Brain, MessageSquare, User,
    Settings, LogOut, Menu, X, Star, ChevronRight,
    LayoutDashboard, Users, Video, HelpCircle
} from 'lucide-react'

const studentNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Play, label: 'Videos', href: '/dashboard/videos' },
    { icon: HelpCircle, label: 'Quiz', href: '/dashboard/quiz' },
    { icon: Brain, label: 'Recommendations', href: '/dashboard/recommendations' },
    { icon: MessageSquare, label: 'AI Chatbot', href: '/dashboard/chatbot' },
    { icon: BookOpen, label: 'Books', href: '/dashboard/books' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
]

const adminNavItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: Video, label: 'Videos', href: '/admin/videos' },
    { icon: HelpCircle, label: 'Quiz Questions', href: '/admin/questions' },
    { icon: Brain, label: 'Results', href: '/admin/results' },
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="p-6 border-b border-white/5">
                <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                        <Brain size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                            MindField
                        </h1>
                        <p className="text-xs text-zinc-300 font-medium">
                            {user?.role === 'admin' ? 'Admin Panel' : 'AI Career Guide'}
                        </p>
                    </div>
                </Link>
            </div>

            {/* User Info */}
            <div className="p-4 mx-3 mt-4 rounded-xl bg-[#0a0a0a] border border-[#262626]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={18} className={isActive ? 'text-zinc-300' : 'text-gray-500'} />
                            <span>{item.label}</span>
                            {isActive && <ChevronRight size={14} className="ml-auto text-zinc-300" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="sidebar-link w-full text-red-400 hover:bg-red-400/10 hover:text-red-300"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 h-screen z-30"
                style={{ background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <SidebarContent />
            </aside>

            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
                style={{ background: '#0d1117', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                        <Brain size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>MindField</span>
                </Link>
                <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white">
                    <Menu size={22} />
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-72 flex flex-col"
                        style={{ background: '#0d1117', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}
        </>
    )
}
