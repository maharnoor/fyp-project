import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const MODEL = 'meta/llama-3.1-8b-instruct'

export async function POST(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    try {
        const { answers } = await request.json()

        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json({ error: 'Answers array required' }, { status: 400 })
        }

        // Calculate fields of interest from initial answers
        const fieldCounts = {}
        answers.forEach(a => {
            if (a.fieldTag) {
                fieldCounts[a.fieldTag] = (fieldCounts[a.fieldTag] || 0) + 1
            }
        })
        const interestedFields = Object.keys(fieldCounts).sort((a, b) => fieldCounts[b] - fieldCounts[a]).slice(0, 2)

        const SYSTEM_PROMPT = `You are an AI career counselor generating personalized multiple-choice quiz questions for a student based on their early answers. 
They have shown interest in the following fields: ${interestedFields.join(', ')}.

Generate exactly 5 distinct, engaging multiple-choice questions to help further narrow down their career path.
Each question MUST have exactly 4 options.
Each option MUST be associated with one of these field tags: 'cs', 'medical', 'business', 'arts', 'engineering'. Ensure the field tag logically matches the option's nature.

You MUST respond ONLY with a valid JSON array of objects. Do not wrap it in markdown block quotes. Do not include any explanations.
Format strictly as:
[
  {
    "id": "ai_q1",
    "question": "Your question text here...",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "fieldTags": ["cs", "business", "arts", "engineering"]
  }
]`

        if (!NVIDIA_API_KEY) {
            return NextResponse.json({ error: 'Nvidia API Key not configured' }, { status: 500 })
        }

        const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NVIDIA_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: 'Generate the 5 personalized questions now.' },
                ],
                max_tokens: 1000,
                temperature: 0.7,
            }),
        })

        if (!res.ok) {
            console.error('Nvidia API error:', res.status)
            return NextResponse.json({ error: 'Failed to generate questions from AI' }, { status: 500 })
        }

        const data = await res.json()
        const rawContent = data.choices?.[0]?.message?.content || ''

        // Clean up potential markdown formatting from AI response
        let jsonStr = rawContent.trim()
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim()
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim()
        }

        const parsedQuestions = JSON.parse(jsonStr)

        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
            throw new Error('Invalid JSON format returned by AI')
        }

        // Validate structure
        const validQuestions = parsedQuestions.filter(q => 
            q.id && q.question && 
            Array.isArray(q.options) && q.options.length === 4 &&
            Array.isArray(q.fieldTags) && q.fieldTags.length === 4
        )

        if (validQuestions.length === 0) {
            throw new Error('No valid questions parsed from AI')
        }

        return NextResponse.json({ questions: validQuestions })

    } catch (err) {
        console.error('AI Quiz Generation Error:', err)
        return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
    }
}
