'use client'
import { FC } from 'react'
import classNames from 'classnames'

import styles from './fullfilmentPage.module.scss'
import { FullfilmentPageProps } from './fullfilmentPage.types'
import { PrintHero } from '@/modules/printHero'
import WarehouseIcon from '@icons/warehouse.svg'
import { WhoWeAre } from '@/modules/whoWeAre'
import { KeyAdvantages } from '@/modules/keyAdvantages'
// import { ForWork } from '@/modules/forWork'
import { Marketplaces } from '@/modules/marketplaces'
import { BeforeAfter } from '@/modules/beforeAfter'
import { HowWeWork } from '@/modules/howWeWork'
import { Services } from '@/modules/services'
import { Faq } from '@/modules/faq'
import { DynamicBackground } from '@/ui'
import { Contacts } from '@/modules/contacts'
import { ServicePriceList } from '@/modules/servicePriceList'
import { Reviews } from '@/modules/reviews'

const contactsAddresses = [
  { text: 'Адрес основного склада/офиса в Москве с удобным выездом к ключевым складам WB и Ozon.' }
]

// const forWorkItems = [
//   { text: 'Селлеры на WB и Ozon, которым важно стабильно довозить поставки без отмен.' },
//   { text: 'Фулфилменты без автопарка, которым нужно надёжно отправлять грузы на склады маркетплейсов.' }
// ]

const beforeAfterItems = [
  {
    beforeImage: '/images/1.png',
    afterImage: '/images/2.png',
    beforeLabel: 'Приняли от поставщика',
    afterLabel: 'Отправили на маркетплейс',
    title: 'Упаковка и подготовка',
    description: 'Аккуратная упаковка товара по требованиям маркетплейсов'
  },
  {
    beforeImage: '/images/1.png',
    afterImage: '/images/2.png',
    beforeLabel: 'До обработки',
    afterLabel: 'После обработки',
    title: 'Комплектовка',
    description: 'Нанесение стикеров и маркировки под требования WB и Ozon'
  },
  {
    beforeImage: '/images/1.png',
    afterImage: '/images/2.png',
    beforeLabel: 'До консолидации',
    afterLabel: 'После консолидации',
    title: 'Консолидация поставок',
    description: 'Формирование паллет и подготовка к отгрузке'
  }
]

const whoWeAreItems = [
  { text: 'Приёмку груза с проверкой количества и внешнего вида' },
  { text: 'Отбраковку брака и уведомление по спорным позициям' },
  { text: 'Фасовку, стикеровку, подбор упаковки' },
  { text: 'Отгрузку на склады WB/Ozon/Я.Маркет по FBO, FBW и FBS' }
]

const teamItems = [
  { text: 'Менеджеры по работе с селлерами' },
  { text: 'Логисты' },
  { text: 'Маркетологи' },
  { text: 'Фотографы' },
  { text: 'Кладовщики' },
  { text: 'Упаковщики' }
]

const keyAdvantagesItems = [
  {
    title: 'Честный прайс без сюрпризов',
    text: 'Фиксированные тарифы и прозрачный договор — никаких скрытых доплат.'
  },
  {
    title: 'Качественный сервис по адекватной цене',
    text: 'Оптимизируем процессы: аккуратная упаковка и стабильные отгрузки без переплат.'
  },
  {
    title: 'Отличная клиентская поддержка',
    text: 'Личный менеджер на связи, оперативные ответы, фото- и видеоотчёты.'
  },
  {
    title: 'Опыт действующих селлеров',
    text: 'Команда сама торгует на маркетплейсах и понимает все нюансы работы.'
  },
  {
    title: 'Экспертиза в «Честном Знаке»',
    text: 'Интегрируем, консультируем, маркируем без ошибок. Оптимизируем бюджет.'
  },
  {
    title: 'Оптимизация процессов',
    text: 'Автоматизируем рутину, убираем лишние движения товара для экономии.'
  }
]

const howWeWorkSteps = [
  {
    title: 'Запрос и описание товара',
    text: 'Обсуждаем объёмы, категории, частоту отгрузок, подбираем тариф.'
  },
  {
    title: 'Доставка товара на склад',
    text: 'Забираем груз от поставщика или принимаем на складе в Москве/МО.'
  },
  {
    title: 'Приёмка и проверка',
    text: 'Пересчитываем товар, проверяем внешний вид, отправляем отчёт.'
  },
  {
    title: 'Маркировка и упаковка',
    text: 'Наносим стикеры под требования маркетплейсов, подбираем упаковку.'
  },
  {
    title: 'Отгрузка на склады',
    text: 'Формируем паллеты, оформляем документы, отправляем в срок.'
  },
  {
    title: 'Постоянное сопровождение',
    text: 'Поддерживаем остатки, помогаем планировать поставки.'
  }
]

const warehousingItems = [
  {
    text: (
      <>
        Тёплый охраняемый склад. Ваша продукция хранится в безопасности и комфортных условиях.
        <br />
        <br />
        Чёткий учёт. Адресное хранение и интеграция с «Мой склад» для полного контроля.
      </>
    )
  },
  {
    text: (
      <>
        Своевременные отгрузки благодаря собственному автопарку и проверенным логистическим партнёрам.
        <br />
        <br />
        Весь наш автотранспорт оснащён GPS-трекерами, поэтому мы всегда контролируем маршрут и статус вашей отправки.
      </>
    )
  }
]

const servicePriceListSections = [
  {
    id: 'goods-processing',
    title: '1. Работа с товаром',
    items: [
      { id: 'goods-1', title: 'Приемка товара (поштучный пересчет)', price: 'от 3 ₽' },
      { id: 'goods-2', title: 'Сортировка (Распределение по цветам/артикулам/размерам)', price: 'от 3 ₽' },
      { id: 'goods-3', title: 'Проверка на брак визуальная', price: 'от 10 ₽' },
      { id: 'goods-4', title: 'Проверка на брак по вашему ТЗ', price: 'от 15 ₽' },
      { id: 'goods-5', title: 'Отпаривание одежды', price: 'от 60 ₽' },
      { id: 'goods-6', title: 'Обрезка ниток', price: 'от 10 ₽' }
    ]
  },
  {
    id: 'marking',
    title: '2. Маркировка',
    items: [
      { id: 'mark-1', title: 'Маркировка ШК / ЧЗ', price: 'от 4 ₽' },
      { id: 'mark-2', title: 'Двойная маркировка ШК / ЧЗ', price: 'от 6 ₽' },
      { id: 'mark-3', title: 'Тройная маркировка ШК / ЧЗ', price: 'от 10 ₽' },
      { id: 'mark-4', title: 'Устранение старых ШК', price: 'от 8 ₽' },
      { id: 'mark-5', title: 'Создание макета этикетки по вашему ТЗ', price: 'от 500 ₽' }
    ]
  },
  {
    id: 'packaging',
    title: '3. Упаковка и сборка',
    items: [
      { id: 'pack-1', title: 'Сборка набора', price: 'от 15 ₽' },
      { id: 'pack-2', title: 'Вложение листовки, инструкции', price: 'от 4 ₽' },
      { id: 'pack-3', title: 'Упаковка', price: 'от 7 ₽' },
      { id: 'pack-4', title: 'Паллетирование (Включает евро-паллет, стрейч-пленку упаковочную)', price: 'от 650 ₽' }
    ]
  },
  {
    id: 'logistics',
    title: '4. Логистика',
    items: [
      { id: 'log-1', title: 'Забор груза', price: 'от 2500 ₽' },
      { id: 'log-2', title: 'Забор товара с ПВЗ', price: 'от 600 ₽' },
      { id: 'log-3', title: 'Отгрузка в Коледино', price: 'от 2000 ₽' },
      { id: 'log-4', title: 'Отгрузка в Подольск', price: 'от 2000 ₽' },
      { id: 'log-5', title: 'Отгрузка в Электросталь', price: 'от 2500 ₽' },
      { id: 'log-6', title: 'Отгрузка в Тулу', price: 'от 3000 ₽' },
      { id: 'log-7', title: 'Отгрузка на региональные склады', price: 'от 4000 ₽' }
    ]
  }
]

const faqData = [
  {
    title: 'Работаете ли вы по FBS и FBO/FBW?',
    content: 'Да, готовим и отправляем поставки по схемам FBO/FBW и FBS/real FBS на склады WB, Ozon и Яндекс.Маркет.'
  },
  {
    title: 'С какими маркетплейсами вы работаете?',
    content: 'Основные направления: Wildberries, Ozon, Яндекс.Маркет, при необходимости обсуждаем другие площадки.'
  },
  {
    title: 'Можно ли сотрудничать, если я в другом городе или за границей?',
    content: 'Да, нам не важно, где вы находитесь — главное, чтобы товар доехал до нашего склада.\n\nЧасто работаем с селлерами из регионов и из-за рубежа (Дубай, Турция, Казахстан и т.д.).'
  },
  {
    title: 'Есть ли отгрузки на крупные склады маркетплейсов?',
    content: 'Отправляем на востребованные склады Московского региона и других городов по согласованному графику.'
  },
  {
    title: 'Забираете ли товар с оптовых рынков и от поставщиков?',
    content: 'Организуем забор груза с рынков, складов и шоурумов по Москве и МО, а также от проверенных поставщиков.'
  },
  {
    title: 'Как оптимизировать расходы на фулфилмент?',
    content: 'Помогаем подобрать размер поставок, тип упаковки и частоту отгрузок так, чтобы вы не переплачивали за хранение и операции.'
  },
  {
    title: 'Есть ли у вас акции и скидки?',
    content: 'Для постоянных клиентов и при росте объёмов предоставляем индивидуальные условия и специальные предложения.'
  }
]

const FullfilmentPage: FC<FullfilmentPageProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <main className={rootClassName}>
      <PrintHero
        title={<><span>Фулфилмент для маркетплейсов</span></>}
        subtitle={<>Забираем груз, консолидируем и довозим до склада точно в окно. Работаем по FBO и FBS.</>}
        cta1={'Рассчитать стоимость'}
        cta2={'Получить консультацию'}
        option={
          <ul>
            <li>Приёмка и проверка</li>
            <li>Маркировка под маркетплейсы</li>
            <li>Упаковка и отгрузка FBO/FBS</li>
            <li>Фото- и видеоотчёты</li>
            <li>Работа с «Честным Знаком»</li>
          </ul>
        }
        optionIcon={<WarehouseIcon />}
      />
      <WhoWeAre
        title="Кто мы и что делаем"
        brand="City Group"
        lead={<>— партнёр по фулфилменту, ваш удалённый склад и операционный отдел.</>}
        paragraphs={[
          'Вы — ассортимент и продажи, мы — логистика и рутина.'
        ]}
        items={whoWeAreItems}
      />
      <KeyAdvantages
        title="Наши ключевые преимущества"
        subtitle={<>Главное — за что нас выбирают и остаются надолго.</>}
        items={keyAdvantagesItems}
        note={<>Десятки клиентов сократили расходы на маркировку и логистику благодаря оптимизированным процессам.</>}
      />
      {/* <ForWork
        title="Для кого работаем"
        textArr={forWorkItems}
      /> */}
      <Marketplaces title={<>С какими маркетплейсам<br />работаем</>} />
      <BeforeAfter
        title="До и после"
        items={beforeAfterItems}
      />
      <HowWeWork
        variant="light"
        title="Как мы работаем"
        subtitle={<>От запроса до регулярных отгрузок и сопровождения.</>}
        steps={howWeWorkSteps}
      />
      <Services title={<>Надёжное хранение и&nbsp;отлаженная логистика</>} items={warehousingItems} />
      <ServicePriceList sections={servicePriceListSections} />
      <WhoWeAre
        title="Команда"
        brand="City Group"
        lead={<>Менеджеры, логисты, маркетологи, фотографы, кладовщики и упаковщики.</>}
        paragraphs={[
          'Процессы выстроены для минимизации ошибок и ускорения движения товара.'
        ]}
        asideKicker="в команде"
        asideAriaLabel="Состав команды"
        items={teamItems}
      />
      <DynamicBackground variant="swirl-2" pin={false} cellSize={100}>
        <Faq faqData={faqData} />
      </DynamicBackground>
      <Reviews />
      <Contacts
        id="contacts-warehouses"
        title="Контакты"
        subtitle={<>Для оперативной связи по отгрузкам и заявкам.</>}
        schedule={<>Работаем: с 9:00 утра до 22:00 вечера. <br />Без выходных.</>}
        quickNotes={[
          'Телефон и мессенджеры для оперативной связи по отгрузкам.',
          'Почта для заявок и договоров.'
        ]}
        phoneLinks={[
          { label: 'Телефон', value: '+7 999 999-99-99', href: 'tel:+79999999999' }
        ]}
        messengerLinks={[
          { label: 'Telegram', value: 'Telegram', href: 'https://t.me/' },
          { label: 'WhatsApp', value: 'WhatsApp', href: 'https://wa.me/' }
        ]}
        emailLinks={[
          { label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' }
        ]}
        addresses={contactsAddresses}
        mapTitle="Карта складов"
        mapEmbedSrc=""
      />
    </main>
  )
}

export default FullfilmentPage
