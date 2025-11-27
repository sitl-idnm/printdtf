'use client'
import { FC, useMemo, useState } from 'react'
import classNames from 'classnames'

import styles from './sliderBeforeAfter.module.scss'
import { SliderBeforeAfterProps } from './sliderBeforeAfter.types'

const SliderBeforeAfter: FC<SliderBeforeAfterProps> = ({
  className,
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  initial = 0.5,
}) => {
  const rootClassName = classNames(styles.root, className)
  const clampedInitial = useMemo(() => {
    if (initial < 0) return 0
    if (initial > 1) return 1
    return initial
  }, [initial])
  const [pos, setPos] = useState<number>(Math.round(clampedInitial * 100))

  const rootStyle: React.CSSProperties = {
    // css var is a percent string, ex '50%'
    ['--pos' as unknown as string]: `${pos}%`,
  }

  return (
    <div className={rootClassName} style={rootStyle}>
      <div className={styles.stage}>
        <div className={classNames(styles.pane, styles.after)}>
          {after ?? (
            <div className={styles.fallback}>
              <h3>{afterLabel}</h3>
              <p>Add “after” content</p>
            </div>
          )}
        </div>
        <div className={classNames(styles.pane, styles.before)} aria-hidden={false}>
          <div className={styles.beforeMask}>
            {before ?? (
              <div className={styles.fallback}>
                <h3>{beforeLabel}</h3>
                <p>Add “before” content</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.handle} role="separator" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pos} aria-label="Comparison position">
          <div className={styles.handleLine} />
        </div>
        <div className={styles.handleSticky}>
          <div className={styles.handleDot} />
        </div>
        <div className={styles.badges}>
          <button
            type="button"
            className={classNames(styles.badge,
              styles.badgeLeft)}
            onClick={() => setPos(0)}
          >
            {beforeLabel}
          </button>
          <button
            type="button"
            className={classNames(styles.badge,
              styles.badgeRight)}
            onClick={() => setPos(100)}
          >
            {afterLabel}
          </button>
        </div>
        <input
          className={styles.range}
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={pos}
          aria-label="Before and after position"
          onChange={(e) => setPos(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default SliderBeforeAfter
