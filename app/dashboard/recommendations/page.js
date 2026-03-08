'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { CAREER_FIELDS, BOOK_RECOMMENDATIONS } from '@/lib/recommendation'
import { LoadingSpinner, EmptyState } from '@/components/ui/Cards'
import { Brain, Sparkles, BookOpen, Star, ExternalLink, Target, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

export default function RecommendationsPage() {
    const { token } = useAuth()
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(0) // which recommendation is expanded

    useEffect(() => {
        async function fetchRecs() {
            try {
                const res = await fetch('/api/recommendations', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                setRecommendations(data.recommendations || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (token) fetchRecs()
    }, [token])

    if (loading) {
        return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
    }

    if (recommendations.length === 0) {
        return (
            <EmptyState
                icon={Brain}
                title="No Recommendations Yet"
                description="Take our AI quiz to discover which career fields best match your interests and abilities."
                action={<Link href="/dashboard/quiz" className="btn-primary"><Target size={16} /> Take Quiz Now</Link>}
            />
        )
    }

    const latestRec = recommendations[0]
    const fields = latestRec?.fields || []

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={20} className="text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">AI Analysis</span>
                </div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Your Career Recommendations
                </h1>
                <p className="text-gray-400 mt-1">Based on your quiz responses — updated {new Date(latestRec.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Top Recommendation Hero */}
            {fields[0] && (() => {
                const top = fields[0]
                const fd = CAREER_FIELDS[top.field]
                return (
                    <div className="relative rounded-2xl overflow-hidden p-8"
                        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
                            style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
                        <div className="relative z-10 flex items-start gap-6">
                            <span className="text-6xl animate-float">{fd?.icon}</span>
                            <div className="flex-1">
                                <span className="badge mb-3" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                                    🏆 Best Match — {top.confidence}% confidence
                                </span>
                                <h2 className="text-2xl font-bold text-white mb-2">{fd?.name}</h2>
                                <p className="text-gray-300 leading-relaxed mb-4">{fd?.description}</p>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <div className="glass rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">💰 Salary Range</p>
                                        <p className="text-sm font-semibold text-white">{fd?.salary}</p>
                                    </div>
                                    <div className="glass rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">📈 Job Growth</p>
                                        <p className="text-sm font-semibold text-white">{fd?.growth}</p>
                                    </div>
                                    <div className="glass rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">📚 Key Subjects</p>
                                        <p className="text-sm font-semibold text-white">{fd?.subjects?.slice(0, 2).join(', ')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })()}

            {/* All Field Matches */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">All Career Matches</h2>
                <div className="space-y-4">
                    {fields.map((rec, i) => {
                        const fd = CAREER_FIELDS[rec.field]
                        const isExpanded = expanded === i
                        return (
                            <div key={i} className="card transition-all" style={{
                                border: i === 0 ? '1px solid rgba(99,102,241,0.3)' : undefined
                            }}>
                                <button className="w-full flex items-center gap-4 text-left" onClick={() => setExpanded(isExpanded ? -1 : i)}>
                                    <span className="text-3xl">{fd?.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white">{fd?.name}</h3>
                                                {i === 0 && <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                                    style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>Top Pick</span>}
                                            </div>
                                            <span className="text-sm font-bold text-indigo-400">{rec.confidence}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${rec.confidence}%` }} />
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                                </button>

                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-fade-up">
                                        <p className="text-sm text-gray-400 leading-relaxed">{rec.explanation}</p>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Top Universities</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {fd?.universities?.map((u, j) => (
                                                        <span key={j} className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>{u}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Required Subjects</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {fd?.subjects?.map((s, j) => (
                                                        <span key={j} className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Books for this field */}
                                        <div>
                                            <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider flex items-center gap-1">
                                                <BookOpen size={12} /> Recommended Books
                                            </p>
                                            <div className="grid sm:grid-cols-2 gap-2">
                                                {(BOOK_RECOMMENDATIONS[rec.field] || []).slice(0, 2).map((book, j) => (
                                                    <div key={j} className="p-3 rounded-xl flex items-start gap-2"
                                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                        <Star size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-white">{book.title}</p>
                                                            <p className="text-xs text-gray-500">{book.author}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Retake */}
            <div className="text-center pt-4">
                <p className="text-sm text-gray-500 mb-4">Want more accurate results? Retake the quiz!</p>
                <Link href="/dashboard/quiz" className="btn-secondary">
                    <Target size={16} /> Retake Quiz
                </Link>
            </div>
        </div>
    )
}
