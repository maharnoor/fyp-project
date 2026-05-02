'use client'
import { Code2, Stethoscope, Cog, Briefcase, Palette, Target } from 'lucide-react'

// Maps a career field key (cs/medical/engineering/business/arts) to a lucide icon.
const FIELD_COLOR_MAP = {
    cs: '#6366f1',
    medical: '#10b981',
    engineering: '#f59e0b',
    business: '#8b5cf6',
    arts: '#f43f5e',
}

export function getFieldColor(field) {
    return FIELD_COLOR_MAP[field] || '#6366f1'
}

// Returns the lucide component for a field — used by callers that want to embed
// the icon themselves (e.g. as a default prop). Renders use the FieldIcon component
// below, which dispatches with a switch to keep React 19's static-component rule happy.
export function getFieldIcon(field) {
    switch (field) {
        case 'cs': return Code2
        case 'medical': return Stethoscope
        case 'engineering': return Cog
        case 'business': return Briefcase
        case 'arts': return Palette
        default: return Target
    }
}

export default function FieldIcon({ field, size = 24, className = '', style = {}, useFieldColor = false }) {
    const mergedStyle = useFieldColor
        ? { color: getFieldColor(field), ...style }
        : style
    const props = { size, className, style: mergedStyle }
    switch (field) {
        case 'cs': return <Code2 {...props} />
        case 'medical': return <Stethoscope {...props} />
        case 'engineering': return <Cog {...props} />
        case 'business': return <Briefcase {...props} />
        case 'arts': return <Palette {...props} />
        default: return <Target {...props} />
    }
}
