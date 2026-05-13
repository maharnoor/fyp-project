import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-middleware'

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const MODEL = 'meta/llama-3.1-8b-instruct'

export async function POST(request) {
    const { user, error, status } = await requireAuth(request)
    if (error) return NextResponse.json({ error }, { status })

    try {
        const { answers } = await request.json()
        const isFirstQuestion = !answers || answers.length === 0

        let SYSTEM_PROMPT = ''
        if (isFirstQuestion) {
            SYSTEM_PROMPT = `You are an AI career counselor for high-school students in Pakistan. 
Generate exactly 1 random, broad multiple-choice question to begin assessing the student's career interests.
The question MUST have exactly 4 options.
Each option MUST be associated with one of these field tags: 'cs', 'medical', 'business', 'arts', 'engineering'. Ensure the field tag logically matches the option's nature.

You MUST respond ONLY with a valid JSON array containing exactly 1 question object. Do not wrap it in markdown block quotes. Do not include any explanations.
Format strictly as:
[
  {
    "id": "ai_q_1",
    "question": "Your question text here...",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "fieldTags": ["cs", "business", "arts", "engineering"]
  }
]`
        } else {
            const history = answers.map((a, i) => `Q${i + 1}: ${a.questionText}\nStudent chose: ${a.selectedOptionText}`).join('\n\n')

            SYSTEM_PROMPT = `You are an AI career counselor for high-school students in Pakistan. 
The student has answered the following career exploration questions:
${history}

Based on their answers, generate exactly 1 follow-up multiple-choice question that builds upon their interests to further narrow down their career path.
The question MUST have exactly 4 options.
Each option MUST be associated with one of these field tags: 'cs', 'medical', 'business', 'arts', 'engineering'. Ensure the field tag logically matches the option's nature.

You MUST respond ONLY with a valid JSON array containing exactly 1 question object. Do not wrap it in markdown block quotes. Do not include any explanations.
Format strictly as:
[
  {
    "id": "ai_q_next",
    "question": "Your follow-up question text here...",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "fieldTags": ["cs", "business", "arts", "engineering"]
  }
]`
        }

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
                    { role: 'user', content: 'Generate the next personalized question now.' },
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        })

        if (!res.ok) {
            console.error('Nvidia API error:', res.status)
            return NextResponse.json({ error: 'Failed to generate question from AI' }, { status: 500 })
        }

        const data = await res.json()
        const rawContent = data.choices?.[0]?.message?.content || ''

        let jsonStr = rawContent.trim()
        
        // Use regex to extract the JSON array, ignoring any surrounding text the AI might add
        const jsonMatch = jsonStr.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
            jsonStr = jsonMatch[0]
        }

        const parsedQuestions = JSON.parse(jsonStr)

        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
            throw new Error('Invalid JSON format returned by AI')
        }

        const validQuestions = parsedQuestions.filter(q => 
            q.id && q.question && 
            Array.isArray(q.options) && q.options.length === 4 &&
            Array.isArray(q.fieldTags) && q.fieldTags.length === 4
        )

        if (validQuestions.length === 0) {
            throw new Error('No valid questions parsed from AI')
        }

        // Add a timestamp id to ensure uniqueness in the client
        validQuestions[0].id = 'ai_q_' + Date.now()

        return NextResponse.json({ questions: validQuestions })

    } catch (err) {
        console.error('AI Quiz Generation Error:', err)
        return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
    }
}
