'use client'
import { FC, useState } from 'react'
import classNames from 'classnames'

import styles from './lineButton.module.scss'
import { LineButtonProps } from './lineButton.types'
import { FormModal } from '@/modules/formModal'
import { ButtonWave } from '../buttonWave'
import { useAtomValue } from 'jotai'
import { printMethodReadAtom } from '@/shared/atoms/printMethodAtom'

const LineButton: FC<LineButtonProps> = ({
  className
}) => {
  const rootClassName = classNames(styles.root, className)
  const [isOpen, setOpen] = useState(false)
  const printMethod = useAtomValue(printMethodReadAtom)

  return (
    <div className={rootClassName}>
      <FormModal
        open={isOpen}
        onClose={() => setOpen(false)}
        title="Оставьте заявку на расчёт"
        text="Выберите метод (DTF/UV DTF), укажите носитель — наш менеджер свяжется с вами в течение 15 минут."
      />
      <ButtonWave variant="accent2" className={styles.btn} onClick={() => {setOpen(true)}}>
        Заказать {printMethod === 'dtf' ? 'DTF печать' : 'UV-DTF печать'}
      </ButtonWave>
    </div>
  )
}

export default LineButton
