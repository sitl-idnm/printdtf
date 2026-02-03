'use client'

import { useRouter } from 'next/navigation'
import { Wrapper } from '@ui/wrapper'
import { ButtonWave } from '@ui/buttonWave'
import styles from './notFound.module.scss'

export default function NotFoundView() {
  const router = useRouter()

  return (
    <Wrapper>
      <section className={styles.root}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.text}>Такой страницы не существует</p>
        <div className={styles.actions}>
          <ButtonWave
            variant="accent2"
            className={styles.button}
            onClick={() => router.push('/')}
          >
            На главную
          </ButtonWave>
        </div>
      </section>
    </Wrapper>
  )
}

