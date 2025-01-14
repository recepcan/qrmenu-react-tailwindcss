import { createSlice } from '@reduxjs/toolkit';
import cay from '/cay.jpg'
import baklava from '/baklava.jpg'
import cheesecake from '/cheesecake.jpg'
import cikolatalıpasta from '/cikolatalıpasta.jpg'
import cips from '/cips.jpg'
import fıstık from '/fıstık.jpg'
import kurumeyve from '/kurumeyve.jpg'
import limonata from '/limonata.jpg'
import meyvesuyu from '/meyve suyu.jpg'
import milkshake from '/milkshake.jpg'
import salep from '/salep.jpg'
import turkkahvesi from '/turk-kahvesi.jpg'
import tatlı from '/tatlı.jpg'
import sogukicecek from '/sogukicecek.jpg'
import sicakicecek from '/sicakicecek.jpg'
import atistirmalik from '/atistirmalik.jpg'

const productSlice = createSlice({
  name: 'product',
  initialState: {
    categoryList: [
      { 
        category: 'Sıcak İçecekler', 
        to: 'sicak-icecekler', 
        image:sicakicecek
        ,
        content: [
          { name: 'Türk Kahvesi', description: 'Geleneksel Türk içeceği.', price: 40, stock: 1 ,img:turkkahvesi },
          { name: 'Çay', description: 'Taze demlenmiş çay.', price: 10, stock: 5 ,img:cay },
          { name: 'Salep', description: 'Kış aylarının vazgeçilmezi.', price: 30, stock: 5 ,img:salep},
        ]
      },
      { 
        category: 'Soğuk İçecekler', 
        to: 'soguk-icecekler',  
        image:sogukicecek
        ,
        content: [
          { name: 'Limonata', description: 'Serinletici bir yaz içeceği.', price: 20, stock: 5,img:limonata },
          { name: 'Meyve Suyu', description: 'Doğal meyvelerden hazırlanmış.', price: 30, stock: 5 ,img:meyvesuyu},
          { name: 'Milkshake', description: 'Tatlı ve serinletici bir içecek.', price: 40, stock: 0 ,img:milkshake},
        ]
      },
      { 
        category: 'Tatlılar', 
        to: 'tatlilar', 
        image:tatlı
        ,
        content: [
          { name: 'Çikolatalı Pasta', description: 'Lezzetli bir çikolatalı pasta.', price: 120, stock: 5 ,img:cikolatalıpasta},
          { name: 'Cheesecake', description: 'Kremalı bir cheesecake.', price: 70, stock: 5 ,img:cheesecake},
          { name: 'Baklava', description: 'Geleneksel Türk tatlısı.', price: 80, stock: 5 ,img:baklava},
        ]
      },
      { 
        category: 'Atıştırmalıklar', 
        to: 'atistirmaliklar', 
        image:atistirmalik
        ,
        content: [
          { name: 'Cips', description: 'Kıtır kıtır lezzet.', price: 50, stock: 5 ,img:cips},
          { name: 'Kurutulmuş Meyve', description: 'Sağlıklı bir atıştırmalık.', price: 40, stock: 0 ,img:kurumeyve},
          { name: 'Fıstık', description: 'Enerji dolu bir seçim.', price: 50, stock: 5 ,img:fıstık},
        ]
      }
    ]
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = productSlice.actions;
export default productSlice.reducer;
