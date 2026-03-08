import { verifyToken, getTokenFromHeader } from './jwt'
import { prisma } from './prisma'

export async function getAuthUser(request) {
    const token = getTokenFromHeader(request)
    if (!token) return null

    const payload = verifyToken(token)
    if (!payload) return null

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { id: true, name: true, email: true, role: true },
    })

    return user
}

export async function requireAuth(request) {
    const user = await getAuthUser(request)
    if (!user) {
        return { error: 'Unauthorized', status: 401 }
    }
    return { user }
}

export async function requireAdmin(request) {
    const result = await requireAuth(request)
    if (result.error) return result

    if (result.user.role !== 'admin') {
        return { error: 'Forbidden — Admin access required', status: 403 }
    }
    return result
}
