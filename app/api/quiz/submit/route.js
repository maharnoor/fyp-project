import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-middleware'
import { calculateRecommendations } from '@/lib/recommendation'

// Submit quiz and get recommendation
export async function POST(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    const { answers, totalQuestions } = await request.json()

    if (!answers || !Array.isArray(answers)) {
        return NextResponse.json({ error: 'Answers array required' }, { status: 400 })
    }

    // Calculate score and recommendations based on the raw answers
    const recommendations = calculateRecommendations(answers)
    const topField = recommendations[0]?.field || 'cs'

    // Calculate a score (percentage)
    const score = recommendations[0]?.confidence || 0

    // Save quiz result
    const quizResult = await prisma.quizResult.create({
        data: {
            userId: user.id,
            score,
            totalQuestions: totalQuestions || answers.length,
            answers: answers,
            recommendedField: topField,
        },
    })

    // Save detailed recommendations
    const recommendation = await prisma.recommendation.create({
        data: {
            userId: user.id,
            fields: recommendations,
            quizResultId: quizResult.id,
        },
    })

    return NextResponse.json({
        quizResult,
        recommendations,
        recommendation,
    })
}

// GET user's quiz history
export async function GET(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    const results = await prisma.quizResult.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
    })

    return NextResponse.json({ results })
}
