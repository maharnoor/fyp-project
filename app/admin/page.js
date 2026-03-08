'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { StatCard, LoadingSpinner } from '@/components/ui/Cards'
import { Users, Video, Trophy, Brain, TrendingUp, Calendar } from 'lucide-react'
import { CAREER_FIELDS } from '@/lib/recommendation'

export default function AdminDashboard() {
    const { token } = useAuth()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const d = await res.json()
                setData(d)
            } catch { }
            finally { setLoading(false) }
        }
        if (token) fetchStats()
    }, [token])

    if (loading) {
        return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
    }

    const { stats, recentStudents, fieldDistribution } = data || {}

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Admin Dashboard
                </h1>
                <p className="text-gray-400 mt-1">MindField platform overview and analytics</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Students" value={stats?.totalStudents || 0} color="indigo" />
                <StatCard icon={Video} label="Total Videos" value={stats?.totalVideos || 0} color="violet" />
                <StatCard icon={Trophy} label="Quiz Attempts" value={stats?.totalQuizResults || 0} color="amber" />
                <StatCard icon={Brain} label="Recommendations" value={stats?.totalRecommendations || 0} color="emerald" />
            </div>

            {/* Field Distribution */}
            {fieldDistribution && fieldDistribution.length > 0 && (
                <div className="card">
                    <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <TrendingUp size={18} className="text-indigo-400" /> Recommended Fields Distribution
                    </h2>
                    <div className="space-y-4">
                        {fieldDistribution.map((item) => {
                            const fd = CAREER_FIELDS[item.recommendedField]
                            const total = fieldDistribution.reduce((a, b) => a + b._count.recommendedField, 0)
                            const pct = total > 0 ? Math.round((item._count.recommendedField / total) * 100) : 0
                            return (
                                <div key={item.recommendedField} className="flex items-center gap-4">
                                    <span className="text-xl w-8">{fd?.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-300">{fd?.name || item.recommendedField}</span>
                                            <span className="text-sm text-gray-400">{item._count.recommendedField} students</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-400 w-10 text-right">{pct}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Recent Students */}
            <div className="card">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-400" /> Recent Students
                </h2>
                {recentStudents?.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {recentStudents.map((student) => (
                            <div key={student.id} className="py-3 flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {student.name?.[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.email}</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {new Date(student.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No students yet. Share the platform!</p>
                )}
            </div>
        </div>
    )
}
