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

// Formats phone digits into "+7 XXX XXX-XX-XX" format (without parentheses)
export function formatPhoneWithSpaces (phoneDigits: string): string {
  const digits = extractDigits(phoneDigits)
  if (!digits || digits.length < 10) return ''

  // Если начинается с 7 или 8, берем следующие 10 цифр
  let national = digits
  if (digits.startsWith('7') && digits.length >= 11) {
    national = digits.slice(1, 11)
  } else if (digits.startsWith('8') && digits.length >= 11) {
    national = digits.slice(1, 11)
  } else if (digits.length >= 10) {
    national = digits.slice(-10) // Берем последние 10 цифр
  }

  if (national.length !== 10) return ''

  const part1 = national.slice(0, 3)  // 903
  const part2 = national.slice(3, 6)  // 744
  const part3 = national.slice(6, 8)  // 76
  const part4 = national.slice(8, 10) // 81

  return `+7 ${part1} ${part2}-${part3}-${part4}`
}

// Apply mask to any raw input string
export function maskPhoneInput (raw: string, previousValue?: string): string {
  // If backspace was pressed and we're removing characters
  if (previousValue && raw.length < previousValue.length) {
    const rawDigits = extractDigits(raw)
    const clamped = rawDigits.slice(0, 10)
    return formatPhoneFromDigits(clamped)
  }

  const rawDigits = extractDigits(raw)
  // Treat starting "7" or "8" as country code; keep only national 10 digits
  let national = rawDigits
  if (rawDigits.startsWith('7') || rawDigits.startsWith('8')) {
    national = rawDigits.slice(1)
  }
  const clamped = national.slice(0, 10)
  return formatPhoneFromDigits(clamped)
}
