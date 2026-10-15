import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import memberships from '../data/memberships'
import MembershipCard from '../components/MembershipCard'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import useSubscriptions from '../hooks/useSubscriptions'

const categories = [
    { id: 'all', label: 'Все' },
    { id: 'gym', label: 'Зал' },
    { id: 'group', label: 'Групповые' },
    { id: 'pool', label: 'Бассейн' },
    { id: 'personal', label: 'Персональные' },
    { id: 'online', label: 'Онлайн' },
]

const durations = [1, 3, 6, 12]

export default function Catalog() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [isLoading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [months, setMonths] = useState(1)
    const [toast, setToast] = useState('')

    const { user } = useAuth()
    const { addSubscription } = useSubscriptions()
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!toast) return undefined
        const timer = setTimeout(() => setToast(''), 3200)
        return () => clearTimeout(timer)
    }, [toast])

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()

        return memberships.filter((item) => {
            const matchCategory = category === 'all' || item.category === category
            const matchQuery =
                !query ||
                item.title.toLowerCase().includes(query) ||
                item.subtitle.toLowerCase().includes(query)

            return matchCategory && matchQuery
        })
    }, [search, category])

    function handleSubscribeClick(membership) {
        if (!user) {
            navigate('/login', { state: { from: '/catalog' } })
            return
        }
        setMonths(1)
        setSelected(membership)
    }

    async function confirm() {
        if (!selected) return
        try {
            await addSubscription(selected, months)
            setToast(`Абонемент «${selected.title}» оформлен на ${months} мес.`)
            setSelected(null)
        } catch (err) {
            setToast(err.message)
        }
    }

    return (
        <section className="section page">
            <div className="container">
                <header className="section__head">
                    <div>
                        <span className="section__eyebrow">Каталог</span>
                        <h1 className="section__title">Абонементы</h1>
                    </div>
                    <p className="section__subtitle">
                        Оформи онлайн — активируем на первом визите
                    </p>
                </header>

                <div className="toolbar">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Поиск: название или тип"
                    />

                    <div className="filters">
                        {categories.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={category === item.id ? 'chip chip--active' : 'chip'}
                                onClick={() => setCategory(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <Loader text="Загружаем тарифы" />
                ) : (
                    <>
                        <p className="results-count">
                            Найдено <strong>{filtered.length}</strong> из {memberships.length}
                        </p>

                        {filtered.length === 0 ? (
                            <div className="empty">
                                <h3 className="empty__title">Ничего не найдено</h3>
                                <p className="empty__text">
                                    Попробуй изменить запрос или выбрать другую категорию.
                                </p>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSearch('')
                                        setCategory('all')
                                    }}
                                >
                                    Сбросить фильтры
                                </Button>
                            </div>
                        ) : (
                            <div className="grid" key={category}>
                                {filtered.map((membership, index) => (
                                    <MembershipCard
                                        key={membership.id}
                                        membership={membership}
                                        onSubscribe={handleSubscribeClick}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                <Modal
                    isOpen={Boolean(selected)}
                    title="Оформление абонемента"
                    onClose={() => setSelected(null)}
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setSelected(null)}>
                                Отмена
                            </Button>
                            <Button variant="accent" onClick={confirm}>
                                Подтвердить
                            </Button>
                        </>
                    }
                >
                    {selected && (
                        <div className="booking-form">
                            <p className="booking-form__zone">
                                <strong>{selected.title}</strong> · {selected.subtitle}
                            </p>

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

                            <div className="booking-form__total">
                                <span>Итого</span>
                                <strong>{(selected.price * months).toLocaleString('ru-RU')} ₽</strong>
                            </div>
                        </div>
                    )}
                </Modal>

                {toast && <div className="toast">{toast}</div>}
            </div>
        </section>
    )
}