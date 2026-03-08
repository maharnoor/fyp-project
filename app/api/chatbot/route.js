import { NextResponse } from 'next/server'

const CAREER_KNOWLEDGE = {
    greetings: ['hi', 'hello', 'hey', 'salam', 'assalam', 'good morning', 'good evening'],

    responses: {
        greetings: "Assalam-o-Alaikum! 👋 I'm MindBot, your AI career guide. I can help you choose the right field after Matric or Intermediate. What would you like to know?",

        matric: `**After Matric (Grade 10), you can pursue:**\n\n📚 **FSc Pre-Medical** → Medicine, Pharmacy, Dentistry\n📐 **FSc Pre-Engineering** → Engineering (Civil, Mechanical, Electrical)\n💻 **ICS (Computer Science)** → Software Engineering, IT\n📊 **ICOM (Commerce)** → Business, Accounting, Finance\n🎨 **FA (Fine Arts)** → Graphic Design, Media, Architecture\n\n*Which field interests you most? Type it to learn more!*`,

        inter: `**After Intermediate (Grade 12), you can pursue:**\n\n🏥 **MBBS/BDS** → Doctor, Dentist (need FSc Pre-Medical)\n⚙️ **BE/BSc Engineering** → Admission via FSc Pre-Engineering\n💻 **BS Computer Science** → Tech industry, startups, AI\n📊 **BBA/MBA** → Business management, banking\n🎨 **BFA/BArch** → Design, architecture, fine arts\n\n*Need details about any specific program?*`,

        cs: `**Computer Science & Software Engineering:**\n\n✅ **Requirements:** FSc Pre-Engineering or ICS\n🎓 **Top Universities:** FAST, NUST, LUMS, UET Lahore\n💼 **Career Paths:** Software Developer, Data Scientist, AI Engineer, Web Developer\n💰 **Starting Salary:** PKR 80,000 – 150,000/month\n📈 **Growth:** Extremely HIGH — Pakistan's IT exports exceeded $2.6 billion!\n\n**Key Subjects:** Programming, Data Structures, Algorithms, Databases, AI/ML`,

        medical: `**Medical & Healthcare:**\n\n✅ **Requirements:** FSc Pre-Medical (Biology, Chemistry, Physics)\n🎓 **Top Universities:** AIMC Lahore, KMU Peshawar, AKU Karachi\n💼 **Career Paths:** Doctor (MBBS), Surgeon, Dentist (BDS), Pharmacist (Pharm-D)\n💰 **Starting Salary:** PKR 100,000 – 500,000/month (specialists earn much more)\n⏱️ **Duration:** 5 years MBBS + 1 year house job\n\n**Entry Test:** MDCAT — Study Biology, Chemistry, Physics, English`,

        engineering: `**Engineering Fields:**\n\n✅ **Requirements:** FSc Pre-Engineering (Math, Physics, Chemistry)\n🎓 **Top Universities:** UET, NUST, GIKI, NED\n💼 **Career Paths:**\n• Civil → Construction, Infrastructure\n• Mechanical → Manufacturing, Automotive\n• Electrical → Power, Electronics\n• Software → Tech Companies\n💰 **Starting Salary:** PKR 70,000 – 200,000/month\n\n**Entry Test:** ECAT/NTS guided by specific universities`,

        business: `**Business & Commerce:**\n\n✅ **Requirements:** ICOM or FSc (any group accepted by many universities)\n🎓 **Top Universities:** IBA Karachi, LUMS, CBM, UCP\n💼 **Career Paths:** Banker, Accountant, Marketing Manager, Entrepreneur\n💰 **Starting Salary:** PKR 50,000 – 150,000/month\n📈 **Tip:** ACCA + BBA combination is highly valued!\n\n**Key Skills:** Communication, Leadership, Financial Literacy`,

        arts: `**Arts, Design & Creative Fields:**\n\n✅ **Requirements:** FA (Fine Arts) or any intermediate\n🎓 **Top Institutions:** NCA Lahore, Indus Valley, BNU\n💼 **Career Paths:** Graphic Designer, Architect, Film Maker, UI/UX Designer\n💰 **Salary Range:** PKR 40,000 – 300,000+/month (freelancers earn in dollars!)\n🌍 **Freelance Opportunity:** Pakistan is among top freelancing countries!\n\n**Hot Skill:** UI/UX + Graphic Design = Very High Demand`,

        salary: `**Career Salary Comparison (Entry Level in Pakistan):**\n\n| Field | Monthly Salary |\n|-------|---------------|\n| 💻 Software Engineering | PKR 80K–150K |\n| 🩺 Medicine (After House Job) | PKR 100K–300K |\n| ⚙️ Engineering | PKR 70K–150K |\n| 📊 Business/Finance | PKR 50K–120K |\n| 🎨 Design (Freelance) | PKR 50K–250K |\n\n*Salaries grow significantly with experience!*`,

        universities: `**Top Universities in Pakistan:**\n\n🏆 **Overall Rankings:**\n1. NUST Islamabad\n2. LUMS Lahore\n3. QAU Islamabad\n4. UET Lahore\n5. IBA Karachi\n\n💻 **Best for CS:** FAST, NUST, LUMS, UET\n🩺 **Best for Medical:** AIMC, AKU, KMU, SZMC\n⚙️ **Best for Engineering:** UET, NUST, GIKI, NED\n📊 **Best for Business:** IBA, LUMS, CBM`,

        scholarship: `**Scholarship Opportunities:**\n\n🎓 **HEC Scholarships:** Need-based & merit-based for Pakistani students\n🏛️ **NUST Scholarship:** Based on SAT/entry test score\n💰 **Ehsaas Scholarship:** Government scholarship for deserving students\n🌍 **Chevening (UK):** Masters scholarships\n🇨🇳 **Chinese Government Scholarship:** Free tuition for top students\n\n*Apply early and maintain good grades!*`,

        default: `I can help you with career guidance! 🎯\n\nTry asking me:\n• "Which field is good after matric?"\n• "Tell me about Computer Science"\n• "How to become a doctor?"\n• "Best universities in Pakistan"\n• "Salary comparison"\n• "Scholarships in Pakistan"\n\nOr take our **AI Quiz** for personalized recommendations! 📝`,
    }
}

function findResponse(message) {
    const msg = message.toLowerCase().trim()

    // Greetings
    if (CAREER_KNOWLEDGE.greetings.some(g => msg.includes(g))) {
        return CAREER_KNOWLEDGE.responses.greetings
    }

    // Matric related
    if (msg.includes('matric') || msg.includes('10th') || msg.includes('grade 10') || msg.includes('after matric')) {
        return CAREER_KNOWLEDGE.responses.matric
    }

    // Intermediate related
    if (msg.includes('inter') || msg.includes('intermediate') || msg.includes('fsc') || msg.includes('12th') || msg.includes('after inter')) {
        return CAREER_KNOWLEDGE.responses.inter
    }

    // CS
    if (msg.includes('computer') || msg.includes('software') || msg.includes('programming') || msg.includes('coding') || msg.includes('it field') || msg.includes('cs')) {
        return CAREER_KNOWLEDGE.responses.cs
    }

    // Medical
    if (msg.includes('medical') || msg.includes('doctor') || msg.includes('mbbs') || msg.includes('medicine') || msg.includes('pharmacy') || msg.includes('biology')) {
        return CAREER_KNOWLEDGE.responses.medical
    }

    // Engineering
    if (msg.includes('engineer') || msg.includes('civil') || msg.includes('mechanical') || msg.includes('electrical') || msg.includes('ecat')) {
        return CAREER_KNOWLEDGE.responses.engineering
    }

    // Business
    if (msg.includes('business') || msg.includes('commerce') || msg.includes('bba') || msg.includes('mba') || msg.includes('finance') || msg.includes('accounting')) {
        return CAREER_KNOWLEDGE.responses.business
    }

    // Arts
    if (msg.includes('arts') || msg.includes('design') || msg.includes('graphic') || msg.includes('creative') || msg.includes('architect') || msg.includes('fine arts')) {
        return CAREER_KNOWLEDGE.responses.arts
    }

    // Salary
    if (msg.includes('salary') || msg.includes('income') || msg.includes('earn') || msg.includes('payment') || msg.includes('money')) {
        return CAREER_KNOWLEDGE.responses.salary
    }

    // Universities
    if (msg.includes('university') || msg.includes('universities') || msg.includes('college') || msg.includes('admission') || msg.includes('institute')) {
        return CAREER_KNOWLEDGE.responses.universities
    }

    // Scholarship
    if (msg.includes('scholarship') || msg.includes('fund') || msg.includes('financial aid') || msg.includes('hec')) {
        return CAREER_KNOWLEDGE.responses.scholarship
    }

    // Default
    return CAREER_KNOWLEDGE.responses.default
}

export async function POST(request) {
    try {
        const { message } = await request.json()

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Add small delay to simulate thinking
        await new Promise(resolve => setTimeout(resolve, 500))

        const response = findResponse(message)

        return NextResponse.json({
            response,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error('Chatbot error:', error)
        return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
    }
}
