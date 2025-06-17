import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import cartReducer from './features/cart/cartSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage for web

const rootReducer = combineReducers({
    cart: cartReducer,
    user: userReducer,
    // Add other reducers here, e.g. menu, order if you have them
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'user'], // Optional: specify slices to persist
    // blacklist: []        // Optional: slices to exclude
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
})

export const persistor = persistStore(store)
export default store
