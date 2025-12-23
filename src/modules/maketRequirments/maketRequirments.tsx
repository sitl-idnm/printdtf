import { FC, useMemo } from 'react'
import classNames from 'classnames'

import styles from './maketRequirments.module.scss'
import { MaketRequirmentsProps } from './maketRequirments.types'
import FormatIcon from '@icons/format.svg'
import RazmerIcon from '@icons/razmer.svg'

const MaketRequirments: FC<MaketRequirmentsProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)
  const lines = useMemo(
    () => [
      '// Формат и цвет:',
      '- Цветовая модель: RGB sRGB IEC61966-2.1 или CMYK,',
      '- Расширение файла превью/предпросмотра: JPG, PNG, PDF,',
      '- Расширение файла для печати: PDF, CDR,',
      '- Плашечные цвета должны быть указаны в цветовой системе PANTONE Solid Coated или PANTONE Solid Uncoated и написаны в превью,',
      '- Для достижения большей насыщенности черный цвет должен быть составным C-51 M-68 Y-81 K-100,',
      '- Файлы линейки Microsoft office (Word, Excel, Publisher) не являются макетами,',
      '- Каждый макет должен быть отдельным файлом,',
      '- Если файла превью нет – указывайте цвет и тип изделия для нанесения, например, шоппер черный 220г или поло светло-голубое,',
      '',
      '// Размеры и разрешение:',
      '- Масштаб 1:1,',
      '- Разрешение 600 dpi,',
      '',
      '// Текст и шрифты:',
      '- Шрифты, контуры (обводки) обязательно должны быть переведены в кривые; векторные эффекты, градиенты должны быть растрированы,',
      '',
      '// Специальное:',
      '- Отсутствие элементов с толщиной линии менее, чем 0,8-1 мм для CMYK (для белого допускается 0,4-0,6 мм, если этот элемент небольшой - до 5-6 см по длине),',
      '- Все элементы печати должны быть 100% непрозрачными,',
      '- В макете не должны стоять метки реза и любые другие технические метки, фон, не имеющие отношение к печати,',
      '- Не используйте обтравочные маски, скрытые объекты и скрытые слои, подложки и другие подобные опции,',
      '- Не допускается наличие в макетах сплошных одноцветных заливок более 20х20см,',
      '- Для светлых принтов на темных изделиях добавляйте небольшую обводку (0,25мм или 6 пикселей).',
    ],
    []
  )

  const allText = useMemo(() => lines.join('\n'), [lines])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(allText)
    } catch {
      // no-op
    }
  }

  // Группируем строки по секциям
  const sections = useMemo(() => {
    const result: Array<{ title: string; items: string[] }> = []
    let currentSection: { title: string; items: string[] } | null = null

    lines.forEach((line) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('//')) {
        if (currentSection) {
          result.push(currentSection)
        }
        currentSection = {
          title: trimmed.replace('//', '').trim(),
          items: []
        }
      } else if (trimmed.startsWith('-') && currentSection) {
        currentSection.items.push(trimmed.replace('-', '').trim())
      }
    })

    if (currentSection) {
      result.push(currentSection)
    }

    return result
  }, [lines])

  const getSectionIcon = (title: string) => {
    if (title.includes('Формат') || title.includes('цвет')) {
      return (
        <FormatIcon />
      )
    }
    if (title.includes('Размеры') || title.includes('разрешение')) {
      return (
        <RazmerIcon />
      )
    }
    if (title.includes('Текст') || title.includes('шрифты')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 15h6" />
        </svg>
      )
    }
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    )
  }

  return (
    <div className={rootClassName}>
      <div className={styles.header}>
        <h2 className={styles.title}>Требования к макетам</h2>
        <p className={styles.subtitle}>Следуйте этим рекомендациям для идеального результата</p>
      </div>
      <div className={styles.content}>
        <div className={styles.grid}>
          {sections.map((section, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  {getSectionIcon(section.title)}
                </div>
                <h3 className={styles.sectionTitle}>{section.title}</h3>
              </div>
              <ul className={styles.itemsList}>
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className={styles.item}>
                    <span className={styles.itemMarker} />
                    <span className={styles.itemText}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button className={styles.copyBtn} type="button" onClick={handleCopy} aria-label="Скопировать требования">
          <svg className={styles.copyIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
          </svg>
          <span>Скопировать требования</span>
        </button>
      </div>
    </div>
  )
}

export default MaketRequirments
