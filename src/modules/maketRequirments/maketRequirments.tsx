import { FC, useEffect, useMemo, useRef, useState } from 'react'
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
  const [typedLen, setTypedLen] = useState(0)
  const [copied, setCopied] = useState(false)
  const [inView, setInView] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const autoScrollRef = useRef(true)
  const rafRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)
  const typedLenRef = useRef<number>(0)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(allText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      // no-op
    }
  }

  const typedText = useMemo(() => allText.slice(0, typedLen), [allText, typedLen])
  const isDone = typedLen >= allText.length

  useEffect(() => {
    typedLenRef.current = typedLen
  }, [typedLen])

  // start typing only when the block is in viewport
  useEffect(() => {
    const el = panelRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting)
        setInView(visible)
      },
      { root: null, threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  // internal scroll: disable autoscroll if user scrolls up, re-enable near bottom
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 32
      autoScrollRef.current = nearBottom
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // printing animation (typewriter + gentle "scrub" speed); respects prefers-reduced-motion
  useEffect(() => {
    if (!inView) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }
    if (typedLenRef.current >= allText.length) return

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) {
      setTypedLen(allText.length)
      return
    }

    const speed = 48 // chars per second
    lastTickRef.current = performance.now()

    const tick = (t: number) => {
      const dt = Math.max(0, (t - lastTickRef.current) / 1000)
      lastTickRef.current = t

      const nextLen = Math.min(allText.length, typedLenRef.current + Math.ceil(speed * dt))
      typedLenRef.current = nextLen
      setTypedLen(nextLen)

      // autoscroll while printing, if user didn't scroll away
      const el = scrollRef.current
      if (el && autoScrollRef.current) {
        el.scrollTop = el.scrollHeight
      }

      if (nextLen < allText.length && inView) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    // start
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allText, inView])

  return (
    <div className={rootClassName}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Требования к макетам</h2>
          <p className={styles.subtitle}>Следуйте этим рекомендациям для идеального результата</p>
        </div>
      </div>

      <div className={styles.panel} ref={panelRef}>
        <div className={styles.panelTop}>
          <div className={styles.status}>
            <span className={classNames(styles.dot, styles.dotOk)} aria-hidden="true" />
            <span className={classNames(styles.dot, styles.dotWarn)} aria-hidden="true" />
            <span className={classNames(styles.dot, styles.dotInfo)} aria-hidden="true" />
            <span className={styles.statusText}>{isDone ? 'Готово' : 'Печатаем…'}</span>
          </div>

          <div className={styles.actions}>
            <button className={styles.copyBtn} type="button" onClick={handleCopy} aria-label="Скопировать требования">
              <svg className={styles.copyIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z" />
              </svg>
              <span>{copied ? 'Скопировано' : 'Скопировать текст'}</span>
            </button>
          </div>
        </div>

        <div className={styles.scroll} ref={scrollRef}>
          <div className={classNames(styles.scan, { [styles.scanOn]: !isDone })} aria-hidden="true" />
          <pre className={styles.paper} aria-label="Требования к макетам">
            <code>
              {typedText}
              {!isDone ? <span className={styles.caret} aria-hidden="true" /> : null}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default MaketRequirments
