'use client'
import { FC } from 'react'
import classNames from 'classnames'

import styles from './logistikaPage.module.scss'
import { LogistikaPageProps } from './logistikaPage.types'
import { PrintHero } from '@/modules/printHero'
import { ForWork } from '@/modules/forWork'
import { Services } from '@/modules/services'
import { Tariffs } from '@/modules/tariffs'
import { HowWeWork } from '@/modules/howWeWork'
import { Contacts } from '@/modules/contacts'
import { Advantages } from '@/components'
import { DynamicBackground } from '@/ui'
import { Faq } from '@/modules/faq'
import { Reviews } from '@/modules/reviews'

const WorkArr = [{
  text: 'Селлеры на WB и Ozon, которым важно стабильно довозить поставки без отмен.'
}, {
  text: 'Фулфилменты без автопарка, которым нужно надёжно отправлять грузы на склады маркетплейсов.'
}]

const advantages = [{
  text: <>Логистика, заточенная под маркетплейсы: знаем временные окна, требования к паллетам, документооборот.</>
}, {
  text: <>Работаете по расписанию, а не по принципу «кого сегодня найдём»: регулярные рейсы и выделенное место.</>
}, {
  text: <>Удобно для фулфилментов: принимаем консолидированные грузы, разбираем по поставкам и отвозим на разные склады.</>
}, {
  text: <>Соблюдение слотов и сроков: планируем маршрут так, чтобы товар приезжал в окно и не «разворачивался».</>
}, {
  text: <>Прозрачные тарифы без скрытых доплат: чёткая стоимость по маршруту и типу груза.</>
}]

const faqData = [
  {
    title: 'С какими маркетплейсами вы работаете?',
    content: 'Основной фокус — Wildberries и Ozon, при необходимости обсуждаем другие площадки.'
  },
  {
    title: 'Можно ли подключить регулярные рейсы от моего фулфилмента?',
    content: 'Да, выстраиваем постоянный график: закрепляем дни, время и направления, чтобы ваши клиенты не переживали за поставки.'
  },
  {
    title: 'Берёте ли малые объёмы или только паллеты?',
    content: 'Работаем и с небольшими партиями, и с крупными поставками, подбираем формат под ваши обороты. '
  },
  {
    title: 'Можете ли развозить грузы нескольких моих клиентов по разным складам WB/Ozon?',
    content: 'Да, принимаем консолидированные поставки, делим их по ТЗ и развозим по выбранным РЦ.'
  },
  {
    title: 'Как считать стоимость, если отгрузки нерегулярные?',
    content: 'Есть базовые тарифы по направлениям и объёмам, а разовые рейсы считаются индивидуально через заявку.'
  }
]

const servicesItems = [
  { text: 'Забор груза со склада селлера или фулфилмента в Москве и области' },
  { text: 'Консолидация и расконсолидация поставок под разные склады маркетплейсов' },
  { text: 'Формирование паллет по требованиям WB и Ozon (маркировка, накладные, стретч)' },
  { text: 'Доставка до РЦ и складов маркетплейсов по FBO и FBS' },
  { text: 'Организация регулярных рейсов по фиксированному графику' }
]

const tariffsItems = [
  {
    title: 'Городские рейсы (Москва)',
    description: 'Для отгрузок на склады в пределах Москвы и ближайшего пояса.',
    note: 'Цена зависит от объёма, веса и направления.'
  },
  {
    title: 'По Московской области и за МКАД',
    description: 'Для складов WB/Ozon за городом: учитываем километраж и временные окна.',
    note: 'Считаем по маршруту и ограничениям РЦ.'
  },
  {
    title: 'Регулярная логистика для фулфилментов',
    description: 'Индивидуальный тариф: выделенные места, приоритетная загрузка, фиксированные дни и время.',
    note: 'Оптимально для стабильных еженедельных отгрузок.'
  }
]

const howWeWorkSteps = [
  { title: 'Заявка / ТЗ', text: 'Оставляете заявку или присылаете ТЗ на отгрузку.' },
  { title: 'Согласование', text: 'Согласуем стоимость, маршрут и временное окно.' },
  { title: 'Забор груза', text: 'Забираем груз с вашего склада или принимаем у нас.' },
  { title: 'Подготовка', text: 'Консолидируем/делим поставки и готовим паллеты.' },
  { title: 'Доставка', text: 'Доставляем на склад WB/Ozon и отправляем подтверждение.' }
]

const contactsAddresses = [
  { text: 'Адрес основного склада/офиса в Москве с удобным выездом к ключевым складам WB и Ozon.' }
]

const LogistikaPage: FC<LogistikaPageProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)

  return (
    <main className={rootClassName}>
      <PrintHero
        title={<><span>Логистика для маркетплейсов</span></>}
        subtitle={<>Забираем груз и довозим до склада точно в окно. Работаем по FBO и FBS.</>}
        cta1={'Рассчитать стоимость'}
        cta2={'Получить консультацию'}
        hidePrintMethod={true}
      />
      <ForWork
        title='Для кого работаем'
        textArr={WorkArr}
      />
      <Advantages
        arrAdvantages={advantages}
        title={
          <><span>Преимущества</span></>
        }
        imageSrc1='/images/1.png'
        imageSrc2='/images/2.png'
      />
      <Services title="Услуги" items={servicesItems} />
      <Tariffs
        title="Тарифы"
        subtitle={<>Выбираем сценарий — считаем стоимость под ваш объём и маршрут.</>}
        items={tariffsItems}
      />
      <HowWeWork
        title="Как мы работаем"
        subtitle={<>От заявки до подтверждения отгрузки.</>}
        steps={howWeWorkSteps}
      />
      <DynamicBackground variant="swirl-2" pin={false} cellSize={100}><Faq faqData={faqData} /></DynamicBackground>
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
        mapEmbedSrc="https://yandex.ru/map-widget/v1/?ll=37.564788%2C55.652984&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjkzMzI1ORJC0KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINCl0LXRgNGB0L7QvdGB0LrQsNGPINGD0LvQuNGG0LAsIDIw0LoyIgoNWEIWQhWonF5C&z=17.13"
      />
    </main>
  )
}

export default LogistikaPage
