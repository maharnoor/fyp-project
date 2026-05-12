'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Play, Eye, Clock, Filter, Search, CheckCircle, Target, Code2, Bot, Stethoscope, Cog, Briefcase, Palette, Film, Check, ArrowLeft } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/Cards'

const DEMO_VIDEOS = [
    // CS & IT (3 videos)
    { id: 'v1', title: 'Introduction to Computer Science Careers', description: 'Explore the world of software engineering, AI, and data science careers in Pakistan.', category: 'cs', url: 'https://www.youtube.com/embed/SzJ46YA_RaA', thumbnail: null, duration: 480 },
    { id: 'v2', title: 'Software Engineering at FAST NUCES', description: 'An honest review of CS at FAST — campus, curriculum, and job placement.', category: 'cs', url: 'https://www.youtube.com/embed/8mAITcNt710', thumbnail: null, duration: 720 },
    { id: 'v3', title: 'How to learn coding in Pakistan', description: 'A beginner-friendly guide to learning programming and getting your first job.', category: 'cs', url: 'https://www.youtube.com/embed/zOjov-2OZ0E', thumbnail: null, duration: 540 },
    
    // AI (4 videos)
    { id: 'v4', title: 'But what is a neural network?', description: 'A deep dive into how neural networks and deep learning work.', category: 'ai', url: 'https://www.youtube.com/embed/aircAruvnKk', thumbnail: null, duration: 1140 },
    { id: 'v5', title: 'Machine Learning Basics', description: 'Understand the fundamentals of machine learning and how to get started.', category: 'ai', url: 'https://www.youtube.com/embed/ad79nYk2keg', thumbnail: null, duration: 600 },
    { id: 'v6', title: 'AI for Everyone', description: 'An introduction to Artificial Intelligence for non-technical people.', category: 'ai', url: 'https://www.youtube.com/embed/JMUxmLyrhSk', thumbnail: null, duration: 900 },
    { id: 'v7', title: 'CS50 AI Introduction', description: 'Harvard Universitys introduction to Artificial Intelligence with Python.', category: 'ai', url: 'https://www.youtube.com/embed/gR8QvFmNuLE', thumbnail: null, duration: 3600 },

    // Medical (3 videos)
    { id: 'v8', title: 'Complete MDCAT Guide', description: 'How to prepare for MDCAT, syllabus, and study tips.', category: 'medical', url: 'https://www.youtube.com/embed/iyyYwcFxxFg', thumbnail: null, duration: 600 },
    { id: 'v9', title: 'How to clear MDCAT', description: 'Tips and tricks to score high in MDCAT examination.', category: 'medical', url: 'https://www.youtube.com/embed/wJ7tlGol6qg', thumbnail: null, duration: 750 },
    { id: 'v10', title: 'Life as a Medical Student', description: 'What to expect in your 5 years of MBBS in Pakistan.', category: 'medical', url: 'https://www.youtube.com/embed/cUIRwsRQ9jM', thumbnail: null, duration: 500 },

    // Engineering (3 videos)
    { id: 'v11', title: 'What is Mechanical Engineering?', description: 'Explore the field of mechanical engineering and its career prospects.', category: 'engineering', url: 'https://www.youtube.com/embed/NDa3AGPobS4', thumbnail: null, duration: 420 },
    { id: 'v12', title: 'Civil vs Mechanical Engineering', description: 'Which engineering field is right for you in Pakistan?', category: 'engineering', url: 'https://www.youtube.com/embed/csqee7qLobk', thumbnail: null, duration: 660 },
    { id: 'v13', title: 'Electrical Engineering Scope', description: 'Job opportunities and scope for electrical engineers.', category: 'engineering', url: 'https://www.youtube.com/embed/Xp5HivdDxhM', thumbnail: null, duration: 540 },

    // Business (3 videos)
    { id: 'v14', title: 'What is BBA Career?', description: 'Scope and job opportunities after BBA in Pakistan.', category: 'business', url: 'https://www.youtube.com/embed/zJwnlfptA2Q', thumbnail: null, duration: 360 },
    { id: 'v15', title: 'BBA vs MBA', description: 'Should you do an MBA right after BBA? Detailed comparison.', category: 'business', url: 'https://www.youtube.com/embed/w29EwkFqB_4', thumbnail: null, duration: 480 },
    { id: 'v16', title: 'Careers in Finance', description: 'Investment banking, corporate finance, and accounting paths.', category: 'business', url: 'https://www.youtube.com/embed/ejSjjT-tyPw', thumbnail: null, duration: 600 },

    // Arts & Design (3 videos)
    { id: 'v17', title: 'Graphic Design Career Guide', description: 'How to start a career in graphic design and freelance.', category: 'arts', url: 'https://www.youtube.com/embed/Hvkg9CoD3h4', thumbnail: null, duration: 540 },
    { id: 'v18', title: 'UI/UX Design in Pakistan', description: 'Scope of UI/UX design and how to land your first job.', category: 'arts', url: 'https://www.youtube.com/embed/Lg4VZ0-2ZSE', thumbnail: null, duration: 420 },
    { id: 'v19', title: 'Digital Art Basics', description: 'Getting started with digital art and illustration.', category: 'arts', url: 'https://www.youtube.com/embed/RtZA5wT84Dg', thumbnail: null, duration: 360 },
]

const CATEGORIES = [
    { value: '', label: 'All Fields', icon: Target },
    { value: 'cs', label: 'Computer Science', icon: Code2 },
    { value: 'ai', label: 'Artificial Intelligence', icon: Bot },
    { value: 'medical', label: 'Medical', icon: Stethoscope },
    { value: 'engineering', label: 'Engineering', icon: Cog },
    { value: 'business', label: 'Business', icon: Briefcase },
    { value: 'arts', label: 'Arts & Design', icon: Palette },
]

function formatDuration(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideosPage() {
    const { token } = useAuth()
    const [videos, setVideos] = useState(DEMO_VIDEOS)
    const [category, setCategory] = useState('')
    const [search, setSearch] = useState('')
    const [watched, setWatched] = useState(new Set())
    const [activeVideo, setActiveVideo] = useState(null)
    const [loading] = useState(false)

    const filtered = videos.filter(v => {
        const matchCat = !category || v.category === category
        const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    const handleWatch = async (video) => {
        setActiveVideo(video)
        if (!watched.has(video.id)) {
            setWatched(prev => new Set([...prev, video.id]))
            try {
                await fetch(`/api/videos/${video.id}/watch`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                })
            } catch { }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Play size={20} className="text-violet-400" />
                    <span className="text-sm font-semibold text-violet-400 uppercase tracking-wider">Learning Hub</span>
                </div>
                <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Career Guidance Videos
                </h1>
                <p className="text-gray-400 mt-1">Watch curated videos about different career fields in Pakistan</p>
            </div>

            {/* Active Video Player */}
            {activeVideo && (
                <div className="card animate-scale-in" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
                    <div className="aspect-video rounded-xl overflow-hidden mb-4">
                        <iframe
                            src={activeVideo.url}
                            title={activeVideo.title}
                            className="w-full h-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">{activeVideo.title}</h2>
                            <p className="text-gray-400 text-sm">{activeVideo.description}</p>
                        </div>
                        <span className="badge ml-4 flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <CheckCircle size={12} className="mr-1" /> Watched
                        </span>
                    </div>
                    <button onClick={() => setActiveVideo(null)} className="btn-secondary mt-4" style={{ padding: '8px 16px', fontSize: '13px' }}>
                        <ArrowLeft size={14} /> Back to Videos
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10"
                        style={{ padding: '10px 16px 10px 36px' }}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {CATEGORIES.map((cat) => {
                        const CatIcon = cat.icon
                        const isActive = category === cat.value
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setCategory(cat.value)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all"
                                style={{
                                    background: isActive ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${isActive ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                    color: isActive ? '#c4b5fd' : '#6b7280',
                                }}
                            >
                                <CatIcon size={14} /> {cat.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Video Grid */}
            {loading ? (
                <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((video) => {
                        const isWatched = watched.has(video.id)
                        const catColor = {
                            cs: '#6366f1', ai: '#ec4899', medical: '#10b981', engineering: '#f59e0b',
                            business: '#8b5cf6', arts: '#f43f5e'
                        }[video.category] || '#6366f1'

                        return (
                            <div key={video.id} className="card glass-hover cursor-pointer" onClick={() => handleWatch(video)}>
                                {/* Thumbnail placeholder */}
                                <div className="aspect-video rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                                    style={{ background: `linear-gradient(135deg, ${catColor}20, ${catColor}10)`, border: `1px solid ${catColor}30` }}>
                                    <Play size={36} style={{ color: catColor }} />
                                    {isWatched && (
                                        <div className="absolute top-2 right-2">
                                            <span className="badge text-xs inline-flex items-center gap-1" style={{ background: 'rgba(16,185,129,0.8)', color: 'white', border: 'none' }}>
                                                <Check size={10} strokeWidth={3} /> Watched
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 right-2">
                                        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.7)', color: '#d1d5db' }}>
                                            <Clock size={10} className="inline mr-0.5" />
                                            {formatDuration(video.duration)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {(() => {
                                            const cat = CATEGORIES.find(c => c.value === video.category)
                                            const CatIcon = cat?.icon || Target
                                            return (
                                                <span className="badge text-xs inline-flex items-center gap-1" style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30` }}>
                                                    <CatIcon size={11} /> {cat?.label}
                                                </span>
                                            )
                                        })()}
                                    </div>
                                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">{video.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/10 mx-auto mb-4 flex items-center justify-center">
                        <Film size={32} className="text-violet-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Videos Found</h3>
                    <p className="text-gray-400">Try a different search or category filter</p>
                </div>
            )}
        </div>
    )
}
