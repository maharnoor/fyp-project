import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireAdmin } from '@/lib/auth-middleware'

// GET all quiz questions (shuffled, up to 10, excluding previously answered)
export async function GET(request) {
    let excludeQuestionIds = []
    
    // Try to get user to exclude their past questions
    const { user, error } = await requireAuth(request).catch(() => ({ error: true }))
    
    if (!error && user) {
        const pastResults = await prisma.quizResult.findMany({
            where: { userId: user.id },
            select: { answers: true }
        })
        
        pastResults.forEach(res => {
            if (Array.isArray(res.answers)) {
                res.answers.forEach(a => {
                    if (a && a.questionId) {
                        excludeQuestionIds.push(a.questionId)
                    }
                })
            }
        })
    }

    const { searchParams } = new URL(request.url)
    const field = searchParams.get('field')

    let whereClause = {}
    if (field) whereClause.fieldTag = field
    if (excludeQuestionIds.length > 0) {
        whereClause.id = { notIn: excludeQuestionIds }
    }

    let allQuestions = await prisma.quizQuestion.findMany({
        where: whereClause,
    })
    
    // If they have exhausted all questions, reset and pick from all questions
    if (allQuestions.length === 0) {
        allQuestions = await prisma.quizQuestion.findMany({
            where: field ? { fieldTag: field } : {}
        })
    }

    // Shuffle and pick 10
    const shuffled = allQuestions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 10)

    return NextResponse.json({ questions: selected })
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
