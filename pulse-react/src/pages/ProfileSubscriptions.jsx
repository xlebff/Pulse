import { Link } from 'react-router-dom'
import useSubscriptions from '../hooks/useSubscriptions'
import Button from '../components/Button'

export default function ProfileSubscriptions() {
    const { subscriptions, removeSubscription } = useSubscriptions()

    async function handleRemove(id) {
        try {
            await removeSubscription(id)
        } catch (err) {
            alert(err.message)
        }
    }

    if (subscriptions.length === 0) {
        return (
            <div className="panel">
                <header className="panel__head">
                    <span className="section__eyebrow">Абонементы</span>
                    <h2 className="panel__title">Мои абонементы</h2>
                </header>

                <div className="empty">
                    <h3 className="empty__title">Пока пусто</h3>
                    <p className="empty__text">
                        Ты ещё не оформлял абонемент. Выбери тариф — активируем на первом визите.
                    </p>
                    <Link className="btn btn--primary" to="/catalog">
                        В каталог
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="panel">
            <header className="panel__head">
                <span className="section__eyebrow">Абонементы</span>
                <h2 className="panel__title">Мои абонементы</h2>
            </header>

            <div className="subs-list">
                {subscriptions.map((sub) => (
                    <article className="sub" key={sub.id}>
                        <span className="sub__code">#{sub.id}</span>

                        <div className="sub__info">
                            <span className="sub__title">{sub.membershipTitle}</span>
                            <span className="sub__meta">
                                {sub.months} мес · {sub.status} · оформлен{' '}
                                {new Date(sub.createdAt).toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>

                        <span className="sub__price">{sub.total.toLocaleString('ru-RU')} ₽</span>

                        <Button variant="danger" size="sm" onClick={() => handleRemove(sub.id)}>
                            Отменить
                        </Button>
                    </article>
                ))}
            </div>
        </div>
    )
}