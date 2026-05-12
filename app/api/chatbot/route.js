import { NextResponse } from 'next/server'

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY
const MODEL = 'meta/llama-3.1-8b-instruct'

const SYSTEM_PROMPT = `You are MindBot, an AI career guidance assistant specifically for Pakistani students in Pakistan. You help students choose the right academic field after Matric or Intermediate.

Your role:
- Guide students about career fields: Computer Science, Medical, Engineering, Business/Commerce, Arts & Design
- Give advice relevant to Pakistan's education system (Matric, FSc, ICS, ICOM, FA, BSc, etc.)
- Mention Pakistani universities like FAST, NUST, LUMS, UET, AIMC, AKU, IBA, COMSATS, etc.
- Mention entry tests: MDCAT (medical), ECAT (engineering), NUST NET, FAST Entry Test, etc.
- Give salary info in PKR for Pakistani market
- Mention scholarships like HEC, Ehsaas, LUMS NOP, NUST scholarship
- Be encouraging, supportive and concise
- Reply in simple English (you can mix some Urdu words naturally like "yaar", "bilkul", "theek hai")
- Keep responses short and helpful (2-4 paragraphs max)
- Do NOT help with unrelated topics — redirect to career guidance

Always sign off helpful responses with a tip or next step the student can take.`

// Fallback rule-based responses (if API key not set or rate limited)
function getFallbackResponse(message) {
    const msg = message.toLowerCase()

    if (msg.match(/hi|hello|salam|hey|assalam/))
        return "Assalam-o-Alaikum! I'm MindBot, your AI career advisor. I can help you choose the right field after Matric or Intermediate. What's on your mind?"

    if (msg.match(/matric|after matric|10th/))
        return "After Matric, you have great options:\n\n• **FSc Pre-Medical** → Doctor/Dentist/Pharmacy\n• **FSc Pre-Engineering** → Engineering/CS\n• **ICS** → Computer Science/IT\n• **ICOM** → Business/Accounting\n• **FA** → Arts/Design/Law\n\nChoose based on your favourite subjects! Which subjects do you enjoy most?"

    if (msg.match(/intermediate|fsc|after inter|12th/))
        return "After Intermediate (FSc/FA/ICS), you can apply to universities! Key entry tests:\n\n• **MDCAT** → Medical colleges (MBBS/BDS)\n• **ECAT** → Engineering universities\n• **NUST NET / FAST Test** → Top CS/Engg universities\n• **IBA/LUMS** → Business programs\n\nHEC also offers merit-based scholarships. Which field interests you?"

    if (msg.match(/computer|software|cs|coding|programming/))
        return "**Computer Science** is one of the hottest fields in Pakistan!\n\n**Requirements:** ICS or FSc Pre-Engineering\n**Top Universities:** FAST-NUCES, NUST, LUMS, COMSATS, UET\n**Salary:** PKR 80,000–500,000+/month\n**Entry Test:** FAST Entry Test, NUST NET\n\n**Tip:** Start learning Python or web development on YouTube while preparing for entry tests!"

    if (msg.match(/medical|doctor|mbbs|dentist|pharmacy/))
        return "**Medical** is a prestigious and rewarding field!\n\n**Requirements:** FSc Pre-Medical (Biology, Chemistry, Physics)\n**Entry Test:** MDCAT (taken in August/September each year)\n**Top Colleges:** AIMC, KEMU, AKU, Dow Medical, NUMS\n**Duration:** 5 years MBBS + 1 year house job\n**Salary:** PKR 100,000–1,000,000+/month (specialists)\n\n**Tip:** Start MDCAT preparation from 1st year FSc!"

    if (msg.match(/engineer|civil|mechanical|electrical/))
        return "**Engineering** offers excellent career prospects!\n\n**Requirements:** FSc Pre-Engineering\n**Entry Test:** ECAT, NUST NET, UET Test\n**Top Universities:** UET Lahore, NUST, GIKI, NED, COMSATS\n**Salary:** PKR 70,000–400,000+/month\n\n**Tip:** Civil and Electrical Engineering have the most job opportunities in Pakistan right now!"

    if (msg.match(/business|bba|mba|commerce|accounting|finance/))
        return "**Business** is great if you love strategy and leadership!\n\n**Requirements:** ICOM or any background\n**Top Universities:** IBA Karachi, LUMS, FAST, NUST Business School\n**Programs:** BBA (4 years), BCom (2-3 years)\n**Salary:** PKR 60,000–600,000+/month\n\n**Tip:** IBA and LUMS have National Talent Hunt programs with full scholarships!"

    if (msg.match(/arts|design|graphic|architecture|creative/))
        return "**Arts & Design** is a growing field, especially for freelancing!\n\n**Programs:** BFA, BDes, B.Arch\n**Top Universities:** NCA Lahore, Indus Valley, BNU\n**Salary:** PKR 40,000–300,000+/month (freelancers earn in USD!)\n\n**Tip:** Learn Figma, Adobe Suite, or 3D tools on Fiverr/Upwork to start earning while studying!"

    if (msg.match(/scholarship|funding|financial/))
        return "**Scholarships available in Pakistan:**\n\n• **HEC Scholarships** → hec.gov.pk\n• **Ehsaas Undergraduate** → For low-income students\n• **LUMS NOP** → Need-based full scholarship\n• **NUST** → Merit-based fee waivers\n• **IBA Karachi** → National Talent Hunt Program\n• **Aga Khan Foundation** → For exceptional students\n\n**Tip:** Apply to multiple scholarships simultaneously — deadlines are usually March-July!"

    if (msg.match(/salary|earn|money|income|pay/))
        return "**Salary ranges in Pakistan (2024):**\n\n• Software Engineer: PKR 80K–500K/month\n• Doctor (GP): PKR 100K–300K/month\n• Civil Engineer: PKR 60K–250K/month\n• Business Manager: PKR 70K–400K/month\n• Graphic Designer: PKR 40K–200K/month\n\n**Best earning potential:** CS/Software + Freelancing (earn in USD!)\n\n**Tip:** Skills + experience matter more than degree for high salaries!"

    return "I'm here to help with career guidance for Pakistani students! I can help with:\n\n• **Fields** after Matric or Intermediate\n• **University** recommendations & entry tests\n• **Scholarship** information\n• **Salary** expectations\n• **Subject** requirements\n\nWhat would you like to know?"
}

export async function POST(request) {
    try {
        const { message } = await request.json()

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // If no API key, use fallback
        if (!NVIDIA_API_KEY) {
            return NextResponse.json({ response: getFallbackResponse(message) })
        }

        // Call Nvidia NIM API
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
                    { role: 'user', content: message },
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        })

        if (!res.ok) {
            // Fallback if API fails
            console.error('Nvidia API error:', res.status)
            return NextResponse.json({ response: getFallbackResponse(message) })
        }

        const data = await res.json()
        const response = data.choices?.[0]?.message?.content

        if (!response) {
            return NextResponse.json({ response: getFallbackResponse(message) })
        }

        return NextResponse.json({ response })
    } catch (error) {
        console.error('Chatbot error:', error)
        return NextResponse.json({ response: getFallbackResponse('help') })
    }
}
