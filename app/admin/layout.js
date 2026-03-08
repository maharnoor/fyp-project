'use client'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { LoadingSpinner } from '@/components/ui/Cards'

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login')
            } else if (user.role !== 'admin') {
                router.push('/dashboard')
            }
        }
    }, [user, loading, router])

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
                <LoadingSpinner size="lg" />
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
