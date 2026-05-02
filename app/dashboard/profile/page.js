'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Calendar, Trophy, Play, Brain, Save, CheckCircle, Shield, GraduationCap } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/Cards'

export default function ProfilePage() {
    const { user, token, login } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                setProfile(data.user)
                setName(data.user?.name || '')
            } catch { }
            finally { setLoading(false) }
        }
        if (token) fetchProfile()
    }, [token])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name }),
            })
            const data = await res.json()
            if (res.ok) {
                login(data.user, token)
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            }
        } catch { }
        finally { setSaving(false) }
    }

    if (loading) {
        return <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
    }

    return (
        <div className="max-w-2xl space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    My Profile
                </h1>
                <p className="text-gray-400 mt-1">Manage your account information</p>
            </div>

            {/* Avatar + Stats */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold">
                        {profile?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                        <p className="text-gray-400">{profile?.email}</p>
                        <span className="badge mt-2 inline-flex items-center gap-1.5" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                            {profile?.role === 'admin'
                                ? <><Shield size={12} /> Admin</>
                                : <><GraduationCap size={12} /> Student</>}
                        </span>
                    </div>
                </div>

                {profile?._count && (
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                        {[
                            { icon: Play, label: 'Videos Watched', value: profile._count.videoWatched, color: '#6366f1' },
                            { icon: Trophy, label: 'Quiz Attempts', value: profile._count.quizResults, color: '#f59e0b' },
                            { icon: Brain, label: 'Recommendations', value: profile._count.recommendations, color: '#8b5cf6' },
                        ].map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <div key={i} className="text-center">
                                    <Icon size={18} className="mx-auto mb-1" style={{ color: stat.color }} />
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-gray-400">{stat.label}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Edit Profile */}
            <div className="card">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <User size={18} className="text-indigo-400" /> Edit Profile
                </h2>

                {saved && (
                    <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm text-emerald-400"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <CheckCircle size={16} /> Profile updated successfully!
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input
                            id="profile-name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={profile?.email || ''}
                            disabled
                            className="input-field opacity-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                        <div className="input-field flex items-center gap-2 opacity-50 cursor-not-allowed">
                            <Calendar size={16} className="text-gray-500" />
                            {new Date(profile?.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <button
                        id="profile-save"
                        onClick={handleSave}
                        disabled={saving || name === profile?.name}
                        className="btn-primary"
                        style={{ opacity: (saving || name === profile?.name) ? '0.5' : '1' }}
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save size={16} /> Save Changes
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
