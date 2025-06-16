import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import { createOrder } from '../../services/apiRestaurant'
import Button from '../../ui/Button'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice'
import EmptyCart from '../cart/EmptyCart'

import store from '../../store'
import { formatCurrency } from '../../utils/helpers'
import { useState } from 'react'
import { fetchAddress } from '../user/userSlice'

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        str
    )

const fakeCart = [
    {
        pizzaId: 12,
        name: 'Mediterranean',
        quantity: 2,
        unitPrice: 16,
        totalPrice: 32,
    },
    {
        pizzaId: 6,
        name: 'Vegetale',
        quantity: 1,
        unitPrice: 13,
        totalPrice: 13,
    },
    {
        pizzaId: 11,
        name: 'Spinach and Mushroom',
        quantity: 1,
        unitPrice: 15,
        totalPrice: 15,
    },
]

function CreateOrder() {
    const [withPriority, setWithPriority] = useState(false)
    const cart = useSelector(getCart)
    const navigation = useNavigation()
    const isSubmitting = navigation.state === 'submitting'
    const {
        username,
        status: addressStatus,
        position,
        address,
        error: errorAddress,
    } = useSelector((state) => state.user)
    const formError = useActionData()
    const totalCartPrice = useSelector(getTotalCartPrice)
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
    const totalPrice = totalCartPrice + priorityPrice
    const dispatch = useDispatch()

    const isLoadingAddress = addressStatus === 'loading'

    console.log(position)
    if (!cart.length) return <EmptyCart />
    return (
        <div className="px-4 py-6">
            <h2 className="mb-8 text-xl font-semibold">
                Ready to order? Lets go!
            </h2>

            <Form method="POST" action="/order/new">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <input
                        type="text"
                        name="customer"
                        defaultValue={username}
                        required
                        className="input grow"
                    />
                </div>

                <div
                    className={`mb-5 flex flex-col gap-2 sm:flex-row sm:${formError?.phone ? 'items-start' : 'items-center'}`}
                >
                    <label
                        className={`sm:basis-40 ${formError?.phone ? 'sm:mt-2' : ''}`}
                    >
                        Phone number
                    </label>
                    <div className="grow">
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="input w-full"
                        />
                        {formError?.phone && (
                            <p className="mt-2 rounded-full bg-red-100 px-3 py-2 text-xs text-red-700">
                                {formError.phone}
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className={`relative mb-5 flex flex-col gap-2 sm:flex-row sm:${addressStatus === 'error' ? 'items-start' : 'items-center'}`}
                >
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input
                            type="text"
                            name="address"
                            disabled={isLoadingAddress}
                            defaultValue={address}
                            required
                            className="input w-full"
                        />

                        {addressStatus === 'error' && (
                            <p className="mt-2 rounded-full bg-red-100 px-3 py-2 text-xs text-red-700">
                                {errorAddress}
                            </p>
                        )}
                    </div>

                    <span className="absolute right-[3px] top-[35px] z-50 sm:top-[3px] md:top-[5px]">
                        {!position.latitude && !position.longitude && (
                            <Button
                                type="small"
                                onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(fetchAddress())
                                }}
                                disabled={isLoadingAddress}
                            >
                                Get position
                            </Button>
                        )}
                    </span>
                </div>

                <div className="mb-12 flex items-center gap-5">
                    <input
                        type="checkbox"
                        name="priority"
                        id="priority"
                        value={withPriority ? 'on' : 'off'}
                        onChange={(e) => setWithPriority(e.target.checked)}
                        className="fo h-6 w-6 accent-yellow-400 outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                    />
                    <label htmlFor="priority" className="font-medium">
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    {/* hidden input to submit cart data to API */}

                    <input
                        type="hidden"
                        name="cart"
                        value={JSON.stringify(cart)}
                    />

                    <input
                        type="hidden"
                        name="position"
                        value={
                            position.latitude && position.longitude
                                ? `${position.latitude}, ${position.longitude}`
                                : ''
                        }
                    />
                    <Button
                        type="primary"
                        disabled={isSubmitting || isLoadingAddress}
                    >
                        {isSubmitting
                            ? 'Placing order...'
                            : `Order now for ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export async function action({ request }) {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    const order = {
        ...data,
        cart: JSON.parse(data.cart),
        priority: data.priority === 'on',
    }

    console.log(order)

    const errors = {}
    if (!isValidPhone(order.phone))
        errors.phone =
            'please give us your correct phone number. we might need it to contact you'

    if (Object.keys(errors).length > 0) return errors

    // if form is validated then creat new order and redirect

    const newOrder = await createOrder(order)

    // do not overuse
    store.dispatch(clearCart())

    return redirect(`/order/${newOrder.id}`)
}
export default CreateOrder
