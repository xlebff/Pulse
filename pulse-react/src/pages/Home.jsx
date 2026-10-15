import { Link } from 'react-router-dom'
import memberships from '../data/memberships'
import MembershipCard from '../components/MembershipCard'

const stats = [
  { num: '01', value: '500 м²', label: 'тренировочного пространства' },
  { num: '02', value: '40+', label: 'групповых тренировок в неделю' },
  { num: '03', value: '12', label: 'тренеров с сертификатами' },
]

const directions = [
  { code: 'A', title: 'Силовые', text: 'Свободные веса, тренажёры и платформы.' },
  { code: 'B', title: 'Кардио', text: 'Беговые дорожки, гребные, сайклы.' },
  { code: 'C', title: 'Групповые', text: 'Йога, пилатес, HIIT, функционал.' },
  { code: 'D', title: 'Восстановление', text: 'Бассейн, сауна, хаммам, массаж.' },
]

export default function Home() {
  const popular = memberships.filter((item) => item.popular)

  return (
    <div className="page">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <span className="badge badge--dot">Открыт набор на сезон 2025</span>

            <h1 className="hero__title">
              Форма
              <br />
              начинается
              <br />
              <em>здесь</em>
            </h1>

            <p className="hero__text">
              Клуб силы и движения в центре Москвы. Силовой зал, групповые
              программы, бассейн и восстановление — в одном пространстве.
            </p>

            <div className="hero__actions">
              <Link className="btn btn--accent" to="/catalog">
                Смотреть абонементы
              </Link>
              <Link className="btn btn--ghost" to="/register">
                Создать аккаунт
              </Link>
            </div>
          </div>

          <aside className="hero__panel">
            <span className="hero__panel-head">Клуб в цифрах</span>
            {stats.map((item) => (
              <div className="hero__panel-row" key={item.num}>
                <span className="hero__panel-num">{item.num}</span>
                <div>
                  <div className="hero__panel-value">{item.value}</div>
                  <div className="hero__panel-label">{item.label}</div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section__head">
            <div>
              <span className="section__eyebrow">Абонементы</span>
              <h2 className="section__title">Выбери свой формат</h2>
            </div>
            <Link className="section__link" to="/catalog">
              Все тарифы →
            </Link>
          </header>

          <div className="grid">
            {popular.map((membership, index) => (
              <MembershipCard key={membership.id} membership={membership} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <header className="section__head">
            <div>
              <span className="section__eyebrow">Направления</span>
              <h2 className="section__title">Что есть в клубе</h2>
            </div>
          </header>

          <div className="directions">
            {directions.map((item) => (
              <div className="direction" key={item.code}>
                <span className="direction__code">{item.code}</span>
                <h3 className="direction__title">{item.title}</h3>
                <p className="direction__text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div className="cta__content">
              <h2 className="cta__title">
                Дисциплина
                <br />
                вместо мотивации
              </h2>
              <p className="cta__text">
                Приходи на вводную тренировку — подберём формат под твои цели
                и расписание.
              </p>
              <Link className="btn btn--primary" to="/register">
                Стать участником
              </Link>
            </div>
            <div className="cta__mark" aria-hidden="true">P.</div>
          </div>
        </div>
      </section>
    </div>
  )
}