'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Play, Eye, Clock, Filter, Search, CheckCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/Cards'

const DEMO_VIDEOS = [
    { id: 'v1', title: 'Introduction to Computer Science Careers', description: 'Explore the world of software engineering, AI, and data science careers in Pakistan.', category: 'cs', url: 'https://www.youtube.com/embed/SzJ46YA_RaA', thumbnail: null, duration: 480 },
    { id: 'v2', title: 'How to Become a Doctor in Pakistan', description: 'Complete guide to MBBS admission: MDCAT, FSc requirements, and top medical colleges.', category: 'medical', url: 'https://www.youtube.com/embed/lK02m6dtrHQ', thumbnail: null, duration: 600 },
    { id: 'v3', title: 'Engineering Career Paths in Pakistan', description: 'Civil, Mechanical, Electrical — discover which engineering field suits you.', category: 'engineering', url: 'https://www.youtube.com/embed/uk-cykGFly4', thumbnail: null, duration: 540 },
    { id: 'v4', title: 'Business Administration: Is BBA Right for You?', description: 'Career options after BBA/MBA in Pakistan: banking, marketing, entrepreneurship.', category: 'business', url: 'https://www.youtube.com/embed/VkK3lhS1YVQ', thumbnail: null, duration: 420 },
    { id: 'v5', title: 'Graphic Design & Creative Arts Careers', description: 'Freelancing, agencies, and creative careers — earning in dollars from Pakistan.', category: 'arts', url: 'https://www.youtube.com/embed/oBMtBkF27R4', thumbnail: null, duration: 360 },
    { id: 'v6', title: 'Software Engineering at FAST NUCES', description: 'An honest review of CS at FAST — campus, curriculum, and job placement.', category: 'cs', url: 'https://www.youtube.com/embed/8mAITcNt710', thumbnail: null, duration: 720 },
]

const CATEGORIES = [
    { value: '', label: 'All Fields', icon: '🎯' },
    { value: 'cs', label: 'Computer Science', icon: '💻' },
    { value: 'medical', label: 'Medical', icon: '🩺' },
    { value: 'engineering', label: 'Engineering', icon: '⚙️' },
    { value: 'business', label: 'Business', icon: '📊' },
    { value: 'arts', label: 'Arts & Design', icon: '🎨' },
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
                        ← Back to Videos
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
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all"
                            style={{
                                background: category === cat.value ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${category === cat.value ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                color: category === cat.value ? '#c4b5fd' : '#6b7280',
                            }}
                        >
                            <span>{cat.icon}</span> {cat.label}
                        </button>
                    ))}
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
                            cs: '#6366f1', medical: '#10b981', engineering: '#f59e0b',
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
                                            <span className="badge text-xs" style={{ background: 'rgba(16,185,129,0.8)', color: 'white', border: 'none' }}>
                                                ✓ Watched
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
                                        <span className="badge text-xs" style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30` }}>
                                            {CATEGORIES.find(c => c.value === video.category)?.icon} {CATEGORIES.find(c => c.value === video.category)?.label}
                                        </span>
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
                    <p className="text-4xl mb-4">🎬</p>
                    <h3 className="text-xl font-bold text-white mb-2">No Videos Found</h3>
                    <p className="text-gray-400">Try a different search or category filter</p>
                </div>
            )}
        </div>
    )
}
