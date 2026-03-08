'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Trophy } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/Cards'
import { CAREER_FIELDS } from '@/lib/recommendation'

export default function AdminResultsPage() {
    const { token } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetch_() {
            try {
                const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
                const data = await res.json()
                setUsers(data.users || [])
            } catch { }
            finally { setLoading(false) }
        }
        if (token) fetch_()
    }, [token])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Quiz Results</h1>
                <p className="text-gray-400 mt-1">Overview of student quiz activity</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Student', 'Quizzes Taken', 'Videos', 'Recommendations', 'Joined'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {user.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-amber-400">{user._count?.quizResults || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-indigo-400">{user._count?.videoWatched || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-violet-400">{user._count?.recommendations || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && (
                            <div className="text-center py-16">
                                <Trophy size={36} className="text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500">No students have taken quizzes yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
