import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mindfield-secret-key-change-in-production'

export function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return null
    }
}

export function getTokenFromHeader(request) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null
    return authHeader.split(' ')[1]
}
