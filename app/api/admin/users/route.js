import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'

// GET all students (admin)
export async function GET(request) {
    const { error, status } = await requireAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const users = await prisma.user.findMany({
        where: { role: 'student' },
        select: {
            id: true, name: true, email: true, createdAt: true,
            _count: {
                select: {
                    quizResults: true,
                    recommendations: true,
                    videoWatched: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
}
