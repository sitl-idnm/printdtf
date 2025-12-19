import crypto from 'crypto'

const STEP_SECONDS = 120 // 2 minutes
const CODE_DIGITS = 6

function getSecret (): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('Missing env SESSION_SECRET')
  }
  return secret
}

function deriveKeyForPhone (phone: string): Buffer {
  const h = crypto.createHmac('sha1', getSecret())
  h.update(`totp:${phone}`)
  return h.digest()
}

function hotp (key: Buffer, counter: number): number {
  const buf = Buffer.alloc(8)
  // big-endian
  for (let i = 7; i >= 0; i--) {
    buf[i] = counter & 0xff
    counter = Math.floor(counter / 256)
  }
  const h = crypto.createHmac('sha1', key).update(buf).digest()
  const offset = h[h.length - 1] & 0x0f
  const bin =
    ((h[offset] & 0x7f) << 24) |
    ((h[offset + 1] & 0xff) << 16) |
    ((h[offset + 2] & 0xff) << 8) |
    (h[offset + 3] & 0xff)
  return bin % 10 ** CODE_DIGITS
}

export function generateCode (phone: string, forTime?: number): string {
  const t = Math.floor((forTime ?? Date.now()) / 1000)
  const counter = Math.floor(t / STEP_SECONDS)
  const key = deriveKeyForPhone(phone)
  const n = hotp(key, counter)
  return String(n).padStart(CODE_DIGITS, '0')
}

export function verifyCode (phone: string, code: string): boolean {
  const now = Date.now()
  const windows = [0, -1, 1]
  const normalized = (code || '').replace(/\D+/g, '')
  for (const w of windows) {
    const t = now + w * STEP_SECONDS * 1000
    if (generateCode(phone, t) === normalized) return true
  }
  return false
}

export function codeTtlSeconds (): number {
  return STEP_SECONDS
}




