import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import intheBoxReducer from './intheBoxSlice'
const store = configureStore({
  reducer: {
    product: productReducer,
    intheBox: intheBoxReducer
  },
});

export default store;
