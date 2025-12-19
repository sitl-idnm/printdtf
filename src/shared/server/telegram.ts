const API_BASE = 'https://api.telegram.org'

function getBotToken (): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('Missing env TELEGRAM_BOT_TOKEN')
  return token
}

export async function tgSendMessage (chatId: number | string, text: string) {
  const token = getBotToken()
  const url = `${API_BASE}/bot${token}/sendMessage`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
  })
  if (!res.ok) {
    // eslint-disable-next-line no-console
    console.error('[tgSendMessage] failed', await res.text())
  }
  return res.ok
}




