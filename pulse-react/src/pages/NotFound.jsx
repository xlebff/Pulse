import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section page">
      <div className="container empty notfound">
        <span className="notfound__code">404</span>
        <h1 className="empty__title">Страница не найдена</h1>
        <p className="empty__text">
          Такой страницы в клубе нет. Проверь адрес или вернись на главную.
        </p>
        <Link className="btn btn--primary" to="/">
          На главную
        </Link>
      </div>
    </section>
  )
}