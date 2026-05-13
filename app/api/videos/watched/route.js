import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'

export async function GET(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    const watched = await prisma.videoWatch.findMany({
        where: { userId: user.id },
        select: { videoId: true }
    })

    return NextResponse.json({ watched })
}
