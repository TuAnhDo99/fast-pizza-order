import { createSlice } from '@reduxjs/toolkit'

const initialSate = {
    cart: [
        // {
        //     pizzaId: 12,
        //     name: 'pizzahut',
        //     quantity: 2,
        //     unitPrice: 16,
        //     totalPrice: 32,
        // },
    ],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialSate,
    reducers: {
        addCartItem: (state, action) => {
            // payload = new item
            state.cart.push(action.payload)
        },
        deleteCartItem: (state, action) => {
            // payload = delete item pizzaId
            state.cart = state.cart.filter(
                (itemObj) => itemObj.pizzaId !== action.payload
            )
        },
        increaseItemQuantity: (state, action) => {
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload
            )

            item.quantity++
            item.totalPrice = item.quantity * item.unitPrice
        },
        decreaseItemQuantity: (state, action) => {
            const item = state.cart.find(
                (item) => item.pizzaId === action.payload
            )

            item.quantity--
            item.totalPrice = item.quantity * item.unitPrice

            if (item.quantity === 0)
                cartSlice.caseReducers.deleteCartItem(state, action)
        },
        clearCart: (state) => {
            state.cart = []
        },
    },
})

export const {
    addCartItem,
    deleteCartItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
} = cartSlice.actions

export default cartSlice.reducer

export const getCart = (state) => state.cart.cart

export const getTotalCartQuantity = (state) =>
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)

export const getTotalCartPrice = (state) =>
    state.cart.cart.reduce((sum, item) => sum + Number(item.totalPrice), 0)

export function getCurrentQuantityById(id) {
    return function (state) {
        const foundItem = state.cart.cart.find((item) => item.pizzaId === id)
        return foundItem ? foundItem.quantity : 0
    }
}
