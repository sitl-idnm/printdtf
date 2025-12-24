const SESSION_COOKIE = 'sid'

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

function b64urlEncodeBytes (bytes: Uint8Array): string {
  // digest is small (32 bytes), so this is safe
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const base64 = btoa(binary)
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function b64urlDecodeBytes (str: string): Uint8Array {
  const pad = 4 - (str.length % 4)
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + (pad < 4 ? '='.repeat(pad) : '')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function timingSafeEqual (a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i]
  return out === 0
}

async function sign (data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return b64urlEncodeBytes(new Uint8Array(sig))
}

export function getSessionCookieName (): string {
  return SESSION_COOKIE
}

export async function verifySessionToken (token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  const secret = getSecret()
  const parts = token.split('.')
  if (parts.length !== 3) return null

  const [head, body, sig] = parts
  const expectedSig = await sign(`${head}.${body}`, secret)

  // constant-time compare on bytes (avoid early return on string compare)
  if (!timingSafeEqual(b64urlDecodeBytes(sig), b64urlDecodeBytes(expectedSig))) {
    return null
  }

  try {
    const payloadJson = new TextDecoder().decode(b64urlDecodeBytes(body))
    const payload = JSON.parse(payloadJson) as SessionPayload
    const nowSec = Math.floor(Date.now() / 1000)
    if (payload.exp && nowSec > payload.exp) return null
    return payload
  } catch {
    return null
  }
}
