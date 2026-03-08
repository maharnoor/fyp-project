import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth-middleware'

// GET all quiz questions
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const field = searchParams.get('field')

    const questions = await prisma.quizQuestion.findMany({
        where: field ? { fieldTag: field } : {},
        orderBy: { id: 'asc' },
    })

    return NextResponse.json({ questions })
}

// POST create question (admin)
export async function POST(request) {
    const { error, status } = await requireAdmin(request)
    if (error) return NextResponse.json({ error }, { status })

    const { question, option1, option2, option3, option4, correctAnswer, fieldTag, weight } = await request.json()

    const q = await prisma.quizQuestion.create({
        data: { question, option1, option2, option3, option4, correctAnswer, fieldTag, weight: weight || 1 },
    })

    return NextResponse.json({ question: q }, { status: 201 })
}
