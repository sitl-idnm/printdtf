export interface ServiceItem {
  id: string
  title: string
  price?: string // Если не указано, будет показан прочерк
  isNegotiable?: boolean // Для "Договорная"
}

export interface ServiceSection {
  id: string
  title: string
  items: ServiceItem[]
}

export interface ServicePriceListProps {
  className?: string
  sections: ServiceSection[]
}
