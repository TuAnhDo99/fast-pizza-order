import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getTotalCartQuantity, getTotalCartPrice } from './cartSlice'
import { formatCurrency } from '../../utils/helpers'

function CartOverview() {
    const totalCartQuatity = useSelector(getTotalCartQuantity)
    const totalCartPrice = useSelector(getTotalCartPrice)

    if (!totalCartQuatity) return null
    return (
        <div className="flex items-center justify-between bg-stone-800 px-4 py-4 text-sm uppercase text-stone-200 sm:px-6 md:text-base">
            <p className="space-x-4 font-semibold uppercase text-stone-300 sm:space-x-6">
                <span>{totalCartQuatity} pizzas</span>
                <span>${formatCurrency(totalCartPrice)}</span>
            </p>
            <Link to="/cart">Open cart &rarr;</Link>
        </div>
    )
}

export default CartOverview
