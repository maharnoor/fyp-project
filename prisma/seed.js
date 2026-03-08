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
        question: 'Which of these subjects do you enjoy the most?',
        option1: 'Mathematics & Logic',
        option2: 'Biology & Chemistry',
        option3: 'Economics & Accounting',
        option4: 'Art & Literature',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'What type of problem do you find most satisfying to solve?',
        option1: 'Writing and debugging code',
        option2: "Diagnosing a patient's illness",
        option3: 'Planning a business strategy',
        option4: 'Creating a design or artwork',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'How do you prefer to spend your free time?',
        option1: 'Building apps or gaming',
        option2: 'Reading health/science articles',
        option3: 'Watching business/finance content',
        option4: 'Sketching, painting or photography',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 2,
    },
    {
        question: 'Which career environment appeals to you most?',
        option1: 'Tech startup or software company',
        option2: 'Hospital or clinic',
        option3: 'Corporate office or bank',
        option4: 'Design studio or media agency',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'What is your approach to working with others?',
        option1: 'Prefer working independently with technical tools',
        option2: 'Enjoy helping and caring for people',
        option3: 'Lead teams and manage projects',
        option4: 'Collaborate creatively with a team',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 2,
    },
    {
        question: 'Which of the following skills comes most naturally to you?',
        option1: 'Logical reasoning and algorithms',
        option2: 'Memorization and attention to detail',
        option3: 'Persuasion and negotiation',
        option4: 'Visual creativity and imagination',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'Which subject were you best at in school?',
        option1: 'Physics & Math',
        option2: 'Biology',
        option3: 'Any — I was well-rounded',
        option4: 'Social studies & languages',
        correctAnswer: '1',
        fieldTag: 'engineering',
        weight: 2,
    },
    {
        question: 'Imagine your ideal workday — which fits best?',
        option1: 'Coding and solving technical problems',
        option2: 'Examining and treating patients',
        option3: 'Attending meetings and closing deals',
        option4: 'Designing visuals or writing creatively',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
    {
        question: 'What is most important to you in a career?',
        option1: 'Innovation and building new things',
        option2: 'Saving lives and making a health impact',
        option3: 'Financial success and leadership',
        option4: 'Creative expression and recognition',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 2,
    },
    {
        question: 'If you could shadow a professional for a day, who would it be?',
        option1: 'A software engineer at Google',
        option2: 'A surgeon at a top hospital',
        option3: 'A CEO of a successful startup',
        option4: 'A creative director at an ad agency',
        correctAnswer: '1',
        fieldTag: 'cs',
        weight: 3,
    },
]

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
    console.log('🌱 Seeding MindField database...')

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
    console.log('✅ Admin user created:', admin.email)

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
    console.log('✅ Demo student created:', student.email)

    // Create quiz questions
    await prisma.quizQuestion.deleteMany()
    for (const q of QUIZ_QUESTIONS) {
        await prisma.quizQuestion.create({ data: q })
    }
    console.log(`✅ ${QUIZ_QUESTIONS.length} quiz questions created`)

    // Create sample videos
    await prisma.video.deleteMany()
    for (const v of SAMPLE_VIDEOS) {
        await prisma.video.create({ data: v })
    }
    console.log(`✅ ${SAMPLE_VIDEOS.length} sample videos created`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📋 Demo Credentials:')
    console.log('   Admin: admin@mindfield.pk / admin123456')
    console.log('   Student: demo@mindfield.pk / student123456')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
