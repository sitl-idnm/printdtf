/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Wrapper } from '@ui/wrapper'
import { Heading } from '@ui/heading'
import { Button } from '@ui/button'
import styles from './lk.module.scss'

type Lead = {
  ID: string
  TITLE?: string
  NAME?: string
  LAST_NAME?: string
  SECOND_NAME?: string
  STATUS_ID?: string
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

export default function LkPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lead, setLead] = useState<Lead | null>(null)
  const [phone, setPhone] = useState<string | null>(null)

  const fullName = useMemo(() => {
    if (!lead) return ''
    const parts = [lead.LAST_NAME, lead.NAME, lead.SECOND_NAME].filter(Boolean)
    return parts.join(' ').trim()
  }, [lead])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/b24/me', { method: 'GET' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed')
      }
      setLead(data.lead || null)
      setPhone(data.phone || null)
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }, [])

  return (
    <Wrapper>
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Heading tagName='h1' size='sm'>Личный кабинет / Account</Heading>
          <Button onClick={logout}>Выйти / Logout</Button>
        </div>

        {loading && <div className={styles.section}>Загрузка...</div>}
        {error && <div className={styles.section} style={{ color: '#ef4444' }}>{error}</div>}

        {!loading && !error && (
          <>
            <div className={styles.section} style={{ color: '#6b7280' }}>Номер телефона: {phone || '—'}</div>

            {lead ? (
              <div className={`${styles.card} ${styles.section}`}>
                <Heading tagName='h2' size='md'>Данные лида</Heading>
                <div className={styles.grid} style={{ marginTop: 12 }}>
                  <div>ID</div>
                  <div>{lead.ID}</div>
                  <div>Название</div>
                  <div>{lead.TITLE || '—'}</div>
                  <div>ФИО</div>
                  <div>{fullName || '—'}</div>
                  <div>Статус</div>
                  <div>{lead.STATUS_ID || '—'}</div>
                  <div>Ответственный (ID)</div>
                  <div>{lead.ASSIGNED_BY_ID || '—'}</div>
                  <div>Телефон(ы)</div>
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
                  <div>Создан</div>
                  <div>{lead.DATE_CREATE || '—'}</div>
                  <div>Изменён</div>
                  <div>{lead.DATE_MODIFY || '—'}</div>
                  <div>Источник</div>
                  <div>{lead.SOURCE_ID || '—'}</div>
                  <div>Сумма</div>
                  <div>{lead.OPPORTUNITY ? `${lead.OPPORTUNITY} ${lead.CURRENCY_ID || ''}` : '—'}</div>
                  <div>Комментарий</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{lead.COMMENTS || '—'}</div>
                </div>
              </div>
            ) : (
              <div className={styles.section}>
                Лид не найден по вашему номеру. Свяжитесь с поддержкой.
              </div>
            )}
          </>
        )}
      </div>
    </Wrapper>
  )
}
