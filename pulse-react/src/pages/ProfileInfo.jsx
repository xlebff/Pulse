import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import useSubscriptions from '../hooks/useSubscriptions'

export default function ProfileInfo() {
    const { user, logout } = useAuth()
    const { subscriptions } = useSubscriptions()
    const navigate = useNavigate()

    const total = subscriptions.reduce((sum, item) => sum + item.total, 0)

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <div className="panel">
            <header className="panel__head">
                <span className="section__eyebrow">Профиль</span>
                <h2 className="panel__title">Данные участника</h2>
            </header>

            <div className="info-list">
                <div className="info-list__row">
                    <span>Имя</span>
                    <strong>{user.name}</strong>
                </div>
                <div className="info-list__row">
                    <span>Email</span>
                    <strong>{user.email}</strong>
                </div>
                <div className="info-list__row">
                    <span>Роль</span>
                    <strong>{user.role}</strong>
                </div>
                <div className="info-list__row">
                    <span>Оформлено абонементов</span>
                    <strong>{subscriptions.length}</strong>
                </div>
                <div className="info-list__row">
                    <span>Сумма оформлений</span>
                    <strong>{total.toLocaleString('ru-RU')} ₽</strong>
                </div>
            </div>

            <div>
                <Button variant="danger" onClick={handleLogout}>
                    Выйти из аккаунта
                </Button>
            </div>
        </div>
    )
}