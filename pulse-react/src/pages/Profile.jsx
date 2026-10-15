import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  const linkClass = ({ isActive }) =>
    isActive ? 'profile__link profile__link--active' : 'profile__link'

  return (
    <section className="section page">
      <div className="container">
        <div className="profile">
          <aside className="profile__aside">
            <div className="profile__avatar">{user.name.charAt(0).toUpperCase()}</div>
            <h2 className="profile__name">{user.name}</h2>
            <p className="profile__email">{user.email}</p>

            <nav className="profile__nav">
              <NavLink to="/profile" end className={linkClass}>
                Профиль
              </NavLink>
              <NavLink to="/profile/subscriptions" className={linkClass}>
                Мои абонементы
              </NavLink>
            </nav>
          </aside>

          <div className="profile__content">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  )
}