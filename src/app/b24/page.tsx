/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCallback, useMemo, useState } from 'react'
import { Wrapper } from '@ui/wrapper'
import { Heading } from '@ui/heading'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import { maskPhoneInput } from '@/shared/utils/phone'

type Lead = {
  ID: string
  TITLE?: string
  NAME?: string
  LAST_NAME?: string
  SECOND_NAME?: string
  STATUS_ID?: string
  STATUS_DESCRIPTION?: string
  ASSIGNED_BY_ID?: string
  PHONE?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
  EMAIL?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
  COMMENTS?: string
  DATE_CREATE?: string
  DATE_MODIFY?: string
  SOURCE_ID?: string
  OPPORTUNITY?: string
  CURRENCY_ID?: string
}

export default function BitrixPortalPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lead, setLead] = useState<Lead | null>(null)
  const [normalized, setNormalized] = useState<string | null>(null)

  const fullName = useMemo(() => {
    if (!lead) return ''
    const parts = [lead.LAST_NAME, lead.NAME, lead.SECOND_NAME].filter(Boolean)
    return parts.join(' ').trim()
  }, [lead])

  const onSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.()
    setLoading(true)
    setError(null)
    setLead(null)
    try {
      const res = await fetch('/api/b24/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Request failed')
      }
      setLead(data.lead || null)
      setNormalized(data.phone || null)
      if (!data.lead) {
        setError('По данному номеру лида не найдено / No lead found for this number')
      }
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [phone])

  return (
    <Wrapper>
      <div style={{ maxWidth: 720, margin: '40px auto', padding: '24px' }}>
        <Heading tagName='h1' size='lg'>Личный кабинет Bitrix24 / Bitrix24 Portal</Heading>

        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16 }}>
          <Input
            type='tel'
            placeholder='+7 999 123-45-67'
            value={phone}
            onChange={(e) => setPhone(maskPhoneInput(e.target.value))}
            disabled={loading}
            inputMode='tel'
            aria-label='Phone'
          />
          <Button type='submit' disabled={loading || !phone.trim()}>
            {loading ? 'Поиск...' : 'Войти / Find'}
          </Button>
        </form>
        {normalized && (
          <div style={{ marginTop: 8, color: '#6b7280', fontSize: 14 }}>
            Нормализованный номер / Normalized: {normalized}
          </div>
        )}
        {error && (
          <div style={{ marginTop: 12, color: '#ef4444' }}>
            {error}
          </div>
        )}

        {lead && (
          <div style={{ marginTop: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <Heading tagName='h2' size='md'>Информация по лиду / Lead details</Heading>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, marginTop: 12 }}>
              <div>ID</div>
              <div>{lead.ID}</div>

              <div>Название / Title</div>
              <div>{lead.TITLE || '—'}</div>

              <div>ФИО / Full name</div>
              <div>{fullName || '—'}</div>

              <div>Статус / Status</div>
              <div>{lead.STATUS_ID || '—'}</div>

              <div>Ответственный (ID) / Assignee</div>
              <div>{lead.ASSIGNED_BY_ID || '—'}</div>

              <div>Телефон(ы) / Phones</div>
              <div>
                {(lead.PHONE || []).length ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(lead.PHONE || []).map(p => (
                      <li key={p.ID}>{p.VALUE} {p.VALUE_TYPE ? `(${p.VALUE_TYPE})` : ''}</li>
                    ))}
                  </ul>
                ) : '—'}
              </div>

              <div>Email(ы)</div>
              <div>
                {(lead.EMAIL || []).length ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(lead.EMAIL || []).map(m => (
                      <li key={m.ID}>{m.VALUE} {m.VALUE_TYPE ? `(${m.VALUE_TYPE})` : ''}</li>
                    ))}
                  </ul>
                ) : '—'}
              </div>

              <div>Создан / Created</div>
              <div>{lead.DATE_CREATE || '—'}</div>

              <div>Изменён / Modified</div>
              <div>{lead.DATE_MODIFY || '—'}</div>

              <div>Источник / Source</div>
              <div>{lead.SOURCE_ID || '—'}</div>

              <div>Сумма / Opportunity</div>
              <div>{lead.OPPORTUNITY ? `${lead.OPPORTUNITY} ${lead.CURRENCY_ID || ''}` : '—'}</div>

              <div>Комментарий / Comments</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{lead.COMMENTS || '—'}</div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}
