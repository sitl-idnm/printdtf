/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Wrapper } from '@ui/wrapper'
import { Heading } from '@ui/heading'
import { Button } from '@ui/button'
import styles from './lk.module.scss'

type Lead = {
  [key: string]: unknown
}

type Contact = {
  [key: string]: unknown
}

type BitrixDeal = {
  [key: string]: unknown
}

type BitrixCompany = {
  [key: string]: unknown
}

// Функция для форматирования значения поля
function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? 'Да / Yes' : 'Нет / No'
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) return '—'
      // Если это массив объектов с VALUE (телефоны, email)
      if (value[0] && typeof value[0] === 'object' && 'VALUE' in value[0]) {
        return value.map((item: { VALUE?: string; VALUE_TYPE?: string }) =>
          `${item.VALUE || ''}${item.VALUE_TYPE ? ` (${item.VALUE_TYPE})` : ''}`
        ).join(', ')
      }
      return JSON.stringify(value)
    }
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

// Функция для получения всех полей объекта (исключая служебные)
function getAllFields(obj: Record<string, unknown> | null): Array<{ key: string; value: unknown }> {
  if (!obj) return []
  return Object.entries(obj)
    .filter(([key]) => !key.startsWith('_') && key !== 'result')
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => {
      // Сначала стандартные поля, потом UF_CRM_
      const aIsUf = a.key.startsWith('UF_CRM_')
      const bIsUf = b.key.startsWith('UF_CRM_')
      if (aIsUf && !bIsUf) return 1
      if (!aIsUf && bIsUf) return -1
      return a.key.localeCompare(b.key)
    })
}

export default function LkPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lead, setLead] = useState<Lead | null>(null)
  const [contact, setContact] = useState<Contact | null>(null)
  const [deals, setDeals] = useState<BitrixDeal[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [company, setCompany] = useState<BitrixCompany | null>(null)
  const [openDealIds, setOpenDealIds] = useState<Record<string, boolean>>({})
  const [openLeadIds, setOpenLeadIds] = useState<Record<string, boolean>>({})
  const [openCompany, setOpenCompany] = useState(false)

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
      setContact(data.contact || null)
      setDeals(data.deals || [])
      setLeads(data.leads || [])
      setCompany(data.company || null)
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleDeal = useCallback((id: string) => {
    setOpenDealIds(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const toggleLead = useCallback((id: string) => {
    setOpenLeadIds(prev => ({ ...prev, [id]: !prev[id] }))
  }, [])

  useEffect(() => {
    load()
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }, [])

  const entity = lead || contact
  const entityFields = getAllFields(entity as Record<string, unknown> | null)
  const companyFields = getAllFields(company as Record<string, unknown> | null)

  return (
    <Wrapper>
      <div className={styles.container}>
        <div className={styles.header}>
          <Heading tagName='h1' size='sm'>Личный кабинет / Personal Account</Heading>
          <Button onClick={logout}>Выйти / Logout</Button>
        </div>

        {loading && <div className={styles.section}>Загрузка...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && entity && (
          <>
            {/* Profile Section - Все поля */}
            <div className={`${styles.card} ${styles.section}`}>
              <Heading tagName='h2' size='md' className={styles.cardTitle}>
                {lead ? 'Информация по лиду / Lead Information' : 'Информация по контакту / Contact Information'}
              </Heading>
              <div className={styles.grid}>
                {entityFields.map(({ key, value }) => (
                  <div key={key}>
                    <div className={styles.label}>{key}</div>
                    <div className={styles.value}>{formatFieldValue(value)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Section */}
            {company && (
              <div className={styles.section}>
                <Heading tagName='h2' size='md' className={styles.sectionTitle}>
                  Компания / Company
                </Heading>
                <div className={styles.accordion}>
                  <div className={styles.dealItem}>
                    <div className={styles.dealHeader} onClick={() => setOpenCompany(!openCompany)}>
                      <div className={styles.dealTitle}>
                        {formatFieldValue(company.TITLE) || `Компания #${company.ID} / Company #${company.ID}`}
                      </div>
                      <div className={`${styles.badge} ${styles.arrow}`}>
                        {openCompany ? '▼' : '▶'}
                      </div>
                    </div>
                    {openCompany && (
                      <div className={styles.dealBody}>
                        <div className={styles.grid}>
                          {companyFields.map(({ key, value }) => (
                            <div key={key}>
                              <div className={styles.label}>{key}</div>
                              <div className={styles.value}>{formatFieldValue(value)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Deals Section - Все поля */}
            {deals.length > 0 && (
              <div className={styles.section}>
                <Heading tagName='h2' size='md' className={styles.sectionTitle}>Сделки / Deals</Heading>
                <div className={styles.accordion}>
                  {deals.map((deal) => {
                    const isOpen = !!openDealIds[deal.ID as string]
                    const dealFields = getAllFields(deal as Record<string, unknown>)
                    return (
                      <div key={deal.ID as string} className={styles.dealItem}>
                        <div className={styles.dealHeader} onClick={() => toggleDeal(deal.ID as string)}>
                          <div className={styles.dealTitle}>
                            {formatFieldValue(deal.TITLE) || `Сделка #${deal.ID} / Deal #${deal.ID}`}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className={styles.badge}>{formatFieldValue(deal.STAGE_ID)}</div>
                            <div className={`${styles.badge} ${styles.arrow}`}>
                              {isOpen ? '▼' : '▶'}
                            </div>
                          </div>
                        </div>
                        {isOpen && (
                          <div className={styles.dealBody}>
                            <div className={styles.grid}>
                              {dealFields.map(({ key, value }) => (
                                <div key={key}>
                                  <div className={styles.label}>{key}</div>
                                  <div className={styles.value}>{formatFieldValue(value)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Leads Section - Все поля */}
            {contact && leads.length > 0 && (
              <div className={styles.section}>
                <Heading tagName='h2' size='md' className={styles.sectionTitle}>Лиды / Leads</Heading>
                <div className={styles.accordion}>
                  {leads.map((leadItem) => {
                    const isOpen = !!openLeadIds[leadItem.ID as string]
                    const leadFields = getAllFields(leadItem as Record<string, unknown>)
                    return (
                      <div key={leadItem.ID as string} className={styles.dealItem}>
                        <div className={styles.dealHeader} onClick={() => toggleLead(leadItem.ID as string)}>
                          <div className={styles.dealTitle}>
                            {formatFieldValue(leadItem.TITLE) || `Лид #${leadItem.ID} / Lead #${leadItem.ID}`}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className={styles.badge}>{formatFieldValue(leadItem.STATUS_ID)}</div>
                            <div className={`${styles.badge} ${styles.arrow}`}>
                              {isOpen ? '▼' : '▶'}
                            </div>
                          </div>
                        </div>
                        {isOpen && (
                          <div className={styles.dealBody}>
                            <div className={styles.grid}>
                              {leadFields.map(({ key, value }) => (
                                <div key={key}>
                                  <div className={styles.label}>{key}</div>
                                  <div className={styles.value}>{formatFieldValue(value)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {deals.length === 0 && leads.length === 0 && !company && (
              <div className={styles.section}>
                <div className={styles.emptyState}>Нет сделок и лидов / No deals and leads</div>
              </div>
            )}
          </>
        )}

        {!loading && !error && !lead && !contact && (
          <div className={styles.section}>
            <div className={styles.emptyState}>
              Данные не найдены. Свяжитесь с поддержкой. / Data not found. Please contact support.
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}
