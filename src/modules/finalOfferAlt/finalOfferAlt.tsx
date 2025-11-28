import { FC } from 'react'
import classNames from 'classnames'

import styles from './finalOfferAlt.module.scss'
import { FinalOfferAltProps } from './finalOfferAlt.types'
import Form from '@/components/form/form'

const FinalOfferAlt: FC<FinalOfferAltProps> = ({ className }) => {
	const rootClassName = classNames(styles.root, className)

	return (
		<section className={rootClassName}>
			<div className={styles.content}>
				<div className={styles.right}>
					<Form submitLabel="Отправить заявку" />
				</div>
				<div className={styles.left}>
					<h2 className={styles.title}>Оставьте заявку на расчёт</h2>
					<p className={styles.text}>
						Выберите метод (DTF/UV DTF), укажите носитель — наш менеджер
						свяжется с вами в течение 15 минут.
					</p>
				</div>
			</div>
		</section>
	)
}

export default FinalOfferAlt
