import { FC, useMemo } from 'react'
import classNames from 'classnames'

import styles from './maketRequirments.module.scss'
import { MaketRequirmentsProps } from './maketRequirments.types'

const MaketRequirments: FC<MaketRequirmentsProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)
  const lines = useMemo(
    () => [
      '// Формат и цвет:',
      '- Файлы: PDF / SVG / EPS / PNG (прозрачный фон),',
      '- Цветовая модель: RGB или CMYK (без профилей),',
      '',
      '// Размеры и разрешение:',
      '- Масштаб 1:1; разрешение растров от 300 dpi,',
      '- Критичные элементы на отступе ≥ 3 мм от края,',
      '',
      '// Текст и шрифты:',
      '- Текст в кривых или шрифты приложены к макету,',
      '',
      '// Специальное:',
      '- Без эффектов (тени/прозрачности) — сведены,',
      '- Толщина линий ≥ 0.3 мм; минимальный размер 2 мм.',
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 15h6" />
        </svg>
      )
    }
    if (title.includes('Размеры') || title.includes('разрешение')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 15h6" />
        </svg>
      )
    }
    if (title.includes('Текст') || title.includes('шрифты')) {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20h16M6 4v16M18 4v16" />
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
