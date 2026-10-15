import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/api'

function mapOrder(order) {
    return {
        id: order.id,
        membershipTitle: order.title,
        months: order.months,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
    }
}

export default function useSubscriptions() {
    const { user } = useAuth()
    const [subscriptions, setSubscriptions] = useState([])

    const load = useCallback(async () => {
        if (!user) {
            setSubscriptions([])
            return
        }
        try {
            const data = await api.getMyOrders(user.id)
            setSubscriptions(data.map(mapOrder))
        } catch {
            setSubscriptions([])
        }
    }, [user])

    useEffect(() => {
        load()
    }, [load])

    const addSubscription = useCallback(
        async (membership, months) => {
            if (!user) return null

            const order = await api.createOrder({
                userId: user.id,
                title: membership.title,
                months,
                total: membership.price * months,
            })

            await load()
            return order
        },
        [user, load]
    )

    const removeSubscription = useCallback(
        async (id) => {
            if (!user) return
            await api.deleteOrder(id, user.id)
            await load()
        },
        [user, load]
    )

    return { subscriptions, addSubscription, removeSubscription }
}