'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Target, CheckCircle, Trophy, ArrowRight, RotateCcw, Brain } from 'lucide-react'

// Static quiz questions (fallback if no DB questions)
const QUIZ_QUESTIONS = [
    {
        id: 1,
        question: 'Which of these subjects do you enjoy the most?',
        options: ['Mathematics & Logic', 'Biology & Chemistry', 'Economics & Accounting', 'Art & Literature'],
        fieldTags: ['cs/engineering', 'medical', 'business', 'arts'],
    },
    {
        id: 2,
        question: 'What type of problem do you find most satisfying to solve?',
        options: ['Writing and debugging code', 'Diagnosing a patient\'s illness', 'Planning a business strategy', 'Creating a design or artwork'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 3,
        question: 'How do you prefer to spend your free time?',
        options: ['Building apps or gaming', 'Reading health/science articles', 'Watching business/finance content', 'Sketching, painting or photography'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 4,
        question: 'Which career environment appeals to you most?',
        options: ['Tech startup or software company', 'Hospital or clinic', 'Corporate office or bank', 'Design studio or media agency'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 5,
        question: 'What is your approach to working with others?',
        options: ['Prefer working independently with technical tools', 'Enjoy helping and caring for people', 'Lead teams and manage projects', 'Collaborate creatively with a team'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 6,
        question: 'Which of the following skills comes most naturally to you?',
        options: ['Logical reasoning and algorithms', 'Memorization and attention to detail', 'Persuasion and negotiation', 'Visual creativity and imagination'],
        fieldTags: ['cs/engineering', 'medical', 'business', 'arts'],
    },
    {
        id: 7,
        question: 'Which subject were you best at in school?',
        options: ['Physics & Math', 'Biology', 'Any — I was well-rounded', 'Social studies & languages'],
        fieldTags: ['engineering', 'medical', 'business', 'arts'],
    },
    {
        id: 8,
        question: 'Imagine your ideal workday — which fits best?',
        options: ['Coding and solving technical problems', 'Examining and treating patients', 'Attending meetings and closing deals', 'Designing visuals or writing creatively'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 9,
        question: 'What is most important to you in a career?',
        options: ['Innovation and building new things', 'Saving lives and making a health impact', 'Financial success and leadership', 'Creative expression and recognition'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
    {
        id: 10,
        question: 'If you could shadow a professional for a day, who would it be?',
        options: ['A software engineer at Google', 'A surgeon at a top hospital', 'A CEO of a successful startup', 'A creative director at an ad agency'],
        fieldTags: ['cs', 'medical', 'business', 'arts'],
    },
]

// Maps option index to field scores
const FIELD_SCORE_MAP = ['cs', 'medical', 'business', 'arts']

export default function QuizPage() {
    const { token } = useAuth()
    const router = useRouter()
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState([])
    const [selectedOption, setSelectedOption] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)
    const [result, setResult] = useState(null)

    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch questions on mount
    require('react').useEffect(() => {
        if (!token) return;
        fetch('/api/quiz/questions', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                // Map the DB structure to frontend structure
                const formatted = data.questions.map(q => ({
                    id: q.id,
                    question: q.question,
                    options: [q.option1, q.option2, q.option3, q.option4],
                }))
                setQuestions(formatted)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch questions:', err)
                setLoading(false)
            })
    }, [token])

    if (loading) {
        return <div className="text-center py-12 text-gray-400">Loading quiz questions...</div>
    }

    const question = questions[current]
    const progress = ((current) / questions.length) * 100

    const handleSelect = (optionIdx) => {
        setSelectedOption(optionIdx)
    }

    const handleNext = async () => {
        if (selectedOption === null) return

        const newAnswers = [...answers, { questionId: question.id, answer: selectedOption }]
        setAnswers(newAnswers)

        if (current < questions.length - 1) {
            setCurrent(current + 1)
            setSelectedOption(null)
        } else {
            // Submit quiz
            setSubmitting(true)
            try {
                const res = await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ answers: newAnswers, totalQuestions: questions.length }),
                })
                const data = await res.json()
                if (res.ok) {
                    setResult(data)
                    setDone(true)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setSubmitting(false)
            }
        }
    }

    const handleRestart = () => {
        setCurrent(0)
        setAnswers([])
        setSelectedOption(null)
        setDone(false)
        setResult(null)
    }

    if (done && result) {
        const topRec = result.recommendations?.[0]
        const fieldData = topRec?.fieldData
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
                <div className="text-center py-8">
                    <div className="text-6xl mb-4 animate-float">{fieldData?.icon || '🎯'}</div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Quiz Complete!
                    </h1>
                    <p className="text-gray-400 text-lg">Here are your top career field matches</p>
                </div>

                <div className="space-y-4">
                    {result.recommendations?.map((rec, i) => {
                        const fd = rec.fieldData
                        return (
                            <div key={i} className="card" style={{
                                border: i === 0 ? '1px solid rgba(99,102,241,0.4)' : undefined,
                                background: i === 0 ? 'rgba(99,102,241,0.08)' : undefined,
                            }}>
                                <div className="flex items-start gap-4">
                                    <span className="text-3xl">{fd?.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white">{fd?.name}</h3>
                                            {i === 0 && <span className="badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>Best Match</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-3">{rec.explanation}</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${rec.confidence}%` }} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{rec.confidence}% confidence match</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="flex gap-3">
                    <button onClick={handleRestart} className="btn-secondary flex-1 justify-center">
                        <RotateCcw size={16} /> Retake Quiz
                    </button>
                    <button onClick={() => router.push('/dashboard/recommendations')} className="btn-primary flex-1 justify-center">
                        Full Analysis <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-indigo-400" />
                    <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider">AI Career Quiz</span>
                </div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Discover Your Path
                </h1>
                <p className="text-gray-400 mt-1">Answer honestly to get the most accurate recommendations</p>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Question {current + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="progress-bar" style={{ height: '6px' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex gap-1 mt-2">
                    {questions.map((_, i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                                background: i < current ? '#6366f1' : i === current ? '#8b5cf6' : '#1f2937'
                            }} />
                    ))}
                </div>
            </div>

            {/* Question Card */}
            <div className="card animate-scale-in" key={current}>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm">
                        {current + 1}
                    </div>
                    <h2 className="text-xl font-bold text-white">{question.question}</h2>
                </div>

                <div className="space-y-3">
                    {question.options.map((option, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            id={`quiz-option-${i}`}
                            className={`quiz-option w-full text-left ${selectedOption === i ? 'selected' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedOption === i
                                    ? 'border-indigo-500 bg-indigo-500'
                                    : 'border-gray-600'
                                }`}>
                                {selectedOption === i
                                    ? <CheckCircle size={16} className="text-white" />
                                    : <span className="text-xs font-bold text-gray-400">{String.fromCharCode(65 + i)}</span>}
                            </div>
                            {option}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    disabled={selectedOption === null || submitting}
                    id="quiz-next"
                    className="btn-primary w-full justify-center mt-8"
                    style={{ padding: '14px', opacity: selectedOption === null ? '0.5' : '1' }}
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing...
                        </span>
                    ) : current === questions.length - 1 ? (
                        <span className="flex items-center gap-2"><Brain size={18} /> Get My Recommendation</span>
                    ) : (
                        <span className="flex items-center gap-2">Next Question <ArrowRight size={18} /></span>
                    )}
                </button>
            </div>

            {/* Tip */}
            <p className="text-center text-xs text-gray-500">
                💡 Answer based on genuine interests, not what you think is "correct" — there are no wrong answers!
            </p>
        </div>
    )
}
