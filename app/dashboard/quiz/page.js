'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Target, CheckCircle, Trophy, ArrowRight, RotateCcw, Brain, Lightbulb } from 'lucide-react'
import FieldIcon, { getFieldColor } from '@/components/ui/FieldIcon'

const TOTAL_QUESTIONS = 5

export default function QuizPage() {
    const { token } = useAuth()
    const router = useRouter()
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [selectedOption, setSelectedOption] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [isAiLoading, setIsAiLoading] = useState(true)
    const [done, setDone] = useState(false)
    const [result, setResult] = useState(null)

    const fetchQuestion = async (currentAnswers) => {
        setIsAiLoading(true)
        try {
            const res = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ answers: currentAnswers }),
            })
            const data = await res.json()
            if (res.ok && data.questions && data.questions.length > 0) {
                setQuestions(prev => [...prev, data.questions[0]])
            } else {
                console.error('Failed to load question from AI')
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsAiLoading(false)
        }
    }

    // Fetch first random AI question on mount
    useEffect(() => {
        fetchQuestion([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSelect = (optionIdx) => {
        setSelectedOption(optionIdx)
    }

    const handleNext = async () => {
        if (selectedOption === null) return

        const currentQ = questions[questions.length - 1]
        const newAnswers = [...answers, {
            questionId: currentQ.id,
            selectedOption,
            fieldTag: currentQ.fieldTags[selectedOption],
            questionText: currentQ.question,
            selectedOptionText: currentQ.options[selectedOption]
        }]
        
        setAnswers(newAnswers)
        setSelectedOption(null)

        if (newAnswers.length < TOTAL_QUESTIONS) {
            await fetchQuestion(newAnswers)
        } else {
            setSubmitting(true)
            try {
                const res = await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ answers: newAnswers, totalQuestions: TOTAL_QUESTIONS }),
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
        setQuestions([])
        setAnswers([])
        setSelectedOption(null)
        setDone(false)
        setResult(null)
        fetchQuestion([])
    }

    if (isAiLoading) {
        return (
            <div className="max-w-2xl mx-auto py-24 text-center animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-[#0a0a0a] border border-[#262626]">
                    <Brain size={48} className="text-white animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>Analyzing your responses...</h2>
                <p className="text-gray-400 text-lg mb-10">MindBot is generating your next personalized question.</p>
                <div className="w-10 h-10 mx-auto border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    if (done && result) {
        const topRec = result.recommendations?.[0]
        const topField = topRec?.field
        const topColor = getFieldColor(topField)
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center "
                        style={{ background: `${topColor}20`, border: `1px solid ${topColor}40` }}>
                        <FieldIcon field={topField} size={40} useFieldColor />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Quiz Complete!
                    </h1>
                    <p className="text-gray-400 text-lg">Here are your top career field matches</p>
                </div>

                <div className="space-y-4">
                    {result.recommendations?.map((rec, i) => {
                        const fd = rec.fieldData
                        const color = getFieldColor(rec.field)
                        return (
                            <div key={i} className="card" style={{
                                border: i === 0 ? '1px solid rgba(255, 255, 255,0.4)' : undefined,
                                background: i === 0 ? 'rgba(255, 255, 255,0.08)' : undefined,
                            }}>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                                        <FieldIcon field={rec.field} size={24} useFieldColor />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white">{fd?.name}</h3>
                                            {i === 0 && <span className="badge inline-flex items-center gap-1" style={{ background: 'rgba(255, 255, 255,0.2)', color: '#D4D4D8', border: '1px solid rgba(255, 255, 255,0.3)' }}><Trophy size={10} /> Best Match</span>}
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

    const question = questions[questions.length - 1]
    const current = answers.length
    const progress = (current / TOTAL_QUESTIONS) * 100

    if (!question) {
        return null // Safeguard while loading
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-zinc-300" />
                    <span className="text-sm font-medium text-zinc-300 uppercase tracking-wider">AI Career Quiz</span>
                </div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Discover Your Path
                </h1>
                <p className="text-gray-400 mt-1">Answer honestly to get the most accurate recommendations</p>
            </div>

            {/* Progress */}
            <div>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Question {current + 1} of {TOTAL_QUESTIONS}</span>
                    <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="progress-bar" style={{ height: '6px' }}>
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex gap-1 mt-2">
                    {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                            style={{
                                background: i < current ? '#FFFFFF' : i === current ? '#EDEDED' : '#1f2937'
                            }} />
                    ))}
                </div>
            </div>

            {/* Question Card */}
            <div className="card animate-fade-in" key={current}>
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
                                ? 'border-zinc-700 bg-white text-black'
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
                    ) : current === TOTAL_QUESTIONS - 1 ? (
                        <span className="flex items-center gap-2"><Brain size={18} /> Get My Recommendation</span>
                    ) : (
                        <span className="flex items-center gap-2">Next Question <ArrowRight size={18} /></span>
                    )}
                </button>
            </div>

            {/* Tip */}
            <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                <Lightbulb size={12} className="text-amber-400" />
                Answer based on genuine interests, not what you think is &quot;correct&quot; — there are no wrong answers!
            </p>
        </div>
    )
}
