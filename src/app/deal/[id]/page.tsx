/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Wrapper } from '@ui/wrapper'
import { Heading } from '@ui/heading'
import styles from './deal.module.scss'

type Deal = {
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

type Contact = {
  ID: string
  NAME?: string
  LAST_NAME?: string
  SECOND_NAME?: string
  PHONE?: Array<{ ID: string; VALUE: string }>
  EMAIL?: Array<{ ID: string; VALUE: string }>
}

type Company = {
  ID: string
  TITLE?: string
  PHONE?: Array<{ ID: string; VALUE: string }>
  EMAIL?: Array<{ ID: string; VALUE: string }>
}

export default function DealPage () {
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deal, setDeal] = useState<Deal | null>(null)
  const [contact, setContact] = useState<Contact | null>(null)
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/b24/deal/${params.id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load deal')
        setDeal(data.deal || null)
        setContact(data.contact || null)
        setCompany(data.company || null)
      } catch (e: unknown) {
        setError((e instanceof Error ? e.message : 'Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    if (params?.id) load()
  }, [params?.id])

  return (
    <Wrapper>
      <div className={styles.container}>
        <Heading tagName='h1' size='sm'>Сделка #{params.id}</Heading>

        {loading && <div style={{ marginTop: 16 }}>Загрузка...</div>}
        {error && <div style={{ marginTop: 16, color: '#ef4444' }}>{error}</div>}

        {deal && (
          <div className={styles.card} style={{ marginTop: 16 }}>
            <Heading tagName='h2' size='md'>{deal.TITLE || `Сделка #${deal.ID}`}</Heading>
            <div className={styles.grid} style={{ marginTop: 12 }}>
              <div>ID</div><div>{deal.ID}</div>
              <div>Стадия</div><div>{deal.STAGE_ID || '—'}</div>
              <div>Категория</div><div>{deal.CATEGORY_ID || '—'}</div>
              <div>Ответственный (ID)</div><div>{deal.ASSIGNED_BY_ID || '—'}</div>
              <div>Контакт ID</div><div>{deal.CONTACT_ID || '—'}</div>
              <div>Компания ID</div><div>{deal.COMPANY_ID || '—'}</div>
              <div>Сумма</div><div>{deal.OPPORTUNITY ? `${deal.OPPORTUNITY} ${deal.CURRENCY_ID || ''}` : '—'}</div>
              <div>Создана</div><div>{deal.DATE_CREATE || '—'}</div>
              <div>Изменена</div><div>{deal.DATE_MODIFY || '—'}</div>
            </div>
          </div>
        )}

        {contact && (
          <div className={styles.card} style={{ marginTop: 16 }}>
            <Heading tagName='h3' size='sm'>Контакт</Heading>
            <div className={styles.grid} style={{ marginTop: 12 }}>
              <div>ID</div><div>{contact.ID}</div>
              <div>ФИО</div><div>{[contact.LAST_NAME, contact.NAME, contact.SECOND_NAME].filter(Boolean).join(' ') || '—'}</div>
              <div>Телефон</div><div>{(contact.PHONE || []).map(p => p.VALUE).join(', ') || '—'}</div>
              <div>Email</div><div>{(contact.EMAIL || []).map(m => m.VALUE).join(', ') || '—'}</div>
            </div>
          </div>
        )}

        {company && (
          <div className={styles.card} style={{ marginTop: 16 }}>
            <Heading tagName='h3' size='sm'>Компания</Heading>
            <div className={styles.grid} style={{ marginTop: 12 }}>
              <div>ID</div><div>{company.ID}</div>
              <div>Название</div><div>{company.TITLE || '—'}</div>
              <div>Телефон</div><div>{(company.PHONE || []).map(p => p.VALUE).join(', ') || '—'}</div>
              <div>Email</div><div>{(company.EMAIL || []).map(m => m.VALUE).join(', ') || '—'}</div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}
