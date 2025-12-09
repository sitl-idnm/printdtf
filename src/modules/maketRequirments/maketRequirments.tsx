import { FC, useMemo } from 'react'
import classNames from 'classnames'

import styles from './maketRequirments.module.scss'
import { MaketRequirmentsProps } from './maketRequirments.types'
import { ButtonWave } from '@/ui'

const MaketRequirments: FC<MaketRequirmentsProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)
  const lines = useMemo(
    () => [
      '// ТРЕБОВАНИЯ К МАКЕТАМ',
      '',
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

  return (
    <div className={rootClassName}>
      <h2 className={styles.title}>Требования к макетам</h2>
      <div className={styles.code}>
        <div className={styles.codeHeader}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.content}>
          <button className={styles.copyIconBtn} type="button" onClick={handleCopy} aria-label="Скопировать">
            <svg className={styles.copyIconSvg} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
            </svg>
          </button>
          {lines.map((t, i) => {
            const trimmed = t.trim()
            const isComment = trimmed.startsWith('//')
            const isMeta = trimmed.startsWith('-')
            return (
              <span
                key={i}
                className={classNames(
                  styles.line,
                  isComment && styles.isComment,
                  isMeta && styles.isMeta
                )}
              >
                {t}
              </span>
            )
          })}
          <ButtonWave variant="accent3" className={styles.copyBtn} onClick={handleCopy}>Скопировать требования</ButtonWave>
        </div>
      </div>
    </div>
  )
}

export default MaketRequirments
