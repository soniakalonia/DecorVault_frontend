import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import cartSlice from './slices/cart'
import authSlice from './slices/auth'
import wishlistSlice from './slices/wishlist'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'auth', 'wishlist'],
}

const rootReducer = combineReducers({
  cart: cartSlice,
  auth: authSlice,
  wishlist: wishlistSlice,
})

export const persistedReducer = persistReducer(persistConfig, rootReducer)
export const persistor = persistStore