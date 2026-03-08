import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    const recommendations = await prisma.recommendation.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
    })

    return NextResponse.json({ recommendations })
}
