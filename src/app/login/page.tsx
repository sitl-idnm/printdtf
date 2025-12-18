/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCallback, useMemo, useState } from 'react'
import { Wrapper } from '@ui/wrapper'
import { Heading } from '@ui/heading'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import { maskPhoneInput } from '@/shared/utils/phone'
import styles from './login.module.scss'

export default function LoginPage () {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [normalized, setNormalized] = useState<string | null>(null)
  const [lead, setLead] = useState<Lead | null>(null)
  const [contact, setContact] = useState<Contact | null>(null)
  const [deals, setDeals] = useState<BitrixDeal[]>([])
  const [openDealIds, setOpenDealIds] = useState<Record<string, boolean>>({})

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

  type Contact = {
    ID: string
    NAME?: string
    LAST_NAME?: string
    SECOND_NAME?: string
    POST?: string
    COMPANY_ID?: string
    ASSIGNED_BY_ID?: string
    TYPE_ID?: string
    SOURCE_ID?: string
    COMMENTS?: string
    PHONE?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
    EMAIL?: Array<{ ID: string; VALUE: string; VALUE_TYPE?: string }>
    DATE_CREATE?: string
    DATE_MODIFY?: string
  }
  type BitrixDeal = {
    ID: string
    TITLE?: string
    STAGE_ID?: string
    CATEGORY_ID?: string
    ASSIGNED_BY_ID?: string
    CONTACT_ID?: string
    COMPANY_ID?: string
    OPPORTUNITY?: string
    CURRENCY_ID?: string
    DATE_CREATE?: string
    DATE_MODIFY?: string
  }

  const fullName = useMemo(() => {
    const entity = lead || contact
    if (!entity) return ''
    const parts = [entity.LAST_NAME, entity.NAME, entity.SECOND_NAME].filter(Boolean)
    return parts.join(' ').trim()
  }, [lead, contact])

  const onSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.()
    setLoading(true)
    setError(null)
    setLead(null)
    setContact(null)
    setNormalized(null)
    setDeals([])
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
      setContact(data.contact || null)
      setNormalized(data.phone || null)
      if (!data.lead && !data.contact) {
        setError('По данному номеру не найден Lead/Contact в CRM')
        } else {
          // fetch deals for contact or company
          const contactId = (data.contact && data.contact.ID) || null
          const companyId = (data.contact && data.contact.COMPANY_ID) || null
          if (contactId || companyId) {
            const respDeals = await fetch('/api/b24/deals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contactId, companyId })
            })
            const dealsData = await respDeals.json()
            if (respDeals.ok) {
              setDeals(dealsData.deals || [])
            }
          }
      }
    } catch (err: any) {
      setError(err?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [phone])

  const toggleDeal = (id: string) => {
    setOpenDealIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Wrapper>
      <div className={styles.container}>
        <Heading tagName='h1' size='sm' className={styles.title}>Поиск по номеру телефона / Phone lookup</Heading>
        <form onSubmit={onSubmit} className={styles.form}>
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
            {loading ? 'Поиск...' : 'Показать'}
          </Button>
          {normalized && (
            <div className={styles.hint}>
              Нормализованный номер: {normalized}
            </div>
          )}
          {error && <div style={{ color: '#ef4444' }}>{error}</div>}
        </form>

        {(lead || contact) && (
          <div className={`${styles.card} ${styles.section}`}>
            <Heading tagName='h2' size='md'>
              {lead ? 'Информация по лиду / Lead details' : 'Информация по контакту / Contact details'}
            </Heading>
            <div className={`${styles.grid}`} style={{ marginTop: 12 }}>
              <div>ID</div>
              <div>{(lead || contact)?.ID}</div>
              {lead ? (
                <>
                  <div>Название</div>
                  <div>{lead.TITLE || '—'}</div>
                </>
              ) : null}
              <div>ФИО</div>
              <div>{fullName || '—'}</div>
              {lead ? (
                <>
                  <div>Статус</div>
                  <div>{lead.STATUS_ID || '—'}</div>
                </>
              ) : null}
              <div>Ответственный (ID)</div>
              <div>{(lead || contact)?.ASSIGNED_BY_ID || '—'}</div>
              <div>Телефон(ы)</div>
              <div>
                {(((lead || contact)?.PHONE) || []).length ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(((lead || contact)?.PHONE) || []).map(p => (
                      <li key={p.ID}>{p.VALUE} {p.VALUE_TYPE ? `(${p.VALUE_TYPE})` : ''}</li>
                    ))}
                  </ul>
                ) : '—'}
              </div>
              <div>Email(ы)</div>
              <div>
                {(((lead || contact)?.EMAIL) || []).length ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(((lead || contact)?.EMAIL) || []).map(m => (
                      <li key={m.ID}>{m.VALUE} {m.VALUE_TYPE ? `(${m.VALUE_TYPE})` : ''}</li>
                    ))}
                  </ul>
                ) : '—'}
              </div>
              <div>Создан</div>
              <div>{(lead || contact)?.DATE_CREATE || '—'}</div>
              <div>Изменён</div>
              <div>{(lead || contact)?.DATE_MODIFY || '—'}</div>
              {lead ? (
                <>
                  <div>Источник</div>
                  <div>{lead.SOURCE_ID || '—'}</div>
                  <div>Сумма</div>
                  <div>{lead.OPPORTUNITY ? `${lead.OPPORTUNITY} ${lead.CURRENCY_ID || ''}` : '—'}</div>
                </>
              ) : (
                <>
                  <div>Источник</div>
                  <div>{contact?.SOURCE_ID || '—'}</div>
                </>
              )}
              <div>Комментарий</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{(lead || contact)?.COMMENTS || '—'}</div>
            </div>
          </div>
        )}

        {deals.length > 0 && (
          <div className={styles.section}>
            <Heading tagName='h2' size='md'>Сделки</Heading>
            <div className={styles.accordion}>
              {deals.map((d) => {
                const isOpen = !!openDealIds[d.ID]
                return (
                  <div key={d.ID} className={styles.dealItem}>
                    <div className={styles.dealHeader} onClick={() => toggleDeal(d.ID)}>
                      <a href={`/deal/${d.ID}`} className={styles.dealTitle} onClick={(e) => e.stopPropagation()}>
                        {d.TITLE || `Сделка #${d.ID}`}
                      </a>
                      <div className={styles.badge}>{d.STAGE_ID || 'stage?'}</div>
                    </div>
                    {isOpen && (
                      <div className={styles.dealBody}>
                        <div className={styles.grid}>
                          <div>ID</div><div>{d.ID}</div>
                          <div>Категория</div><div>{d.CATEGORY_ID || '—'}</div>
                          <div>Ответственный (ID)</div><div>{d.ASSIGNED_BY_ID || '—'}</div>
                          <div>Контакт ID</div><div>{d.CONTACT_ID || '—'}</div>
                          <div>Компания ID</div><div>{d.COMPANY_ID || '—'}</div>
                          <div>Сумма</div><div>{d.OPPORTUNITY ? `${d.OPPORTUNITY} ${d.CURRENCY_ID || ''}` : '—'}</div>
                          <div>Создана</div><div>{d.DATE_CREATE || '—'}</div>
                          <div>Изменена</div><div>{d.DATE_MODIFY || '—'}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}


