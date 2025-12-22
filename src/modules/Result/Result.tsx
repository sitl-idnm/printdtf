import styles from './styles.module.css';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// TextAnimation component not found, using simple heading instead
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface CardScrollAnimationProps {
  children: React.ReactNode;
}

const CardScrollAnimation = ({ children }: CardScrollAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      const cardsRegular = containerRef.current.querySelectorAll(`.${styles.cardRegular}`);
      const cardsOrange = containerRef.current.querySelectorAll(`.${styles.cardOrange}`);
      const cardsWhite = containerRef.current.querySelectorAll(`.${styles.cardWhite}`);

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 10% center', // Начинаем анимацию, когда верх контейнера достигает верха окна
          end: 'bottom', // Анимация длится на 300% высоты окна
          scrub: 1, // Привязка анимации к прокрутке
          pin: true, // Фиксируем скролл на месте, пока длится анимация
        }
      })
        .fromTo(cardsRegular,
          { y: 800, rotation: -10, opacity: 0 }, // Начальное состояние (карточки снизу, повёрнуты, прозрачные)
          {
            y: 0, rotation: 0, opacity: 1, // Конечное состояние (карточки на месте, без поворота, видимые)
            stagger: 0.9, // Задержка между анимацией каждой карточки
            ease: 'power2.out',
            duration: 2
          }
        )
        .fromTo(cardsOrange,
          { y: 800, rotation: 40, opacity: 0 }, // Начальное состояние (карточки снизу, повёрнуты, прозрачные)
          {
            y: 30, rotation: -10, opacity: 1, // Конечное состояние (карточки на месте, без поворота, видимые)
            stagger: 0.9, // Задержка между анимацией каждой карточки
            ease: 'power2.out',
            duration: 2
          }
        )

        .fromTo(cardsWhite,
          { y: 800, rotation: -40, opacity: 0 }, // Начальное состояние (карточки снизу, повёрнуты, прозрачные)
          {
            y: 30, rotation: 10, opacity: 1, // Конечное состояние (карточки на месте, без поворота, видимые)
            stagger: 0.9, // Задержка между анимацией каждой карточки
            ease: 'power2.out',
            duration: 2
          }
        )
    }
  }, []);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {children}
    </div>
  );
};

export const Result = () => {
  return (
    <div className={styles.section}>
      <CardScrollAnimation>
        <h2 className={styles.title}>
          Добиваемся результатов<br />
          за счет жестких принципов<br />
          и мягких подходов
        </h2>
        <div className={styles.cardWrapper}>
          <div className={`${styles.card} ${styles.cardRegular}`}>
            <h3 className={styles.cardTitle}>
              Правило «Win&nbsp;/&nbsp;Win&nbsp;/&nbsp;Win»
            </h3>
            <p className={styles.cardDescription}>
              <span className={styles.cardDescriptionSemibold}>Сотрудникам </span>
              – ресурсы для профессионального роста и самовыражения
            </p>
            <p className={styles.cardDescription}>
              Клиентам – качественный результат
            </p>
            <p className={styles.cardDescription}>
              Нам – статус ведущего агентства в сфере лидогенерации
            </p>
          </div>
          <div className={`${styles.card} ${styles.cardOrange}`}>
            <h3 className={styles.cardTitle}>Высокие требования к&nbsp;результату</h3>
            <p className={styles.cardDescription}>
              Мы делаем всё, чтобы заказчик получил больше того, на что
              рассчитывал!
            </p>
          </div>
          <div className={`${styles.card} ${styles.cardWhite}`}>
            <h3 className={styles.cardTitle}>Dream Team</h3>
            <p className={styles.cardDescription}>
              Собираем у себя только проактивных людей и вкладываемся в их
              развитие, чтобы получать идеальные результаты!
            </p>
          </div>
        </div>
      </CardScrollAnimation>
    </div>
  );
};
