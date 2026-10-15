import { Link } from 'react-router-dom'

export default function MembershipCard({ membership, onSubscribe, index = 0 }) {
  const animationDelay = `${index * 45}ms`
  const previewFeatures = membership.features.slice(0, 3)
  const restCount = membership.features.length - previewFeatures.length

  return (
    <article className="mcard" style={{ animationDelay }}>
      <header className="mcard__head">
        <span className="mcard__code">{membership.code}</span>
        {membership.tag && <span className="mcard__tag">{membership.tag}</span>}
      </header>

      <h3 className="mcard__title">{membership.title}</h3>
      <p className="mcard__subtitle">{membership.subtitle}</p>

      <ul className="mcard__features">
        {previewFeatures.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
        {restCount > 0 && <li className="mcard__features-more">+ ещё {restCount}</li>}
      </ul>

      <footer className="mcard__footer">
        <div className="mcard__price">
          <span>{membership.price.toLocaleString('ru-RU')} ₽</span>
          <small>/мес</small>
        </div>

        <div className="mcard__actions">
          <Link className="btn btn--ghost btn--sm" to={`/catalog/${membership.id}`}>
            Детали
          </Link>
          {onSubscribe && (
            <button
              className="btn btn--primary btn--sm"
              type="button"
              onClick={() => onSubscribe(membership)}
            >
              Оформить
            </button>
          )}
        </div>
      </footer>
    </article>
  )
}