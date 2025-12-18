export function normalizePhoneToE164 (raw: string): string {
  const digitsOnly = (raw || '').replace(/\D+/g, '')
  if (!digitsOnly) return ''

  // Handle Russia-specific cases and generic E.164 fallback
  // - If starts with 8 and length 11 -> +7XXXXXXXXXX
  // - If starts with 7 and length 11 -> +7XXXXXXXXXX
  // - If starts with 9 and length 10 -> +7XXXXXXXXXX (assume Russia mobile)
  // - If already includes country code (length 11-15) -> prefix with +
  if (digitsOnly.length === 11 && (digitsOnly.startsWith('7') || digitsOnly.startsWith('8'))) {
    return `+7${digitsOnly.slice(1)}`
  }
  if (digitsOnly.length === 10 && digitsOnly.startsWith('9')) {
    return `+7${digitsOnly}`
  }
  if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
    return `+${digitsOnly}`
  }
  // Fallback: return with plus if looks plausible
  return `+${digitsOnly}`
}

export function extractDigits (raw: string): string {
  return (raw || '').replace(/\D+/g, '')
}

// Formats 10 national digits into "+7 (XXX) XXX-XX-XX"
export function formatPhoneFromDigits (national10: string): string {
  const core = (national10 || '').slice(0, 10)
  if (core.length === 0) return ''
  const part1 = core.slice(0, 3)
  const part2 = core.slice(3, 6)
  const part3 = core.slice(6, 8)
  const part4 = core.slice(8, 10)
  let out = '+7'
  if (part1) out += ` (${part1}`
  if (core.length >= 3) out += `)`
  if (part2) out += ` ${part2}`
  if (part3) out += `-${part3}`
  if (part4) out += `-${part4}`
  return out
}

// Apply mask to any raw input string
export function maskPhoneInput (raw: string): string {
  const rawDigits = extractDigits(raw)
  // Treat starting "7" as country code; keep only national 10 digits
  const national = rawDigits.startsWith('7') ? rawDigits.slice(1) : rawDigits
  const clamped = national.slice(0, 10)
  return formatPhoneFromDigits(clamped)
}


