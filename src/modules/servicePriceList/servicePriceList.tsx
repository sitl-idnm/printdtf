'use client'
import { FC, useState } from 'react'
import classNames from 'classnames'

import styles from './servicePriceList.module.scss'
import { ServicePriceListProps } from './servicePriceList.types'
import { FormModal } from '../formModal'

const ServicePriceList: FC<ServicePriceListProps> = ({ className, sections }) => {
  const rootClassName = classNames(styles.root, className)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const handleOrderClick = (serviceId: string, serviceTitle: string) => {
    setSelectedService(serviceTitle)
    setModalOpen(true)
  }

  return (
    <>
      <FormModal
        open={isModalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedService(null)
        }}
        title="Оставить заявку"
        text={selectedService ? `Заказ услуги: ${selectedService}` : 'Заполните форму, и мы свяжемся с вами в ближайшее время.'}
        hidePrintMethod={true}
      />
      <div className={rootClassName}>
        <h2 className={styles.mainTitle}>Прайс-лист</h2>
        {sections.map((section) => (
          <div key={section.id} className={styles.section}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            <div className={styles.list}>
              {section.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemContent}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemPrice}>
                      {item.isNegotiable ? (
                        <span className={styles.negotiable}>Договорная</span>
                      ) : item.price ? (
                        item.price
                      ) : (
                        <span className={styles.dash}>—</span>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.orderButton}
                    onClick={() => handleOrderClick(item.id, item.title)}
                    aria-label={`Заказать ${item.title}`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.orderIcon}
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <path d="M3 6h18" />
                      <path d="M8 10a4 4 0 1 0 8 0" />
                    </svg>
                    <span>Заказать</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ServicePriceList
