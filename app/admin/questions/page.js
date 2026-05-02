'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { HelpCircle, Plus, Trash2, X, Check } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/Cards'

const CATEGORIES = [
    { value: 'cs', label: 'Computer Science' },
    { value: 'medical', label: 'Medical' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'business', label: 'Business' },
    { value: 'arts', label: 'Arts' },
]

const EMPTY_FORM = { question: '', option1: '', option2: '', option3: '', option4: '', correctAnswer: '1', fieldTag: 'cs', weight: 1 }

export default function AdminQuestionsPage() {
    const { token } = useAuth()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetch_() {
            try {
                const res = await fetch('/api/quiz/questions', { headers: { Authorization: `Bearer ${token}` } })
                const data = await res.json()
                setQuestions(data.questions || [])
            } catch { }
            finally { setLoading(false) }
        }
        if (token) fetch_()
    }, [token])

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/quiz/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            })
            const data = await res.json()
            if (res.ok) {
                setQuestions(prev => [...prev, data.question])
                setShowForm(false)
                setForm(EMPTY_FORM)
            }
        } catch { }
        finally { setSaving(false) }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Quiz Questions</h1>
                    <p className="text-gray-400 mt-1">{questions.length} questions in the quiz bank</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus size={16} /> Add Question
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="card animate-scale-in" style={{ border: '1px solid rgba(99,102,241,0.3)' }}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-white">Add New Question</h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Question *</label>
                            <input className="input-field" required value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Enter quiz question..." />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {['option1', 'option2', 'option3', 'option4'].map((opt, i) => (
                                <div key={opt}>
                                    <label className="block text-sm text-gray-300 mb-2">Option {i + 1} *</label>
                                    <input className="input-field" required value={form[opt]} onChange={e => setForm(p => ({ ...p, [opt]: e.target.value }))} placeholder={`Option ${i + 1}...`} />
                                </div>
                            ))}
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Correct Answer</label>
                                <select className="input-field" value={form.correctAnswer} onChange={e => setForm(p => ({ ...p, correctAnswer: e.target.value }))}>
                                    {[1, 2, 3, 4].map(n => <option key={n} value={String(n)}>Option {n}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Field Tag</label>
                                <select className="input-field" value={form.fieldTag} onChange={e => setForm(p => ({ ...p, fieldTag: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Weight (1-5)</label>
                                <input className="input-field" type="number" min="1" max="5" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: parseInt(e.target.value) }))} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={saving} className="btn-primary">
                                {saving ? 'Saving...' : <><Check size={16} /> Add Question</>}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Questions List */}
            {loading ? <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div> : (
                <div className="space-y-4">
                    {questions.map((q, i) => (
                        <div key={q.id} className="card">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-3 flex-1">
                                    <span className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white mb-3">{q.question}</p>
                                        <div className="grid sm:grid-cols-2 gap-2">
                                            {[q.option1, q.option2, q.option3, q.option4].map((opt, oi) => (
                                                <div key={oi} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                                                    style={{
                                                        background: String(oi + 1) === q.correctAnswer ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                                                        border: `1px solid ${String(oi + 1) === q.correctAnswer ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                                        color: String(oi + 1) === q.correctAnswer ? '#6ee7b7' : '#9ca3af'
                                                    }}>
                                                    <span className="w-5 h-5 rounded text-xs flex items-center justify-center font-bold flex-shrink-0"
                                                        style={{ background: String(oi + 1) === q.correctAnswer ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)' }}>
                                                        {String.fromCharCode(65 + oi)}
                                                    </span>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="badge text-xs" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                {q.fieldTag?.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-gray-500">Weight: {q.weight}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {questions.length === 0 && (
                        <div className="text-center py-16">
                            <HelpCircle size={40} className="text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500">No questions yet. Add your first quiz question!</p>
                            <p className="text-gray-600 text-sm mt-2">Or run <code className="text-indigo-400">npm run db:seed</code> to load sample questions</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
