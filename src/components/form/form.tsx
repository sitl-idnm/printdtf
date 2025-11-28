import { FC } from 'react'
import classNames from 'classnames'

import styles from './form.module.scss'
import { FormProps } from './form.types'
import { useMemo, useState } from 'react'
import ButtonWave from '@/ui/buttonWave/buttonWave'

const Form: FC<FormProps> = ({
  className,
  submitLabel,
  theme = 'default'
}) => {
  const rootClassName = classNames(
    styles.root,
    theme === 'invert' && styles.invert,
    className
  )
  const formatPhoneFromDigits = (digitsRaw: string) => {
    const core = digitsRaw.slice(0, 10)
    if (core.length === 0) return ''
    const part1 = core.slice(0, 3)
    const part2 = core.slice(3, 6)
    const part3 = core.slice(6, 8)
    const part4 = core.slice(8, 10)
    let out = '+7'
    if (part1) out += ` (${part1}`
    if (core.length >= 3) out += `)`
    if (part2) out += ` ${part2}`
    if (part3) out += `-${part3}`
    if (part4) out += `-${part4}`
    return out
  }

  const formatTelegram = (raw: string) => {
    const cleaned = raw.replace(/[^a-zA-Z0-9_@]/g, '')
    if (cleaned === '') return ''
    const noAt = cleaned.replace(/^@+/, '').slice(0, 40)
    return `@${noAt}`
  }

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [telegram, setTelegram] = useState('')
  const [messenger, setMessenger] = useState<'Telegram' | 'WhatsApp' | ''>('')
  const [method, setMethod] = useState<'UV DTF' | 'DTF' | ''>('')
  const [agree, setAgree] = useState(false)

  const isNameActive = useMemo(() => name.length > 0, [name])
  const isPhoneActive = useMemo(() => phone.length > 0, [phone])
  const isTelegramActive = useMemo(() => telegram.length > 0, [telegram])
  const isMessengerActive = useMemo(() => messenger !== '', [messenger])
  const isMethodActive = useMemo(() => method !== '', [method])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <form className={rootClassName} onSubmit={onSubmit}>
      <div className={classNames(styles.control, isNameActive && styles.filled)}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <label className={styles.fieldLabel} htmlFor="form-name">Ваше имя</label>
          <div className={styles.inputCell}>
            <span className={styles.ph}>Введите свое имя</span>
            <input
              id="form-name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                    .replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '')
                    .slice(0, 40)
                )
              }
              autoComplete="name"
              required
            />
          </div>
        </div>
      </div>

      <div className={classNames(styles.control, isPhoneActive && styles.filled)}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <label className={styles.fieldLabel} htmlFor="form-phone">Ваш телефон</label>
          <div className={styles.inputCell}>
            <span className={styles.ph}>Введите телефон</span>
            <input
              id="form-phone"
              className={styles.input}
              type="tel"
              value={phone}
              onChange={(e) => {
                const rawDigits = e.target.value.replace(/\D/g, '')
                // remove leading country digit coming from the "+7" prefix in the UI
                const national = rawDigits.startsWith('7') ? rawDigits.slice(1) : rawDigits
                const clamped = national.slice(0, 10)
                setPhone(formatPhoneFromDigits(clamped))
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Backspace') return
                const target = e.currentTarget
                const start = target.selectionStart ?? 0
                const end = target.selectionEnd ?? 0
                // Only custom-handle collapsed caret (no selection)
                if (start !== end) return
                e.preventDefault()
                const rawDigits = phone.replace(/\D/g, '')
                const national = rawDigits.startsWith('7') ? rawDigits.slice(1) : rawDigits
                if (national.length === 0) {
                  // nothing to delete
                  setPhone('')
                  return
                }
                // Count digits before caret (includes the country digit '7' from "+7")
                const digitsBeforeCaretAll = target.value.slice(0, start).replace(/\D/g, '').length
                // Convert to index within national part (exclude the country digit)
                const nationalBefore = Math.max(0, digitsBeforeCaretAll - 1)
                // We want to delete the digit immediately BEFORE the caret
                if (nationalBefore === 0) {
                  // Caret is before first national digit: nothing to delete
                  return
                }
                const deleteIndex = nationalBefore - 1
                const newDigits =
                  national.slice(0, deleteIndex) + national.slice(deleteIndex + 1)
                setPhone(formatPhoneFromDigits(newDigits))
              }}
              onFocus={() => {
                const digits = phone.replace(/\D/g, '')
                if (digits.length === 0) setPhone('+7 ')
              }}
              onBlur={() => {
                const digits = phone.replace(/\D/g, '')
                if (digits.length === 0) setPhone('')
              }}
              autoComplete="tel"
              required
            />
          </div>
        </div>
      </div>

      <div className={classNames(styles.control, isTelegramActive && styles.filled)}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <label className={styles.fieldLabel} htmlFor="form-telegram">Telegram</label>
          <div className={styles.inputCell}>
            <span className={styles.ph}>Введите свой никнейм</span>
            <input
              id="form-telegram"
              className={styles.input}
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(formatTelegram(e.target.value))}
              onFocus={() => {
                if (telegram === '') setTelegram('@')
              }}
              onBlur={() => {
                if (telegram === '@') setTelegram('')
              }}
            />
          </div>
        </div>
      </div>

      <div className={classNames(styles.control, isMessengerActive && styles.filled)}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <span className={styles.choiceLabel}>Мессенджер</span>
          <div className={classNames(styles.options, styles.optionsRow)}>
            {(['Telegram', 'WhatsApp'] as const).map((m) => (
              <ButtonWave
                key={m}
                className={classNames(styles.option, messenger === m && styles.selected)}
                variant="accent2"
                onClick={() => setMessenger(m)}
              >
                {m}
              </ButtonWave>
            ))}
          </div>
        </div>
      </div>

      <div className={classNames(styles.control, isMethodActive && styles.filled)}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <span className={styles.choiceLabel}>Метод печати</span>
          <div className={classNames(styles.options, styles.optionsRow)}>
            {(['UV DTF', 'DTF'] as const).map((m) => (
              <ButtonWave
                key={m}
                className={classNames(styles.option, method === m && styles.selected)}
                variant="accent3"
                onClick={() => setMethod(m)}
              >
                {m}
              </ButtonWave>
            ))}
          </div>
        </div>
      </div>

      <label className={styles.agree}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          required
        />
        <span>
          Подтверждаю, что предоставляю согласие на обработку моих персональных данных и согласен с условиями Политики.
        </span>
      </label>

      <div className={styles.actions}>
        <ButtonWave variant="accent2" className={styles.cta}>
          {submitLabel ?? 'Отправить'}
        </ButtonWave>
      </div>
    </form>
  )
}

export default Form
