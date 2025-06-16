// Test ID: IIDSAT

import { useFetcher, useLoaderData } from 'react-router-dom'
import { getOrder } from '../../services/apiRestaurant'
import {
    calcMinutesLeft,
    formatCurrency,
    formatDate,
} from '../../utils/helpers'
import OrderItem from './OrderItem'
import { useEffect } from 'react'
import UpdateOrder from './UpdateOrder'

function Order() {
    const order = useLoaderData()

    const fetcher = useFetcher()

    useEffect(() => {
        if (!fetcher.data && fetcher.state === 'idle') fetcher.load('/menu')
    }, [fetcher])

    // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
    const {
        id,
        status,
        priority,
        priorityPrice,
        orderPrice,
        estimatedDelivery,
        cart,
    } = order
    const deliveryIn = calcMinutesLeft(estimatedDelivery)

    return (
        <div className="space-y-8 px-4 py-6">
            <div className="gap=2 flex flex-wrap items-center justify-between">
                <h2 className="text-xl font-semibold">Order #{id} status</h2>
                <div className="space-x-2">
                    {priority && (
                        <span className="text-semibold rounded-full bg-red-500 px-3 py-1 text-sm uppercase tracking-wide text-red-50">
                            Priority
                        </span>
                    )}
                    <span className="text-semibold rounded-full bg-green-500 px-3 py-1 text-sm uppercase tracking-wide text-green-50">
                        {status} order
                    </span>
                </div>
            </div>

            <div className="gap=2 flex flex-wrap items-center justify-between bg-stone-200 px-6 py-5">
                <p className="font-medium">
                    {deliveryIn >= 0
                        ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
                        : 'Order should have arrived'}
                </p>
                <p className="text-xs text-stone-500">
                    (Estimated delivery: {formatDate(estimatedDelivery)})
                </p>
            </div>

            <ul className="divide-y divide-stone-200 border-b border-t">
                {cart.map((item) => (
                    <OrderItem
                        key={item.id}
                        item={item}
                        ingredients={
                            fetcher?.data?.find((el) => el.id === item.pizzaId)
                                ?.ingredients
                        }
                        isLoadingIngredients={fetcher.state === 'loading'}
                    />
                ))}
            </ul>

            <div className="space-y-2 bg-stone-200 px-6 py-5">
                <p className="text-sm font-medium text-stone-600">
                    Price pizza: {formatCurrency(orderPrice)}
                </p>
                {priority && (
                    <p className="text-sm font-medium text-stone-600">
                        Price priority: {formatCurrency(priorityPrice)}
                    </p>
                )}
                <p className="font-bold">
                    To pay on delivery:{' '}
                    {formatCurrency(orderPrice + priorityPrice)}
                </p>
            </div>

            {!priority && <UpdateOrder />}
        </div>
    )
}

export async function loader({ params }) {
    const order = await getOrder(params.orderID)
    return order
}

export default Order
