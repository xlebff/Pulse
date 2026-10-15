import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Абонементы' },
]

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    isActive ? 'nav__link nav__link--active' : 'nav__link'

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo__mark" aria-hidden="true" />
          <span className="logo__text">PULSE</span>
        </Link>

        <button
          className={isMenuOpen ? 'burger burger--open' : 'burger'}
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Меню"
        >
          <span className="burger__line" />
          <span className="burger__line" />
        </button>

        <nav className={isMenuOpen ? 'nav nav--open' : 'nav'}>
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={linkClass}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}

          {user && (
            <NavLink to="/profile" className={linkClass} onClick={closeMenu}>
              Кабинет
            </NavLink>
          )}

          {user ? (
            <div className="nav__auth">
              <span className="nav__user">
                <span className="nav__avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="nav__username">{user.name}</span>
              </span>
              <button className="btn btn--ghost btn--sm" type="button" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <div className="nav__auth">
              <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                Войти
              </NavLink>
              <Link className="btn btn--primary btn--sm" to="/register" onClick={closeMenu}>
                Регистрация
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}