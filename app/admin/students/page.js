'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Users, Search, Trophy, Brain, Play } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/Cards'

export default function AdminStudentsPage() {
    const { token } = useAuth()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function fetchStudents() {
            try {
                const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
                const data = await res.json()
                setStudents(data.users || [])
            } catch { }
            finally { setLoading(false) }
        }
        if (token) fetchStudents()
    }, [token])

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Students</h1>
                    <p className="text-gray-400 mt-1">{students.length} registered students</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-10"
                />
            </div>

            {/* Students Table */}
            {loading ? (
                <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Student', 'Email', 'Joined', 'Videos', 'Quizzes', 'Recs'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filtered.map((student) => (
                                    <tr key={student.id} className="hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                    {student.name?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-white">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{student.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-zinc-300">
                                                <Play size={13} /> {student._count?.videoWatched || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-amber-400">
                                                <Trophy size={13} /> {student._count?.quizResults || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-zinc-300">
                                                <Brain size={13} /> {student._count?.recommendations || 0}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="text-center py-16">
                                <Users size={36} className="text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500">No students found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
