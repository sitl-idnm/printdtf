export type CaseStat = { value: string, note: string }

function ruPlural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

function formatDays(n: number, unit: 'day' | 'sut'): string {
  if (unit === 'sut') {
    return ruPlural(n, 'сутки', 'суток', 'суток')
  }
  return ruPlural(n, 'день', 'дня', 'дней')
}

export function parseCaseStats(meta?: string, stats?: Array<CaseStat>): Array<CaseStat> {
  if (stats?.length) return stats
  const src = meta ?? ''
  const res: Array<CaseStat> = []

  const meters = src.match(/(\d+)\s*м(?!ин)/i)
  const pieces = src.match(/(\d+)\s*шт/i)
  const sets = src.match(/(\d+)\s*набор/i)
  const days = src.match(/(\d+)\s*(дн|сут)/i)

  if (pieces) res.push({ value: pieces[1], note: 'шт' })
  if (meters) res.push({ value: `${meters[1]}м`, note: 'м' })
  if (sets) res.push({ value: sets[1], note: 'наборов' })
  if (days) res.push({ value: days[1], note: days[2].toLowerCase() === 'сут' ? 'сутки' : 'день' })

  // ensure exactly three slots for the modal layout
  while (res.length < 3) res.push({ value: '—', note: '' })
  return res.slice(0, 3)
}

export function formatCaseHoverLine(meta?: string, stats?: Array<CaseStat>): string {
  const parsed = parseCaseStats(meta, stats)
  // pick the most "card-friendly" pair: pieces/sets/meters + days
  const qty =
    parsed.find((s) => s.note === 'шт' && s.value !== '—') ??
    parsed.find((s) => s.note === 'наборов' && s.value !== '—') ??
    parsed.find((s) => s.note === 'м' && s.value !== '—')

  const days = parsed.find((s) => (s.note === 'день' || s.note === 'сутки') && s.value !== '—')

  const left = qty ? `${qty.value} ${qty.note}` : ''
  const right = (() => {
    if (!days) return ''
    const n = parseInt(days.value, 10)
    if (!Number.isFinite(n)) return `${days.value} ${days.note}`
    const unit = days.note === 'сутки' ? 'sut' : 'day'
    return `${n} ${formatDays(n, unit)}`
  })()

  if (left && right) return `${left} — ${right}`
  return left || right || ''
}
