'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
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
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Login failed')
                return
            }

            login(data.user, data.token)
            router.push(data.user.role === 'admin' ? '/admin' : '/dashboard')
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: '#0a0a0f' }}>
            {/* Background glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center animate-pulse-glow">
                            <Brain size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>MindField</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-gray-400">Sign in to continue your career journey</p>
                </div>

                {/* Form */}
                <div className="card" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {error && (
                        <div className="mb-4 p-3 rounded-xl text-sm text-red-400 flex items-center gap-2"
                            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="student@example.com"
                                    required
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center text-base"
                            style={{ padding: '14px' }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight size={18} />
                                </span>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300">
                            Sign up for free
                        </Link>
                    </p>
                </div>

                {/* Demo credentials hint */}
                <div className="mt-4 p-4 rounded-xl text-sm text-center"
                    style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <p className="text-gray-400">
                        <span className="text-indigo-400 font-semibold">💡 Tip:</span> Set up an admin account by
                        using <span className="font-mono text-indigo-400">admin@mindfield.pk</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
