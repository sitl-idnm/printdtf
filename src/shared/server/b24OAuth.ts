import fs from 'fs/promises'
import path from 'path'

type TokenRecord = {
  accessToken: string
  refreshToken: string
  expiresAtMs: number
}

const DATA_DIR = path.join(process.cwd(), '.data')
const TOKEN_FILE = path.join(DATA_DIR, 'b24_oauth.json')

let memoryToken: TokenRecord | null = null

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {
    // ignore
  }
}

export async function readToken(): Promise<TokenRecord | null> {
  if (memoryToken) return memoryToken
  try {
    const raw = await fs.readFile(TOKEN_FILE, 'utf-8')
    const parsed = JSON.parse(raw) as TokenRecord
    memoryToken = parsed
    return parsed
  } catch {
    return null
  }
}

export async function writeToken(rec: TokenRecord): Promise<void> {
  memoryToken = rec
  await ensureDir()
  try {
    await fs.writeFile(TOKEN_FILE, JSON.stringify(rec), 'utf-8')
  } catch {
    // ignore
  }
}

function nowMs(): number {
  return Date.now()
}

function secondsFromNow(sec: number): number {
  return nowMs() + sec * 1000
}

export async function exchangeCodeForToken(code: string): Promise<TokenRecord | null> {
  const clientId = process.env.BITRIX_OAUTH_CLIENT_ID
  const clientSecret = process.env.BITRIX_OAUTH_CLIENT_SECRET
  const redirectUri = getRedirectUri()
  if (!clientId || !clientSecret || !redirectUri) return null

  const form = new URLSearchParams()
  form.set('grant_type', 'authorization_code')
  form.set('client_id', clientId)
  form.set('client_secret', clientSecret)
  form.set('code', code)
  form.set('redirect_uri', redirectUri)

  const res = await fetch('https://oauth.bitrix.info/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  })
  if (!res.ok) return null
  const data = await res.json() as {
    access_token?: string
    refresh_token?: string
    expires_in?: number
  }
  if (!data?.access_token || !data?.refresh_token || !data?.expires_in) return null
  const rec: TokenRecord = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAtMs: secondsFromNow(Math.max(60, data.expires_in - 30)) // safety buffer
  }
  await writeToken(rec)
  return rec
}

export function getRedirectUri(): string | null {
  // Prefer public production URI if present; otherwise dev
  const dev = 'http://localhost:3000/api/b24/oauth/callback'
  const prod = 'https://city-group.pro/api/b24/oauth/callback'
  // Allow override via env
  return process.env.B24_OAUTH_REDIRECT_URI || prod || dev
}

export async function refreshAccessToken(): Promise<TokenRecord | null> {
  const clientId = process.env.BITRIX_OAUTH_CLIENT_ID
  const clientSecret = process.env.BITRIX_OAUTH_CLIENT_SECRET
  const current = await readToken()
  if (!clientId || !clientSecret || !current?.refreshToken) return null

  const form = new URLSearchParams()
  form.set('grant_type', 'refresh_token')
  form.set('client_id', clientId)
  form.set('client_secret', clientSecret)
  form.set('refresh_token', current.refreshToken)

  const res = await fetch('https://oauth.bitrix.info/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form
  })
  if (!res.ok) return null
  const data = await res.json() as {
    access_token?: string
    refresh_token?: string
    expires_in?: number
  }
  if (!data?.access_token || !data?.refresh_token || !data?.expires_in) return null
  const rec: TokenRecord = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAtMs: secondsFromNow(Math.max(60, data.expires_in - 30))
  }
  await writeToken(rec)
  return rec
}

export async function getValidAccessToken(): Promise<string | null> {
  const tok = await readToken()
  if (tok && tok.expiresAtMs > nowMs()) {
    return tok.accessToken
  }
  const refreshed = await refreshAccessToken()
  return refreshed?.accessToken || null
}

