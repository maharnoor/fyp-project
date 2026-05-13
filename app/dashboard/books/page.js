'use client'
import { useState } from 'react'
import { BOOK_RECOMMENDATIONS, CAREER_FIELDS } from '@/lib/recommendation'
import { BookOpen, Star, ExternalLink, Filter, Lightbulb } from 'lucide-react'
import FieldIcon, { getFieldColor } from '@/components/ui/FieldIcon'

const ALL_FIELDS = Object.keys(CAREER_FIELDS)

export default function BooksPage() {
    const [activeField, setActiveField] = useState('cs')

    const books = BOOK_RECOMMENDATIONS[activeField] || []
    const fd = CAREER_FIELDS[activeField]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={20} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Reading List</span>
                </div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Book Recommendations
                </h1>
                <p className="text-gray-400 mt-1">Curated books for each career field to start your learning journey</p>
            </div>

            {/* Field Selector */}
            <div className="flex flex-wrap gap-3">
                {ALL_FIELDS.map((field) => {
                    const f = CAREER_FIELDS[field]
                    const isActive = activeField === field
                    return (
                        <button
                            key={field}
                            onClick={() => setActiveField(field)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{
                                background: isActive ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${isActive ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                color: isActive ? '#fcd34d' : '#6b7280',
                            }}
                        >
                            <FieldIcon field={field} size={14} /> {f.name.split(' ')[0]}
                        </button>
                    )
                })}
            </div>

            {/* Active Field Info */}
            <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.04))', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 "
                        style={{ background: `${getFieldColor(activeField)}20`, border: `1px solid ${getFieldColor(activeField)}40` }}>
                        <FieldIcon field={activeField} size={32} useFieldColor />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{fd.name}</h2>
                        <p className="text-gray-400 text-sm mt-1">{fd.description}</p>
                    </div>
                </div>
            </div>

            {/* Books Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
                {books.map((book, i) => (
                    <div key={i} className="card hover:border-zinc-600 transition-colors animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="flex items-start gap-4">
                            {/* Book cover placeholder */}
                            <div className="w-16 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <BookOpen size={24} className="text-amber-400" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className="font-bold text-white text-sm leading-tight">{book.title}</h3>
                                    <div className="flex gap-0.5 flex-shrink-0">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={10} className="text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-amber-400 font-medium mb-2">by {book.author}</p>
                                <p className="text-xs text-gray-400 leading-relaxed">{book.description}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-3">
                            <a
                                href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' book')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary text-xs flex-1 justify-center"
                                style={{ padding: '8px' }}
                            >
                                <ExternalLink size={12} /> Find Online
                            </a>
                            <a
                                href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-xs flex-1 justify-center"
                                style={{ padding: '8px', background: '#ff9900' }}
                            >
                                Amazon
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tip */}
            <div className="p-5 rounded-2xl text-center"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                <p className="text-sm text-gray-400 flex items-center justify-center gap-1.5 flex-wrap">
                    <Lightbulb size={14} className="text-amber-400 flex-shrink-0" />
                    <strong className="text-amber-400">Pro Tip:</strong> You can find most of these books online for free at
                    <a href="https://zlibrary.to" target="_blank" rel="noopener" className="text-amber-400 hover:underline">Z-Library</a> or
                    <a href="https://archive.org" target="_blank" rel="noopener" className="text-amber-400 hover:underline">Internet Archive</a>
                </p>
            </div>
        </div>
    )
}
