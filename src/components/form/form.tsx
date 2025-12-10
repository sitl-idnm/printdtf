import { FC } from 'react'
import classNames from 'classnames'

import styles from './form.module.scss'
import { FormProps } from './form.types'
import { useState } from 'react'
import ButtonWave from '@/ui/buttonWave/buttonWave'
import { useAtomValue } from 'jotai'
import { printMethodReadAtom } from '@/shared/atoms/printMethodAtom'

const Form: FC<FormProps> = ({
  className,
  submitLabel,
  theme = 'default',
  useAtomPrintMethod = false
}) => {
  const rootClassName = classNames(
    styles.root,
    theme === 'invert' && styles.invert,
    className
  )
  const atomMethod = useAtomValue(printMethodReadAtom)
  const atomMethodHuman: 'UV DTF' | 'DTF' = atomMethod === 'uvdtf' ? 'UV DTF' : 'DTF'
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


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const resolvedMethod = useAtomPrintMethod ? atomMethodHuman : method
    const payload = {
      name,
      phone,
      telegram: telegram || undefined,
      messenger,
      method: resolvedMethod,
      agree
    }
    // Replace with actual submission logic
    // eslint-disable-next-line no-console
    console.log('Form submit:', payload)
  }

  return (
    <form className={rootClassName} onSubmit={onSubmit}>
      <div className={styles.control}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <label className={styles.fieldLabel} htmlFor="form-name">Ваше имя</label>
          <div className={styles.inputCell}>
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
              placeholder="Введите свое имя"
              autoComplete="name"
              required
            />
          </div>
        </div>
      </div>

      <div className={styles.control}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <label className={styles.fieldLabel} htmlFor="form-phone">Ваш телефон</label>
          <div className={styles.inputCell}>
            <input
              id="form-phone"
              className={styles.input}
              type="tel"
              value={phone}
              onChange={(e) => {
                const rawDigits = e.target.value.replace(/\D/g, '')
                const national = rawDigits.startsWith('7') ? rawDigits.slice(1) : rawDigits
                const clamped = national.slice(0, 10)
                setPhone(formatPhoneFromDigits(clamped))
              }}
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
              required
            />
          </div>
        </div>
      </div>

      <div className={styles.control}>
        <div className={styles.topLine} />
        <div className={styles.row}>
          <label className={styles.fieldLabel} htmlFor="form-telegram">Telegram</label>
          <div className={styles.inputCell}>
            <input
              id="form-telegram"
              className={styles.input}
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(formatTelegram(e.target.value))}
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      <div className={styles.control}>
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

      {useAtomPrintMethod ? null : (
        <div className={styles.control}>
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
      )}

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
        <ButtonWave variant="accent2" className={styles.cta} type="submit">
          {submitLabel ?? 'Отправить'}
        </ButtonWave>
      </div>
    </form>
  )
}

export default Form
