import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth-middleware'

// GET all videos (public)
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const videos = await prisma.video.findMany({
        where: category ? { category } : {},
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ videos })
}

// POST create video (admin only)
export async function POST(request) {
    const { user, error, status } = await requireAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const { title, description, category, url, thumbnail, duration } = await request.json()

    if (!title || !description || !category || !url) {
        return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    const video = await prisma.video.create({
        data: { title, description, category, url, thumbnail, duration },
    })

    return NextResponse.json({ video }, { status: 201 })
}
