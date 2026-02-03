/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Wrapper } from '@ui/wrapper'
import { Heading } from '@ui/heading'
import { ButtonWave } from '@ui/buttonWave'
import styles from './lk.module.scss'

type Lead = {
  [key: string]: unknown
}

type Contact = {
  [key: string]: unknown
}

type BitrixDeal = Record<string, unknown>

type BitrixCompany = {
  [key: string]: unknown
}

// Универсальная отрисовка значения
function formatFieldValue(value: unknown): string | JSX.Element | Array<JSX.Element> {
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
      // Если это массив файлов/документов
      if (value[0] && typeof value[0] === 'object' && ('downloadUrl' in value[0] || 'url' in value[0] || 'name' in value[0])) {
        return (value as Array<{ id?: number | string; name?: string; downloadUrl?: string; url?: string }>)
          .map((item, idx) => {
            const name = item.name || `Файл ${idx + 1}`
            const url = item.downloadUrl || item.url || '#'
            return (
              <a key={`${name}-${idx}`} href={url} target='_blank' rel='noreferrer'>
                {name}
              </a>
            )
          })
      }
      return value.map(v => String(v)).join(', ')
    }
    // Если это объект с файлом/документом
    if ('downloadUrl' in value || 'url' in value || 'name' in value) {
      const name = (value as { name?: string }).name || 'Файл'
      const url = (value as { downloadUrl?: string; url?: string }).downloadUrl || (value as { url?: string }).url || '#'
      return (
        <a href={url} target='_blank' rel='noreferrer'>
          {name}
        </a>
      )
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

// Набор ключевых полей сделки для отображения (как в референсе)
const DEAL_FIELD_ORDER: Array<{ key: string; label: string }> = [
  { key: 'STAGE_ID', label: 'Стадия' },
  { key: 'OPPORTUNITY', label: 'Сумма заказа' },
  { key: 'UF_CRM_1729774666016', label: 'Статус оплаты' },
  { key: 'UF_CRM_1729763576', label: 'Номер заказа' },
  { key: 'UF_CRM_1730356149644', label: 'Печать теста' },
  { key: 'UF_CRM_1729774752184', label: 'Статус теста' },
  { key: 'UF_CRM_1730361963003', label: 'Метод печати' },
  { key: 'UF_CRM_1730363014413', label: 'Размер изображения, мм' },
  { key: 'UF_CRM_1729673717983', label: 'Тираж' },
  { key: 'UF_CRM_1730357338802', label: 'Файлы для печати' },
  { key: 'UF_CRM_1760519761774', label: 'Документы' },
  { key: 'COMMENTS', label: 'Комментарий' }
]

function getDealFields(deal: Record<string, unknown>): Array<{ key: string; value: unknown; label: string }> {
  if (!deal) return []
  return DEAL_FIELD_ORDER.map(({ key, label }) => ({
    key,
    value: key in deal ? deal[key] : null,
    label
  }))
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

  // Справочники
  const [stageById, setStageById] = useState<Record<string, string>>({})
  const [enumByField, setEnumByField] = useState<Record<string, Record<string, string>>>({})

  const FILE_FIELDS = new Set(['UF_CRM_1730357338802', 'UF_CRM_1760519761774'])

  // Типы для словарей
  type DealStageInfo = { stageId?: string; name?: string }
  type DealCategoryInfo = { stages?: DealStageInfo[] }
  type EnumItem = {
    ID?: string | number
    VALUE?: string
    NAME?: string
    id?: string | number
    value?: string
    name?: string
  }
  type BitrixFieldMeta = {
    items?: EnumItem[]
    LIST?: EnumItem[]
    VALUES?: EnumItem[]
    ENUM?: Record<string, EnumItem>
  }
  type FieldsResponse = Record<string, BitrixFieldMeta>
  type FileItem = { id?: number | string; name?: string; downloadUrl?: string; url?: string; showUrl?: string }

  // Получаем справочники стадий и полей
  const loadDictionaries = useCallback(async () => {
    try {
      const [stagesRes, fieldsRes] = await Promise.all([
        fetch('/api/b24/deal-stages'),
        fetch('/api/b24/deal-fields')
      ])

      // Стадии
      if (stagesRes.ok) {
        const data = await stagesRes.json()
        const map: Record<string, string> = {}
        const categories: DealCategoryInfo[] = Array.isArray(data?.categories) ? (data.categories as DealCategoryInfo[]) : []
        categories.forEach((cat) => {
          (cat.stages || []).forEach((s: DealStageInfo) => {
            if (s?.stageId && s?.name) map[s.stageId] = s.name
          })
        })
        setStageById(map)
      }

      // Поля
      if (fieldsRes.ok) {
        const data = await fieldsRes.json()
        const fields: FieldsResponse = (data?.fields || {}) as FieldsResponse
        const enums: Record<string, Record<string, string>> = {}

        Object.entries(fields).forEach(([code, meta]) => {
          const m = meta as BitrixFieldMeta
          let list: Array<EnumItem> | null = null
          // Попытки извлечь список вариантов из разных структур Bitrix
          if (Array.isArray(m?.items)) list = m.items as EnumItem[]
          else if (Array.isArray(m?.LIST)) list = m.LIST as EnumItem[]
          else if (Array.isArray(m?.VALUES)) list = m.VALUES as EnumItem[]
          else if (m?.ENUM && typeof m.ENUM === 'object') list = Object.values(m.ENUM) as EnumItem[]

          if (list && list.length) {
            const map: Record<string, string> = {}
            for (const it of list) {
              const id = String(it?.ID ?? it?.id ?? it?.VALUE ?? it?.value ?? '')
              const name = String(it?.VALUE ?? it?.value ?? it?.NAME ?? it?.name ?? '')
              if (id) map[id] = name
            }
            if (Object.keys(map).length) enums[code] = map
          }
        })

        setEnumByField(enums)
      }
    } catch {
      // ignore
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Параллельно подгружаем данные пользователя и справочники
      const [meRes] = await Promise.all([
        fetch('/api/b24/me', { method: 'GET' }),
        loadDictionaries()
      ] as const)
      const data = await meRes.json()
      if (!meRes.ok) {
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
  }, [loadDictionaries])

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
  const companyFields = getAllFields(company as Record<string, unknown> | null)

  // Преобразование значения поля с учётом справочников
  const renderDealFieldValue = useCallback((fieldKey: string, rawValue: unknown) => {
    // Комментарии: BBCode [url=...]...[/url] и переносы строк
    if (fieldKey === 'COMMENTS' && typeof rawValue === 'string') {
      const html = rawValue
        .replace(/\n/g, '<br/>')
        .replace(/\[url=(.+?)\](.+?)\[\/url\]/g, '<a href="$1" target="_blank" rel="noreferrer">$2</a>')
      return <span dangerouslySetInnerHTML={{ __html: html }} />
    }

    // Стадия
    if (fieldKey === 'STAGE_ID' && typeof rawValue === 'string') {
      return stageById[rawValue] || rawValue
    }

    // Денежное значение
    if (fieldKey === 'OPPORTUNITY' && (typeof rawValue === 'string' || typeof rawValue === 'number')) {
      const num = Number(rawValue)
      if (!Number.isNaN(num)) {
        return new Intl.NumberFormat('ru-RU').format(num) + ' ₽'
      }
    }

    // Перечисления (кастомные UF поля)
    if (fieldKey.startsWith('UF_CRM_')) {
      const dict = enumByField[fieldKey]
      if (dict) {
        if (Array.isArray(rawValue)) {
          const ids = rawValue.map(v => String(v))
          const names = ids.map(id => dict[id] || id)
          return names.join(', ')
        }
        const id = String(rawValue ?? '')
        if (id in dict) return dict[id]
      }
    }

    return formatFieldValue(rawValue)
  }, [enumByField, stageById])

  // Отдельный рендер «красивых» плиток файлов
  const renderFiles = useCallback((value: unknown) => {
    if (!Array.isArray(value) || value.length === 0) return '—'
    return (
      <div className={styles.fileGrid}>
        {(value as FileItem[]).map((item, idx: number) => {
          const url = item?.downloadUrl || item?.url || item?.showUrl || '#'
          const name = item?.name || `Файл ${idx + 1}`
          return (
            <a
              key={String(item?.id ?? idx)}
              href={url}
              target='_blank'
              rel='noreferrer'
              className={styles.fileItem}
            >
              <div className={styles.fileThumb} aria-hidden />
              <div className={styles.fileName}>{name}</div>
            </a>
          )
        })}
      </div>
    )
  }, [])

  return (
    <Wrapper>
      <div className={styles.container}>
        <div className={styles.header}>
          <Heading tagName='h1' size='sm'>Личный кабинет</Heading>
          <ButtonWave onClick={logout}>Выйти</ButtonWave>
        </div>

        {loading && <div className={styles.section}>Загрузка...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && entity && (
          <>
            {/* Profile Section - Все поля */}
            {/* <div className={`${styles.card} ${styles.section}`}>
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
            </div> */}

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
                    const dealFields = getDealFields(deal as Record<string, unknown>)
                    return (
                      <div key={deal.ID as string} className={styles.dealItem}>
                        <div className={styles.dealHeader} onClick={() => toggleDeal(deal.ID as string)}>
                          <div className={styles.dealTitle}>
                            {formatFieldValue(deal.TITLE) || `Сделка #${deal.ID} / Deal #${deal.ID}`}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className={styles.badge}>
                              {renderDealFieldValue('STAGE_ID', deal.STAGE_ID)}
                            </div>
                            <div className={`${styles.badge} ${styles.arrow}`}>
                              {isOpen ? '▼' : '▶'}
                            </div>
                          </div>
                        </div>
                        {isOpen && (
                          <div className={styles.dealBody}>
                            <div className={styles.detailList}>
                              {dealFields.map(({ key, value, label }) => {
                                const isEmpty = value === null || value === undefined || value === ''

                                // Определяем «сигнальные» поля для раскраски
                                const highlightClass =
                                  key === 'UF_CRM_1729774666016' // Статус оплаты
                                    ? (String(renderDealFieldValue(key, value)).includes('Не') ? styles.bad : styles.ok)
                                    : key === 'UF_CRM_1730356149644' // Печать теста
                                      ? (String(renderDealFieldValue(key, value)).includes('Да') ? styles.ok : styles.bad)
                                      : key === 'UF_CRM_1729774752184' // Статус теста
                                        ? (String(renderDealFieldValue(key, value)).includes('Не') ? styles.bad : styles.ok)
                                        : undefined

                                return (
                                  <div key={key} className={styles.row}>
                                    <div className={styles.name}>{label}</div>
                                    <div className={`${styles.val} ${isEmpty ? styles.valueEmpty : ''} ${highlightClass || ''}`}>
                                      {isEmpty
                                        ? '—'
                                        : FILE_FIELDS.has(key)
                                          ? renderFiles(value)
                                          : renderDealFieldValue(key, value)}
                                    </div>
                                  </div>
                                )
                              })}
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
