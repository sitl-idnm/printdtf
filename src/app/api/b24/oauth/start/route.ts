import { NextResponse } from 'next/server'
import { getRedirectUri } from '@/shared/server/b24OAuth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const clientId = process.env.BITRIX_OAUTH_CLIENT_ID
  const redirectUri = getRedirectUri()
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Missing OAuth config' }, { status: 500 })
  }
  const authUrl = new URL('https://oauth.bitrix.info/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('redirect_uri', redirectUri)
  return NextResponse.redirect(authUrl.toString(), { status: 302 })
}

