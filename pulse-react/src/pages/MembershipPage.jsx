import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import memberships from '../data/memberships'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'
import useSubscriptions from '../hooks/useSubscriptions'

const durations = [1, 3, 6, 12]

export default function MembershipPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { addSubscription } = useSubscriptions()

    const [months, setMonths] = useState(1)
    const [isModalOpen, setModalOpen] = useState(false)
    const [error, setError] = useState('')

    const membership = memberships.find((item) => item.id === Number(id))

    if (!membership) {
        return (
            <section className="section page">
                <div className="container empty">
                    <h1 className="empty__title">Абонемент не найден</h1>
                    <p className="empty__text">
                        Возможно, ссылка устарела. Вернись в каталог и выбери тариф заново.
                    </p>
                    <Button onClick={() => navigate('/catalog')}>В каталог</Button>
                </div>
            </section>
        )
    }

    async function handleSubscribe() {
        if (!user) {
            navigate('/login', { state: { from: `/catalog/${membership.id}` } })
            return
        }
        setError('')
        try {
            await addSubscription(membership, months)
            setModalOpen(true)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <section className="section page">
            <div className="container">
                <button className="back-link" type="button" onClick={() => navigate(-1)}>
                    ← Назад
                </button>

                <div className="detail">
                    <aside className="detail__aside">
                        <span className="detail__code">{membership.code}</span>
                        <span className="detail__caption">Абонемент</span>
                        {membership.tag && <span className="mcard__tag">{membership.tag}</span>}
                    </aside>

                    <div className="detail__body">
                        <h1 className="detail__title">{membership.title}</h1>
                        <p className="detail__subtitle">{membership.subtitle}</p>
                        <p className="detail__description">{membership.description}</p>

                        <h2 className="detail__heading">Что входит</h2>
                        <ul className="features-list">
                            {membership.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>

                        <div className="detail__booking">
                            <div className="field">
                                <span className="field__label">Срок</span>
                                <div className="duration-picker">
                                    {durations.map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            className={months === m ? 'duration duration--active' : 'duration'}
                                            onClick={() => setMonths(m)}
                                        >
                                            {m} мес
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="detail__summary">
                                <div className="detail__price">
                                    {(membership.price * months).toLocaleString('ru-RU')} ₽
                                    <small>
                                        {membership.price.toLocaleString('ru-RU')} ₽ × {months} мес
                                    </small>
                                </div>

                                <Button variant="accent" onClick={handleSubscribe}>
                                    Оформить
                                </Button>
                            </div>
                        </div>

                        {error && <p className="form__error">{error}</p>}

                        {!user && (
                            <p className="detail__hint">
                                Чтобы оформить — <Link to="/login">войди</Link> или{' '}
                                <Link to="/register">зарегистрируйся</Link>.
                            </p>
                        )}
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    title="Готово"
                    onClose={() => setModalOpen(false)}
                    footer={
                        <Button onClick={() => navigate('/profile/subscriptions')}>
                            Мои абонементы
                        </Button>
                    }
                >
                    <p className="booking-form__zone">
                        «{membership.title}» оформлен на {months} мес.
                    </p>
                    <p className="booking-form__text">
                        Активируем на первом визите. Сумма к оплате на ресепшене:{' '}
                        <strong>{(membership.price * months).toLocaleString('ru-RU')} ₽</strong>.
                    </p>
                </Modal>
            </div>
        </section>
    )
}