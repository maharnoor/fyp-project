'use client'
import { useState, useEffect, useRef, Fragment } from 'react'
import { MessageSquare, Send, Bot, User, Sparkles, RotateCcw, Lightbulb, AlertCircle } from 'lucide-react'

const SUGGESTED_QUESTIONS = [
    'Which field is good after matric?',
    'What subjects are needed for software engineering?',
    'What is the salary of a software engineer in Pakistan?',
    'Tell me about medical field in Pakistan',
    'Best universities for computer science in Pakistan',
    'How to become a doctor in Pakistan?',
]

// Safe markdown renderer — handles **bold** and *italic* without dangerouslySetInnerHTML.
function renderInline(text, keyPrefix = '') {
    const parts = []
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g
    let lastIndex = 0
    let match
    let i = 0
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index))
        }
        const token = match[0]
        if (token.startsWith('**')) {
            parts.push(<strong key={`${keyPrefix}b${i++}`}>{token.slice(2, -2)}</strong>)
        } else {
            parts.push(<em key={`${keyPrefix}i${i++}`}>{token.slice(1, -1)}</em>)
        }
        lastIndex = match.index + token.length
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex))
    return parts
}

function MarkdownText({ text }) {
    const paragraphs = text.split(/\n\n+/)
    return (
        <div>
            {paragraphs.map((para, pi) => (
                <p key={pi} className={pi > 0 ? 'mt-2' : ''}>
                    {para.split('\n').map((line, li, arr) => (
                        <Fragment key={li}>
                            {renderInline(line, `${pi}-${li}-`)}
                            {li < arr.length - 1 && <br />}
                        </Fragment>
                    ))}
                </p>
            ))}
        </div>
    )
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: "Assalam-o-Alaikum! I'm **MindBot**, your AI career advisor for Pakistani students.\n\nI can help you with:\n• Career fields after Matric/Intermediate\n• University recommendations\n• Subject requirements\n• Salary information\n\nWhat career questions do you have?",
            time: new Date(),
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (text) => {
        const msg = text || input.trim()
        if (!msg || loading) return

        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: msg, time: new Date() }])
        setLoading(true)

        try {
            const res = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg }),
            })
            const data = await res.json()
            setMessages(prev => [...prev, { role: 'bot', text: data.response, time: new Date() }])
        } catch {
            setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.', time: new Date(), isError: true }])
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const clearChat = () => {
        setMessages([{
            role: 'bot',
            text: "Chat cleared. How can I help you with your career guidance today?",
            time: new Date(),
        }])
    }

    return (
        <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <MessageSquare size={20} className="text-cyan-400" />
                        <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">AI Chatbot</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                        MindBot — Career Advisor
                    </h1>
                </div>
                <button onClick={clearChat} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                    <RotateCcw size={14} /> Clear
                </button>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4" style={{ minHeight: 0 }}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-up`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'bot'
                                ? 'gradient-brand'
                                : 'bg-gray-700'
                            }`}>
                            {msg.role === 'bot'
                                ? <Bot size={16} className="text-white" />
                                : <User size={16} className="text-gray-300" />}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                            {msg.isError && (
                                <div className="flex items-center gap-1.5 mb-1 text-rose-300 text-xs font-medium">
                                    <AlertCircle size={12} /> Error
                                </div>
                            )}
                            <MarkdownText text={msg.text} />
                            <p className="text-[10px] mt-2 opacity-50">
                                {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div className="flex gap-3 animate-fade-up">
                        <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="chat-bubble-bot flex items-center gap-1 py-3 px-4">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
                <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1">
                        <Lightbulb size={12} className="text-amber-400" /> Try asking:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(q)}
                                className="text-xs px-3 py-1.5 rounded-full transition-all"
                                style={{
                                    background: 'rgba(255, 255, 255,0.1)',
                                    border: '1px solid rgba(255, 255, 255,0.2)',
                                    color: '#D4D4D8'
                                }}
                                onMouseEnter={e => e.target.style.background = 'rgba(255, 255, 255,0.2)'}
                                onMouseLeave={e => e.target.style.background = 'rgba(255, 255, 255,0.1)'}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                    <textarea
                        id="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about career fields, universities, subjects..."
                        rows={1}
                        className="input-field resize-none pr-4"
                        style={{ minHeight: '48px', maxHeight: '120px' }}
                    />
                </div>
                <button
                    id="chat-send"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className="btn-primary flex-shrink-0"
                    style={{ padding: '12px 20px', opacity: (!input.trim() || loading) ? '0.5' : '1' }}
                >
                    <Send size={18} />
                </button>
            </div>
            <p className="text-xs text-gray-600 text-center mt-2">
                <Sparkles size={10} className="inline mr-1" />
                MindBot uses AI to provide career guidance tailored for Pakistani students
            </p>
        </div>
    )
}
