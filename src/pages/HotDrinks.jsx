import React from 'react';
import Products from '../Components/products';
import { useSelector } from 'react-redux';

function HotDrinks() {
  const { categoryList } = useSelector((state) => state.product);

  // "Sıcak İçecekler" kategorisini bul
  const hotDrinks = categoryList?.find(
    (category) => category.category === 'Sıcak İçecekler'
  );

  return (
    <div className='bg-black/40 min-h-screen'>
      {hotDrinks ? (
        <Products category={hotDrinks.content} />
      ) : (
        <p>Bu kategori bulunamadı.</p>
      )}
    </div>
  );
}

export default HotDrinks;
