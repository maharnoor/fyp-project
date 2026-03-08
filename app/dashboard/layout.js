'use client'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { LoadingSpinner } from '@/components/ui/Cards'

export default function DashboardLayout({ children }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-400 mt-4 text-sm">Loading MindField...</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
            <Sidebar />
            <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
                <div className="p-6 lg:p-8 max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    )
}
