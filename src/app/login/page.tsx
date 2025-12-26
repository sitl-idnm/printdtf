/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCallback, useState } from 'react'
import { Wrapper } from '@ui/wrapper'
import { Heading } from '@ui/heading'
import { Input } from '@ui/input'
import { maskPhoneInput } from '@/shared/utils/phone'
import styles from './login.module.scss'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const onSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Login failed')
      }
      // Redirect to personal cabinet
      const nextUrl = new URLSearchParams(window.location.search).get('next') || '/lk'
      window.location.href = nextUrl
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [phone, password])

  return (
    <Wrapper>
      <div className={styles.container}>
        <Heading tagName='h1' size='sm' className={styles.title}>Вход в личный кабинет</Heading>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <Input
              type='tel'
              placeholder='+7 (999) 123-45-67'
              value={phone}
              onChange={(e) => {
                const newValue = e.target.value
                const isDeleting = newValue.length < phone.length
                let formatted: string

                if (isDeleting) {
                  // При удалении убираем последнюю цифру и переформатируем
                  const digits = phone.replace(/\D/g, '')
                  if (digits.length > 1) {
                    const newDigits = digits.slice(0, -1)
                    formatted = maskPhoneInput(newDigits)
                  } else {
                    formatted = ''
                  }
                } else {
                  formatted = maskPhoneInput(newValue, phone)
                }

                setPhone(formatted)
              }}
              disabled={loading}
              inputMode='tel'
              aria-label='Phone'
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <Input
              type='password'
              placeholder='Пароль'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-label='Password'
              required
            />
          </div>
          <button type='submit' disabled={loading || !phone.trim() || !password.trim()} className={styles.submitButton}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      </div>
    </Wrapper>
  )
}
