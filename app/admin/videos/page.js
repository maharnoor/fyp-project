'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Video, Plus, Trash2, Edit, X, Check } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/Cards'
import FieldIcon from '@/components/ui/FieldIcon'

const DEMO_VIDEOS = [
    { id: 'v1', title: 'Introduction to Computer Science Careers', category: 'cs', url: 'https://www.youtube.com/embed/SzJ46YA_RaA', description: 'Explore the world of software engineering, AI, and data science careers in Pakistan.', duration: 480 },
    { id: 'v2', title: 'How to Become a Doctor in Pakistan', category: 'medical', url: 'https://www.youtube.com/embed/lK02m6dtrHQ', description: 'Complete guide to MBBS admission.', duration: 600 },
    { id: 'v3', title: 'Engineering Career Paths in Pakistan', category: 'engineering', url: 'https://www.youtube.com/embed/uk-cykGFly4', description: 'Civil, Mechanical, Electrical engineering overview.', duration: 540 },
]

const CATEGORIES = ['cs', 'medical', 'engineering', 'business', 'arts']

export default function AdminVideosPage() {
    const { token } = useAuth()
    const [videos, setVideos] = useState(DEMO_VIDEOS)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', description: '', category: 'cs', url: '', duration: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetchVideos() {
            setLoading(true)
            try {
                const res = await fetch('/api/videos', { headers: { Authorization: `Bearer ${token}` } })
                const data = await res.json()
                if (data.videos?.length > 0) setVideos(data.videos)
            } catch { }
            finally { setLoading(false) }
        }
        if (token) fetchVideos()
    }, [token])

    const handleAdd = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, duration: parseInt(form.duration) || 0 }),
            })
            const data = await res.json()
            if (res.ok) {
                setVideos(prev => [data.video, ...prev])
                setShowForm(false)
                setForm({ title: '', description: '', category: 'cs', url: '', duration: '' })
            }
        } catch { }
        finally { setSaving(false) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this video?')) return
        try {
            await fetch(`/api/videos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            setVideos(prev => prev.filter(v => v.id !== id))
        } catch { }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Manage Videos</h1>
                    <p className="text-gray-400 mt-1">Add and manage career guidance videos</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    <Plus size={16} /> Add Video
                </button>
            </div>

            {/* Add Video Form */}
            {showForm && (
                <div className="card animate-scale-in" style={{ border: '1px solid rgba(99,102,241,0.3)' }}>
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-white">Add New Video</h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Title *</label>
                                <input className="input-field" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Video title" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Category *</label>
                                <select className="input-field" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">YouTube Embed URL *</label>
                            <input className="input-field" required value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://www.youtube.com/embed/..." />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Description</label>
                            <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Video description..." />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Duration (seconds)</label>
                            <input className="input-field" type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="480" />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={saving} className="btn-primary">
                                {saving ? 'Saving...' : <><Check size={16} /> Add Video</>}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Videos Table */}
            {loading ? (
                <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    {['Title', 'Category', 'URL', 'Actions'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {videos.map((video) => (
                                    <tr key={video.id} className="hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-white">{video.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{video.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="badge text-xs inline-flex items-center gap-1" style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                <FieldIcon field={video.category} size={11} /> {video.category?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={video.url} target="_blank" rel="noopener" className="text-xs text-indigo-400 hover:underline truncate block max-w-[200px]">
                                                {video.url}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDelete(video.id)} className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-lg hover:bg-red-400/10">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {videos.length === 0 && (
                            <p className="text-center text-gray-500 py-10">No videos yet. Add your first video!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
