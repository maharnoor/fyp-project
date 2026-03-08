'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { StatCard, LoadingSpinner } from '@/components/ui/Cards'
import {
    Play, Brain, Trophy, BookOpen, MessageSquare,
    ChevronRight, Sparkles, Target, TrendingUp, Clock
} from 'lucide-react'
import { CAREER_FIELDS } from '@/lib/recommendation'

export default function DashboardPage() {
    const { user, token } = useAuth()
    const [stats, setStats] = useState(null)
    const [recentRec, setRecentRec] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [profileRes, recRes] = await Promise.all([
                    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/recommendations', { headers: { Authorization: `Bearer ${token}` } }),
                ])

                const profileData = await profileRes.json()
                const recData = await recRes.json()

                setStats(profileData.user?._count || {})
                setRecentRec(recData.recommendations?.[0] || null)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (token) fetchData()
    }, [token])

    const topFields = recentRec?.fields || []

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <LoadingSpinner size="lg" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                        Welcome back, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-400">
                        {recentRec ? 'Your career journey is in progress.' : 'Start your career discovery journey today.'}
                    </p>
                </div>
                <Link href="/dashboard/quiz" className="btn-primary hidden md:flex">
                    <Target size={16} /> Take Quiz
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Play} label="Videos Watched" value={stats?.videoWatched || 0} color="indigo" />
                <StatCard icon={Trophy} label="Quizzes Taken" value={stats?.quizResults || 0} color="amber" />
                <StatCard icon={Brain} label="Recommendations" value={stats?.recommendations || 0} color="violet" />
                <StatCard icon={TrendingUp} label="Progress" value={Math.min((stats?.quizResults || 0) * 25, 100)} suffix="%" color="emerald" />
            </div>

            {/* Recommendation Banner */}
            {recentRec && topFields.length > 0 ? (
                <div className="relative rounded-2xl overflow-hidden p-6"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
                        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={18} className="text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-300">Your Latest AI Recommendation</span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {topFields.slice(0, 3).map((rec, i) => {
                                const fieldData = CAREER_FIELDS[rec.field]
                                return (
                                    <div key={i} className="glass rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">{fieldData?.icon}</span>
                                            <div>
                                                <p className="text-sm font-bold text-white">{fieldData?.name}</p>
                                                <p className="text-xs text-indigo-400">{rec.confidence}% match</p>
                                            </div>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${rec.confidence}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <Link href="/dashboard/recommendations" className="btn-secondary mt-4 inline-flex"
                            style={{ padding: '8px 20px', fontSize: '13px' }}>
                            View Full Analysis <ChevronRight size={14} />
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-2xl overflow-hidden p-8 text-center"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <Brain size={48} className="text-indigo-400 mx-auto mb-4 animate-float" />
                    <h3 className="text-xl font-bold text-white mb-2">No Recommendation Yet</h3>
                    <p className="text-gray-400 mb-6">Take our AI quiz to get personalized career field recommendations based on your interests.</p>
                    <Link href="/dashboard/quiz" className="btn-primary">
                        <Target size={16} /> Start Quiz Now
                    </Link>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: Target, label: 'Take AI Quiz', desc: 'Get career recommendations', href: '/dashboard/quiz', color: 'indigo' },
                        { icon: Play, label: 'Watch Videos', desc: 'Career guidance videos', href: '/dashboard/videos', color: 'violet' },
                        { icon: MessageSquare, label: 'Ask MindBot', desc: 'AI career chatbot', href: '/dashboard/chatbot', color: 'cyan' },
                        { icon: BookOpen, label: 'Book List', desc: 'Recommended books', href: '/dashboard/books', color: 'emerald' },
                    ].map((item, i) => {
                        const Icon = item.icon
                        const colorMap = {
                            indigo: { bg: 'rgba(99,102,241,0.1)', icon: '#6366f1' },
                            violet: { bg: 'rgba(139,92,246,0.1)', icon: '#8b5cf6' },
                            cyan: { bg: 'rgba(6,182,212,0.1)', icon: '#06b6d4' },
                            emerald: { bg: 'rgba(16,185,129,0.1)', icon: '#10b981' },
                        }
                        const c = colorMap[item.color]
                        return (
                            <Link key={i} href={item.href} className="card glass-hover">
                                <div className="p-2.5 rounded-xl w-fit mb-3" style={{ background: c.bg }}>
                                    <Icon size={20} style={{ color: c.icon }} />
                                </div>
                                <p className="font-semibold text-white text-sm mb-0.5">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Getting Started Checklist */}
            <div className="card">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <Clock size={18} className="text-indigo-400" /> Your Progress Checklist
                </h2>
                <div className="space-y-3">
                    {[
                        { done: true, label: 'Created your account', href: null },
                        { done: (stats?.quizResults || 0) > 0, label: 'Completed the AI career quiz', href: '/dashboard/quiz' },
                        { done: (stats?.recommendations || 0) > 0, label: 'Received career recommendations', href: '/dashboard/recommendations' },
                        { done: (stats?.videoWatched || 0) > 0, label: 'Watched a career guidance video', href: '/dashboard/videos' },
                        { done: false, label: 'Chatted with MindBot', href: '/dashboard/chatbot' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: item.done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)' }}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-500' : 'border-2 border-gray-600'}`}>
                                {item.done && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className={`text-sm ${item.done ? 'text-gray-300 line-through' : 'text-gray-400'}`}>{item.label}</span>
                            {!item.done && item.href && (
                                <Link href={item.href} className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium">
                                    Start <ChevronRight size={12} />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
