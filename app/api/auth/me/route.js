import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true, name: true, email: true, role: true, createdAt: true,
            _count: {
                select: {
                    quizResults: true,
                    recommendations: true,
                    videoWatched: true,
                }
            }
        }
    })

    return NextResponse.json({ user: fullUser })
}

export async function PATCH(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    const { name } = await request.json()

    const updated = await prisma.user.update({
        where: { id: user.id },
        data: { name },
        select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ user: updated })
}
