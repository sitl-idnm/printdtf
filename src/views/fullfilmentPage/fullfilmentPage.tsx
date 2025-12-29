'use client'
import { FC } from 'react'
import classNames from 'classnames'

import styles from './fullfilmentPage.module.scss'
import { FullfilmentPageProps } from './fullfilmentPage.types'
import { PrintHero } from '@/modules/printHero'
import DocumentCheck from '@icons/document-check.svg'
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
    beforeImage: '/images/before-after-1-before.jpg',
    afterImage: '/images/before-after-1-after.jpg',
    beforeLabel: 'Приняли от поставщика',
    afterLabel: 'Отправили на маркетплейс',
    title: 'Упаковка и подготовка',
    description: 'Аккуратная упаковка товара по требованиям маркетплейсов'
  },
  {
    beforeImage: '/images/before-after-2-before.jpg',
    afterImage: '/images/before-after-2-after.jpg',
    beforeLabel: 'До обработки',
    afterLabel: 'После обработки',
    title: 'Маркировка и стикеровка',
    description: 'Нанесение стикеров и маркировки под требования WB и Ozon'
  },
  {
    beforeImage: '/images/before-after-3-before.jpg',
    afterImage: '/images/before-after-3-after.jpg',
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
        <strong>Логистика и хранение</strong>
        <ul>
          <li>Приёмка и выгрузка на тёплом охраняемом складе.</li>
          <li>Формирование паллет под требования конкретного склада WB/Ozon/Я.Маркет.</li>
          <li>Собственный автотранспорт и проверенные партнёры для своевременных отгрузок.</li>
        </ul>
      </>
    )
  },
  {
    text: (
      <>
        <strong>Работа с товаром и упаковкой</strong>
        <ul>
          <li>Аккуратная комплектация наборов и подарочных комплектов.</li>
          <li>Проверка цвета, размера, артикула, соответствия заявленной номенклатуре.</li>
          <li>Подбор упаковки, подходящей под категорию и требования маркетплейса.</li>
        </ul>
      </>
    )
  }
]

const servicePriceListSections = [
  {
    id: 'logistics',
    title: '1. Логистика',
    items: [
      { id: 'log-1', title: '1. С рынков Москвы: Южные ворота, Садовод, ТЯК Москва' },
      { id: 'log-1-1', title: '1.1. По Москве и МО' },
      { id: 'log-1-2', title: '1.2. Доставка товара объемом от 1 м³ до 2 м³' },
      { id: 'log-1-3', title: '1.3. Доставка более 2-х паллетов', isNegotiable: true },
      { id: 'log-1-4', title: '1.4. Забор товара со Сдэк (нужны будут данные)' },
      { id: 'log-1-5', title: '1.5. Схема FBS (Ozon, Wildberries, Яндекс, СберМегаМаркет Марушкинское)' }
    ]
  },
  {
    id: 'pallet',
    title: '1.2. Формирование паллета для отгрузки',
    items: [
      { id: 'pal-1', title: '1.2.1. Паллет деревянный (1200*800 мм)' },
      { id: 'pal-2', title: '1.2.2. Формирование паллета: паллет + сборка + упаковка в стретч-пленку' }
    ]
  },
  {
    id: 'goods-services',
    title: '2. Услуги по работе с товаром',
    items: [
      { id: 'goods-1', title: '2.1. Маркировка одинарная' },
      { id: 'goods-2', title: '2.2. Маркировка двойная' },
      { id: 'goods-3', title: '2.3. Дополнительная наклейка' },
      { id: 'goods-4', title: '2.4. Честный знак' },
      { id: 'goods-5', title: '2.5. Приемка товара, пересчет' },
      { id: 'goods-6', title: '2.6. QR поставка + сканирование' },
      { id: 'goods-7', title: '2.7. Отпаривание (разных параметров)' }
    ]
  },
  {
    id: 'packaging',
    title: '3. Упаковка товара',
    items: [
      { id: 'pack-1', title: '3.1. Упаковка в пакет ВПП' },
      { id: 'pack-2', title: '3.2. Упаковка в пакеты Zip-Lock (Зип-Лок)' },
      { id: 'pack-3', title: '3.3. Упаковка в Zip пакеты-слайдеры (с бегунком)' },
      { id: 'pack-4', title: '3.4. Упаковка в БОПП пакеты' },
      { id: 'pack-5', title: '3.5. Упаковка в пупырку + пакет' },
      { id: 'pack-6', title: '3.6. Упаковка в курьерский пакет' },
      { id: 'pack-7', title: '3.7. Пупырчатая пленка' },
      { id: 'pack-8', title: '3.8. Упаковка в коробку' },
      { id: 'pack-9', title: '3.9. Термоусадка до 1 литра' }
    ]
  },
  {
    id: 'additional',
    title: '4. Дополнительные услуги',
    items: [
      { id: 'add-1', title: '4.1. Дизайн карточек товара простой' },
      { id: 'add-2', title: '4.2. Дизайн карточек индивидуальный' },
      { id: 'add-3', title: '4.3. Создание карточки товара в ЛК - полное описание' },
      { id: 'add-4', title: '4.4. Создание поставки в ЛК поставщика' }
    ]
  },
  {
    id: 'turnkey',
    title: '5. Фулфилмент "под ключ"',
    items: [
      { id: 'turn-1', title: '5.1. Продвижение товара' },
      { id: 'turn-2', title: '5.2. Настройка рекламных кампаний' },
      { id: 'turn-3', title: '5.3. Самовыкупы' },
      { id: 'turn-4', title: '5.4. Ведение личного кабинета под ключ' }
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
        cta1={'Заказать тираж'}
        cta2={'Обсудить индивидуальный заказ'}
        option={
          <ul>
            <li>Приёмка и проверка</li>
            <li>Маркировка под маркетплейсы</li>
            <li>Упаковка и отгрузка FBO/FBS</li>
            <li>Фото- и видеоотчёты</li>
            <li>Работа с «Честным Знаком»</li>
          </ul>
        }
        optionIcon={<DocumentCheck />}
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
      <Marketplaces title="С какими маркетплейсами работаем" />
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
      <Services title="Логистика и хранение" items={warehousingItems} />
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
