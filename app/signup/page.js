'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react'

const PERKS = [
    'AI-powered career recommendations',
    'Access to 50+ career guidance videos',
    'Interactive quiz & skill assessment',
    'AI Chatbot for career Q&A',
]

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Signup failed')
                return
            }

            login(data.user, data.token)
            router.push('/dashboard')
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative" style={{ background: '#0a0a0f' }}>
            <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

            <div className="w-full max-w-lg relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center">
                            <Brain size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>MindField</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Begin Your Journey</h1>
                    <p className="text-gray-400">Create your free account and find your ideal career path</p>
                </div>

                {/* Perks */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                    {PERKS.map((perk, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                            style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.1)' }}>
                            <CheckCircle size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-gray-300">{perk}</span>
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="card" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {error && (
                        <div className="mb-4 p-3 rounded-xl text-sm text-red-400 flex items-center gap-2"
                            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                            <AlertTriangle size={16} className="flex-shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <div className="relative">
                                <input
                                    id="signup-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ahmad Ali"
                                    required
                                    autoComplete="name"
                                    className="input-field pr-10"
                                />
                                <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    id="signup-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    required
                                    autoComplete="email"
                                    className="input-field pr-10"
                                />
                                <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    id="signup-password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    className="input-field pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {password && (
                                <div className="mt-2 h-1 rounded-full" style={{
                                    background: password.length < 8 ? '#374151' : password.length < 12 ? '#f59e0b' : '#10b981',
                                    width: `${Math.min((password.length / 16) * 100, 100)}%`,
                                    transition: 'all 0.3s ease'
                                }} />
                            )}
                        </div>

                        <button
                            id="signup-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center text-base"
                            style={{ padding: '14px' }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Create Account <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-indigo-400 font-semibold hover:text-indigo-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
