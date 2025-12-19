import crypto from 'crypto'

const SESSION_COOKIE = 'sid'
const DEFAULT_TTL_DAYS = 7

type SessionPayload = {
  phone: string
  exp: number // unix seconds
}

function getSecret (): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('Missing env SESSION_SECRET')
  }
  return secret
}

function b64urlEncode (buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function b64urlDecode (str: string): Buffer {
  const pad = 4 - (str.length % 4)
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + (pad < 4 ? '='.repeat(pad) : '')
  return Buffer.from(base64, 'base64')
}

function sign (data: string, secret: string): string {
  const h = crypto.createHmac('sha256', secret)
  h.update(data)
  return b64urlEncode(h.digest())
}

export function createSessionToken (payload: SessionPayload, ttlDays = DEFAULT_TTL_DAYS): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const nowSec = Math.floor(Date.now() / 1000)
  const exp = nowSec + ttlDays * 24 * 60 * 60
  const fullPayload = { ...payload, exp }
  const secret = getSecret()
  const head = b64urlEncode(Buffer.from(JSON.stringify(header)))
  const body = b64urlEncode(Buffer.from(JSON.stringify(fullPayload)))
  const sig = sign(`${head}.${body}`, secret)
  return `${head}.${body}.${sig}`
}

export function verifySessionToken (token: string | undefined | null): SessionPayload | null {
  if (!token) return null
  const secret = getSecret()
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [head, body, sig] = parts
  const expected = sign(`${head}.${body}`, secret)
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null
  }
  try {
    const payload = JSON.parse(b64urlDecode(body).toString()) as SessionPayload
    const nowSec = Math.floor(Date.now() / 1000)
    if (payload.exp && nowSec > payload.exp) return null
    return payload
  } catch {
    return null
  }
}

export function buildSessionCookie (token: string): string {
  const maxAge = 7 * 24 * 60 * 60
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax'
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

export function clearSessionCookie (): string {
  const parts = [
    `${SESSION_COOKIE}=`,
    'HttpOnly',
    'Path=/',
    'Max-Age=0',
    'SameSite=Lax'
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

export function getSessionCookieName (): string {
  return SESSION_COOKIE
}




