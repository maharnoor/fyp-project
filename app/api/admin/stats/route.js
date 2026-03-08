import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'

// GET admin stats
export async function GET(request) {
    const { error, status } = await requireAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const [totalStudents, totalVideos, totalQuizResults, totalRecommendations] = await Promise.all([
        prisma.user.count({ where: { role: 'student' } }),
        prisma.video.count(),
        prisma.quizResult.count(),
        prisma.recommendation.count(),
    ])

    const recentStudents = await prisma.user.findMany({
        where: { role: 'student' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
    })

    const fieldDistribution = await prisma.quizResult.groupBy({
        by: ['recommendedField'],
        _count: { recommendedField: true },
    })

    return NextResponse.json({
        stats: { totalStudents, totalVideos, totalQuizResults, totalRecommendations },
        recentStudents,
        fieldDistribution,
    })
}
