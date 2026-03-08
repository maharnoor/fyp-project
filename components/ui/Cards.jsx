'use client'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function StatCard({ icon: Icon, label, value, change, color = 'indigo', suffix = '' }) {
    const colorMap = {
        indigo: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', icon: '#6366f1', text: '#a5b4fc' },
        emerald: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', icon: '#10b981', text: '#6ee7b7' },
        violet: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', icon: '#8b5cf6', text: '#c4b5fd' },
        amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', icon: '#f59e0b', text: '#fcd34d' },
        cyan: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', icon: '#06b6d4', text: '#67e8f9' },
        rose: { bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.2)', icon: '#f43f5e', text: '#fda4af' },
    }
    const c = colorMap[color] || colorMap.indigo

    return (
        <div className="card group animate-fade-up" style={{ background: '#111827', borderColor: c.border }}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl" style={{ background: c.bg }}>
                    <Icon size={22} style={{ color: c.icon }} />
                </div>
                {change !== undefined && (
                    <span className="text-xs font-medium flex items-center gap-1" style={{ color: change >= 0 ? '#10b981' : '#f43f5e' }}>
                        {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(change)}%
                    </span>
                )}
            </div>
            <p className="text-3xl font-bold text-white mb-1">
                {value}{suffix}
            </p>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    )
}

export function ProgressCard({ label, value, max, color = '#6366f1' }) {
    const percentage = max > 0 ? Math.round((value / max) * 100) : 0
    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300 font-medium">{label}</span>
                    <span className="text-sm text-gray-400">{value}/{max}</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${percentage}%`, background: color }} />
                </div>
            </div>
            <span className="text-sm font-bold text-white w-10 text-right">{percentage}%</span>
        </div>
    )
}

export function Badge({ children, color = 'indigo' }) {
    const colorMap = {
        indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
        gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    }
    return (
        <span className={`badge border text-xs ${colorMap[color] || colorMap.indigo}`}>
            {children}
        </span>
    )
}

export function LoadingSpinner({ size = 'md' }) {
    const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
    return (
        <div className={`${sizes[size]} border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin`} />
    )
}

export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-5 rounded-2xl bg-indigo-500/10 mb-6">
                <Icon size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 mb-8 max-w-sm">{description}</p>
            {action}
        </div>
    )
}
