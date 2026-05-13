'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Brain, Play, Star, ChevronRight, Sparkles,
  Users, BookOpen, MessageSquare, Trophy, ArrowRight,
  CheckCircle, Zap, Target, Shield,
  Code2, Stethoscope, Cog, Briefcase, Palette, Heart
} from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    desc: 'Our intelligent system analyzes your interests, strengths, and quiz answers to suggest the 3 best career fields for you.',
    color: 'indigo',
  },
  {
    icon: Play,
    title: 'Career Guidance Videos',
    desc: 'Watch curated short videos about Medical, Engineering, CS, Business, and Arts fields — learn what each career is really like.',
    color: 'violet',
  },
  {
    icon: Target,
    title: 'Smart Quiz System',
    desc: 'Answer 10 thoughtful questions about your interests and abilities to unlock your personalized career recommendation.',
    color: 'cyan',
  },
  {
    icon: MessageSquare,
    title: 'AI Career Chatbot',
    desc: 'Ask MindBot anything about careers in Pakistan — from subjects needed, to salary, to top universities.',
    color: 'emerald',
  },
  {
    icon: BookOpen,
    title: 'Book Recommendations',
    desc: 'Get curated book lists for your recommended field to start learning even before university.',
    color: 'amber',
  },
  {
    icon: Trophy,
    title: 'Track Your Progress',
    desc: 'Monitor your quiz history, videos watched, and recommendation journey all from your personal dashboard.',
    color: 'rose',
  },
]

const CAREER_FIELDS = [
  { icon: Code2, name: 'Computer Science', tag: 'High Demand', color: '#FFFFFF' },
  { icon: Stethoscope, name: 'Medical', tag: 'Prestigious', color: '#10b981' },
  { icon: Cog, name: 'Engineering', tag: 'In-Demand', color: '#f59e0b' },
  { icon: Briefcase, name: 'Business', tag: 'Versatile', color: '#EDEDED' },
  { icon: Palette, name: 'Arts & Design', tag: 'Creative', color: '#f43f5e' },
]

const STATS = [
  { value: '5+', label: 'Career Fields' },
  { value: '50+', label: 'Guidance Videos' },
  { value: 'AI', label: 'Powered Chatbot' },
  { value: '100%', label: 'Free to Use' },
]

const colorMap = {
  indigo: { bg: 'rgba(255, 255, 255,0.1)', border: 'rgba(255, 255, 255,0.2)', icon: '#FFFFFF' },
  violet: { bg: 'rgba(237, 237, 237,0.1)', border: 'rgba(237, 237, 237,0.2)', icon: '#EDEDED' },
  cyan: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', icon: '#06b6d4' },
  emerald: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', icon: '#10b981' },
  amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', icon: '#f59e0b' },
  rose: { bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.2)', icon: '#f43f5e' },
}

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard')
    }
  }, [user, router])

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border border-[#262626]" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
              MindField
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px' }}>Login</Link>
            <Link href="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #FFFFFF, transparent)' }} />
        <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #EDEDED, transparent)' }} />
        <div className="absolute bottom-0 left-1/2 w-80 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] border border-[#262626] mb-8 animate-fade-up"
            style={{ border: '1px solid rgba(255, 255, 255,0.3)' }}>
            <Sparkles size={14} className="text-zinc-300" />
            <span className="text-sm text-blue-300 font-medium">AI-Powered Career Guidance for Pakistani Students</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-up"
            style={{ fontFamily: 'var(--font-display)', animationDelay: '0.1s' }}>
            Find Your{' '}
            <span className="gradient-text">Perfect Career</span>
            {' '}Path
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}>
            Confused after Matric or Intermediate? MindField uses AI to analyze your interests and
            recommend the perfect academic field — with videos, quizzes, and a 24/7 career chatbot.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: '0.3s' }}>
            <Link href="/signup" className="btn-primary text-lg w-full sm:w-auto justify-center"
              style={{ padding: '14px 32px' }}>
              <Sparkles size={18} />
              Start for Free
            </Link>
            <Link href="/login" className="btn-secondary text-lg w-full sm:w-auto justify-center"
              style={{ padding: '14px 32px' }}>
              <Play size={18} />
              Watch Demo
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-3xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Career Fields Strip */}
      <section className="py-12 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8 font-medium">Fields We Guide You Through</p>
          <div className="flex flex-wrap justify-center gap-4">
            {CAREER_FIELDS.map((field, i) => {
              const Icon = field.icon
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#0a0a0a] border border-[#262626]"
                  style={{ border: `1px solid ${field.color}30` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${field.color}15` }}>
                    <Icon size={20} style={{ color: field.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{field.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${field.color}20`, color: field.color }}>
                      {field.tag}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Everything You Need to{' '}
              <span className="gradient-text">Decide Your Future</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              MindField combines AI intelligence with expert career knowledge to guide Pakistani students towards the right path.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              const c = colorMap[feature.color]
              return (
                <div key={i} className="card hover:border-zinc-600 transition-colors animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
                  <div className="p-3 rounded-xl w-fit mb-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <Icon size={22} style={{ color: c.icon }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6" style={{ background: '#0d1117' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              How MindField Works
            </h2>
            <p className="text-gray-400 text-lg">Three simple steps to your personalized career recommendation</p>
          </div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Create Your Account', desc: 'Sign up for free — no credit card needed. Just your name, email and a password.', icon: Users },
              { step: '02', title: 'Take the AI Quiz', desc: 'Answer 10 smart questions about your interests, strengths, and preferences.', icon: Target },
              { step: '03', title: 'Get Your Recommendations', desc: 'Receive your top 3 career field recommendations with explanation, videos, and books.', icon: Sparkles },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex gap-6 items-start bg-[#0a0a0a] border border-[#262626] p-6 rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center">
                      <Icon size={22} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-300 mb-1">STEP {item.step}</p>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-12 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255,0.15), rgba(237, 237, 237,0.15))', border: '1px solid rgba(255, 255, 255,0.2)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #FFFFFF, transparent)' }} />
            <Sparkles size={40} className="text-zinc-300 mx-auto mb-6 " />
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to Find Your Path?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of Pakistani students who have found their dream career field with MindField.
            </p>
            <Link href="/signup" className="btn-primary text-lg" style={{ padding: '14px 40px' }}>
              Start for Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Brain size={16} className="text-zinc-300" />
          <span className="font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>MindField</span>
        </div>
        <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5 flex-wrap">
          AI Career Guidance System for Pakistani Students — Built with
          <Heart size={12} className="text-rose-400 inline-block" fill="#f43f5e" />
          for a brighter future
        </p>
      </footer>
    </div>
  )
}
