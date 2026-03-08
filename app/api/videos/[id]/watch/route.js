import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'

// Mark video as watched
export async function POST(request, { params }) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    await prisma.videoWatch.upsert({
        where: { userId_videoId: { userId: user.id, videoId: params.id } },
        update: { watchedAt: new Date() },
        create: { userId: user.id, videoId: params.id },
    })

    return NextResponse.json({ message: 'Video marked as watched' })
}
