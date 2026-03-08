import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-middleware'

// PUT update video (admin only)
export async function PUT(request, { params }) {
    const { error, status } = await requireAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const { title, description, category, url, thumbnail, duration } = await request.json()

    const video = await prisma.video.update({
        where: { id: params.id },
        data: { title, description, category, url, thumbnail, duration },
    })

    return NextResponse.json({ video })
}

// DELETE video (admin only)
export async function DELETE(request, { params }) {
    const { error, status } = await requireAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    await prisma.video.delete({ where: { id: params.id } })

    return NextResponse.json({ message: 'Video deleted' })
}
