/**
 * MindField Database Seed Script
 * Run: npx prisma db seed
 * Or: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const QUIZ_QUESTIONS = [
    {
        question: 'What subjects do you enjoy most?',
        option1: 'Math & Computing',
        option2: 'Biology & Chemistry',
        option3: 'Economics & Accounts',
        option4: 'Literature & Design',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'How do you spend free time?',
        option1: 'Coding/Gaming',
        option2: 'Reading Science',
        option3: 'Following Markets',
        option4: 'Drawing/Music',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Ideal work environment?',
        option1: 'Tech Hub/Lab',
        option2: 'Hospital/Clinic',
        option3: 'Corporate Office',
        option4: 'Design Studio',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'What problem do you like solving?',
        option1: 'System Bugs',
        option2: 'Health Issues',
        option3: 'Financial Inefficiencies',
        option4: 'Creative Blocks',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'What is your approach to work?',
        option1: 'Logical & Analytical',
        option2: 'Caring & Precise',
        option3: 'Strategic & Organized',
        option4: 'Imaginative & Free',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'Who would you shadow?',
        option1: 'Software Engineer',
        option2: 'Surgeon',
        option3: 'CEO',
        option4: 'Art Director',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Favorite type of news?',
        option1: 'Tech Innovations',
        option2: 'Medical Breakthroughs',
        option3: 'Stock Market updates',
        option4: 'Cultural Events',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'How do you handle a complex project?',
        option1: 'Break it into algorithms',
        option2: 'Research case studies',
        option3: 'Create a business plan',
        option4: 'Brainstorm visually',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Which tool do you prefer?',
        option1: 'Code Editor / CAD',
        option2: 'Microscope / Lab tools',
        option3: 'Spreadsheets',
        option4: 'Sketchpad / Camera',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'Best school subject?',
        option1: 'Physics / IT',
        option2: 'Biology',
        option3: 'Business Studies',
        option4: 'Fine Arts',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Reaction to stressful situations?',
        option1: 'Analyze logically',
        option2: 'Stay calm and help',
        option3: 'Manage resources',
        option4: 'Express through art',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'Favorite documentaries?',
        option1: 'How things work / Tech',
        option2: 'Human body / Nature',
        option3: 'Startups / Economics',
        option4: 'History / Art',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'Preferred type of impact?',
        option1: 'Building scalable systems',
        option2: 'Saving lives',
        option3: 'Growing economies',
        option4: 'Inspiring people',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Hobby preference?',
        option1: 'Building PCs / Robotics',
        option2: 'Volunteering at clinic',
        option3: 'Trading / Investing',
        option4: 'Painting / Writing',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'Learning style?',
        option1: 'Hands-on building',
        option2: 'Memorizing facts',
        option3: 'Case studies',
        option4: 'Visual observation',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Approach to planning?',
        option1: 'Flowcharts',
        option2: 'Protocols',
        option3: 'Agendas / Budgets',
        option4: 'Mood boards',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Ideal team role?',
        option1: 'Technical Lead',
        option2: 'Caregiver / Expert',
        option3: 'Project Manager',
        option4: 'Creative Director',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'What sounds like fun?',
        option1: 'Hackathon',
        option2: 'First aid workshop',
        option3: 'Pitch competition',
        option4: 'Art exhibition',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Reaction to complex data?',
        option1: 'Write a script to parse',
        option2: 'Look for biological patterns',
        option3: 'Calculate ROI',
        option4: 'Visualize it creatively',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Preferred conversation topic?',
        option1: 'AI & Gadgets',
        option2: 'Health & Wellness',
        option3: 'Startups & Crypto',
        option4: 'Movies & Design',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Natural talent?',
        option1: 'Math & Logic',
        option2: 'Empathy & Care',
        option3: 'Persuasion & Leadership',
        option4: 'Creativity & Aesthetics',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'What you value most?',
        option1: 'Innovation',
        option2: 'Health',
        option3: 'Wealth',
        option4: 'Beauty',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Long-term career goal?',
        option1: 'CTO / Lead Engineer',
        option2: 'Chief Medical Officer',
        option3: 'CEO / Founder',
        option4: 'Renowned Artist',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 3,
    },
    {
        question: 'Favorite TV show theme?',
        option1: 'Sci-Fi / Hacking',
        option2: 'Medical Drama',
        option3: 'Corporate Drama',
        option4: 'Documentaries on Art',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'If you had 1 million dollars?',
        option1: 'Fund a tech startup',
        option2: 'Donate to medical research',
        option3: 'Invest in real estate',
        option4: 'Open an art gallery',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    }
];

const SAMPLE_VIDEOS = [
    {
        title: 'Introduction to Computer Science Careers',
        description: 'Explore the world of software engineering, AI, and data science careers in Pakistan.',
        category: 'cs',
        url: 'https://www.youtube.com/embed/SzJ46YA_RaA',
        duration: 480,
    },
    {
        title: 'How to Become a Doctor in Pakistan',
        description: 'Complete guide to MBBS admission: MDCAT, FSc requirements, and top medical colleges.',
        category: 'medical',
        url: 'https://www.youtube.com/embed/lK02m6dtrHQ',
        duration: 600,
    },
    {
        title: 'Engineering Career Paths in Pakistan',
        description: 'Civil, Mechanical, Electrical — discover which engineering field suits you.',
        category: 'engineering',
        url: 'https://www.youtube.com/embed/uk-cykGFly4',
        duration: 540,
    },
    {
        title: 'Business Administration: Is BBA Right for You?',
        description: 'Career options after BBA/MBA in Pakistan: banking, marketing, entrepreneurship.',
        category: 'business',
        url: 'https://www.youtube.com/embed/VkK3lhS1YVQ',
        duration: 420,
    },
    {
        title: 'Graphic Design & Creative Arts Careers',
        description: 'Freelancing, agencies, and creative careers — earning in dollars from Pakistan.',
        category: 'arts',
        url: 'https://www.youtube.com/embed/oBMtBkF27R4',
        duration: 360,
    },
]

async function main() {
    console.log('[seed] Seeding MindField database...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123456', 12)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@mindfield.pk' },
        update: {},
        create: {
            name: 'MindField Admin',
            email: 'admin@mindfield.pk',
            password: adminPassword,
            role: 'admin',
        },
    })
    console.log('[seed] Admin user created:', admin.email)

    // Create demo student
    const studentPassword = await bcrypt.hash('student123456', 12)
    const student = await prisma.user.upsert({
        where: { email: 'demo@mindfield.pk' },
        update: {},
        create: {
            name: 'Demo Student',
            email: 'demo@mindfield.pk',
            password: studentPassword,
            role: 'student',
        },
    })
    console.log('[seed] Demo student created:', student.email)

    // Create quiz questions
    await prisma.quizQuestion.deleteMany()
    for (const q of QUIZ_QUESTIONS) {
        await prisma.quizQuestion.create({ data: q })
    }
    console.log(`[seed] ${QUIZ_QUESTIONS.length} quiz questions created`)

    // Create sample videos
    await prisma.video.deleteMany()
    for (const v of SAMPLE_VIDEOS) {
        await prisma.video.create({ data: v })
    }
    console.log(`[seed] ${SAMPLE_VIDEOS.length} sample videos created`)

    console.log('\n[seed] Database seeded successfully.')
    console.log('\nDemo Credentials:')
    console.log('   Admin: admin@mindfield.pk / admin123456')
    console.log('   Student: demo@mindfield.pk / student123456')
}

main()
    .catch((e) => {
        console.error('[seed] FAILED:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
