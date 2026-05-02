// Recommendation Engine - Rule-based scoring system
// Maps quiz answers to career fields

// Field icons are rendered via components/ui/FieldIcon.jsx using the field key.
export const CAREER_FIELDS = {
    cs: {
        name: 'Computer Science & Software Engineering',
        description: 'Design and build software, apps, websites, and AI systems.',
        subjects: ['Mathematics', 'Physics', 'Computer Science'],
        universities: ['FAST', 'NUST', 'LUMS', 'UET'],
        salary: 'PKR 80,000 – 500,000+/month',
        growth: 'Very High',
        color: '#6366f1',
    },
    medical: {
        name: 'Medical & Healthcare',
        description: 'Become a doctor, surgeon, dentist, or healthcare professional.',
        subjects: ['Biology', 'Chemistry', 'Physics'],
        universities: ['AIMC', 'KMU', 'AKU', 'SZMC'],
        salary: 'PKR 100,000 – 1,000,000+/month',
        growth: 'High',
        color: '#10b981',
    },
    engineering: {
        name: 'Engineering',
        description: 'Civil, Mechanical, Electrical & Industrial engineering.',
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        universities: ['UET', 'NUST', 'NED', 'GIKI'],
        salary: 'PKR 70,000 – 400,000+/month',
        growth: 'High',
        color: '#f59e0b',
    },
    business: {
        name: 'Business & Commerce',
        description: 'Management, accounting, finance, and entrepreneurship.',
        subjects: ['Mathematics', 'Economics', 'Accounting'],
        universities: ['IBA', 'LUMS', 'CBM', 'UCP'],
        salary: 'PKR 60,000 – 600,000+/month',
        growth: 'Moderate-High',
        color: '#8b5cf6',
    },
    arts: {
        name: 'Arts, Design & Creative Fields',
        description: 'Graphic design, fine arts, architecture, and media.',
        subjects: ['Fine Arts', 'History', 'Literature'],
        universities: ['NCA', 'Indus Valley', 'BNU', 'SCAD'],
        salary: 'PKR 40,000 – 300,000+/month',
        growth: 'Moderate',
        color: '#f43f5e',
    },
}

export function calculateRecommendations(answers) {
    const scores = { cs: 0, medical: 0, engineering: 0, business: 0, arts: 0 }

    // New payload: [{ questionId, selectedOption, fieldTag }, ...]
    // Legacy payload (older clients): [optionIndex, ...] mapped via FIELD_SCORE_MAP
    const FIELD_SCORE_MAP = ['cs', 'medical', 'business', 'arts']

    answers.forEach((answer) => {
        let field
        if (answer && typeof answer === 'object' && answer.fieldTag) {
            field = answer.fieldTag
        } else if (typeof answer === 'number') {
            field = FIELD_SCORE_MAP[answer]
        }
        if (field && scores[field] !== undefined) {
            scores[field] += 1
        }
    })

    const maxScore = Math.max(...Object.values(scores))
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

    const ranked = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([field, score]) => ({
            field,
            fieldData: CAREER_FIELDS[field],
            score,
            confidence: totalScore > 0 ? Math.round((score / maxScore) * 100) : 0,
            explanation: generateExplanation(field, score, maxScore),
        }))

    return ranked
}

function generateExplanation(field, score, maxScore) {
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    const explanations = {
        cs: `Your answers show strong aptitude for logical thinking and problem-solving — key skills in Computer Science. With ${percentage}% match, you could excel as a software engineer, AI developer, or data scientist.`,
        medical: `Your interest in biology and helping people indicates a natural fit for healthcare. With ${percentage}% match, careers in medicine, pharmacy, or biomedical sciences could be highly rewarding for you.`,
        engineering: `You exhibit strong analytical and mathematical skills typical of engineers. With ${percentage}% match, fields like Civil, Mechanical, or Electrical Engineering could be an excellent choice.`,
        business: `Your strengths in organization, leadership, and communication suggest a business mindset. With ${percentage}% match, Business Administration, Finance, or Entrepreneurship could be your path.`,
        arts: `Your creative and expressive nature aligns strongly with arts and design. With ${percentage}% match, careers in Graphic Design, Architecture, Fine Arts, or Media could be ideal.`,
    }
    return explanations[field] || 'This field aligns with your quiz responses.'
}

export const BOOK_RECOMMENDATIONS = {
    cs: [
        { title: 'Clean Code', author: 'Robert C. Martin', description: 'A handbook of agile software craftsmanship.' },
        { title: 'Introduction to Algorithms', author: 'CLRS', description: 'The classic algorithms textbook.' },
        { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', description: 'From journeyman to master.' },
        { title: 'You Don\'t Know JS', author: 'Kyle Simpson', description: 'Deep dive into JavaScript.' },
    ],
    medical: [
        { title: 'Gray\'s Anatomy', author: 'Henry Gray', description: 'The definitive human anatomy reference.' },
        { title: 'First Aid for the USMLE Step 1', author: 'Tao Le', description: 'Essential medical board prep.' },
        { title: 'Harrison\'s Principles of Internal Medicine', author: 'Various', description: 'The doctor\'s bible.' },
        { title: 'Netter\'s Atlas of Human Anatomy', author: 'Frank H. Netter', description: 'Illustrated anatomy guide.' },
    ],
    engineering: [
        { title: 'Engineering Mechanics', author: 'Hibbeler', description: 'Statics and dynamics fundamentals.' },
        { title: 'Fundamentals of Electric Circuits', author: 'Alexander & Sadiku', description: 'Circuit analysis textbook.' },
        { title: 'Structural Analysis', author: 'R.C. Hibbeler', description: 'Civil engineering structural methods.' },
        { title: 'Mechanics of Materials', author: 'Beer & Johnston', description: 'Material behavior under loads.' },
    ],
    business: [
        { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', description: 'Financial intelligence for beginners.' },
        { title: 'The Lean Startup', author: 'Eric Ries', description: 'How to build a successful startup.' },
        { title: 'Principles of Marketing', author: 'Philip Kotler', description: 'The marketing management bible.' },
        { title: 'Zero to One', author: 'Peter Thiel', description: 'Notes on startups and the future.' },
    ],
    arts: [
        { title: 'The Elements of Graphic Design', author: 'Alex W. White', description: 'Visual design principles.' },
        { title: 'Thinking with Type', author: 'Ellen Lupton', description: 'A critical guide to typography.' },
        { title: 'The Architecture of Happiness', author: 'Alain de Botton', description: 'Philosophy of architecture.' },
        { title: 'Understanding Comics', author: 'Scott McCloud', description: 'Visual storytelling secrets.' },
    ],
}
