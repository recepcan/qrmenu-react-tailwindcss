import productReducer from './productSlice';
import intheBoxReducer from './intheBoxSlice'
import userReducer from './userSlice'
import headerReducer from './headerSlice'
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// user slice'ı ayrı persist config ile sarıyoruz.
// blacklist burada slice içindeki field isimlerini tanır.
const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['loading', 'error'], // bu ikisi diske yazılmaz, her açılışta false/null başlar
};

const rootReducer = combineReducers({
  product: productReducer,
  intheBox: intheBoxReducer,
  user: persistReducer(userPersistConfig, userReducer), // ← sadece user sarıldı
  header: headerReducer
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);