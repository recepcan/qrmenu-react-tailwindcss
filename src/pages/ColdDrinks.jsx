


import React from 'react';
import Products from '../Components/products';
import { useSelector } from 'react-redux';

function ColdDrinks() {
  const { categoryList } = useSelector((state) => state.product);

  // "Sıcak İçecekler" kategorisini bul
  const ColdDrinks = categoryList?.find(
    (category) => category.category === 'Soğuk İçecekler'
  );

  return (
    <div className='bg-black/40 min-h-screen'>
      {ColdDrinks ? (
        <Products category={ColdDrinks.content} />
      ) : (
        <p>Bu kategori bulunamadı.</p>
      )}
    </div>
  );
}

export default ColdDrinks;