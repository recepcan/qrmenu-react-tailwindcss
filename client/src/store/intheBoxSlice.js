import { createSlice } from '@reduxjs/toolkit';


const intheBoxSlice = createSlice({
  name: 'intheBox',
  initialState: {
    boxList: [],
  },
  reducers: {
    increment: (state, action) => {
      const item = state.boxList.find((box) => box.name === action.payload.name);
      
      const price = Number(action.payload.price) || 0;  // Price'ı sayıya çevir ve NaN ise 0 kullan
      const number = 1;  // Yeni ürün eklendiği için başlangıçta 1

      if (item) {
        // Ürün zaten sepetteyse, sayıyı artır ve toplamı güncelle
        item.number += 1;
        item.total = item.number * price;
      } else {
        // Ürün sepette yoksa, yeni bir ürün ekle
        state.boxList.push({
          name: action.payload.name,
          price: price,
          number: number,
          total: price * number,  // İlk toplam fiyat, adet * fiyat
        });
      }
    },
    decrement: (state, action) => {
      const item = state.boxList.find((box) => box.name === action.payload.name);

      if (item) {
        if (item.number > 1) {
          // Ürün varsa ve 1'den fazla ise, sayıyı azalt ve toplamı güncelle
          item.number -= 1;
          item.total = item.number * item.price;
        } else {
          // Eğer ürünün sayısı 1 ise, ürünü listeden kaldır
          state.boxList = state.boxList.filter((box) => box.name !== action.payload.name);
        }
      }
    },
  },
});

export const { increment, decrement } = intheBoxSlice.actions;
export default intheBoxSlice.reducer;

