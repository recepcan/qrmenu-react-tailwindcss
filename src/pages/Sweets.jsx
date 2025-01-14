import React from 'react';
import Products from '../Components/products';
import { useSelector } from 'react-redux';

function Sweets() {
  const { categoryList } = useSelector((state) => state.product);

  // "Sıcak İçecekler" kategorisini bul
  const sweets = categoryList?.find(
    (category) => category.category === 'Tatlılar'
  );

  return (
    <div className='bg-black/40 min-h-screen'>
      {sweets?  (
        <Products category={sweets.content} />
      ) : (
        <p>Bu kategori bulunamadı.</p>
      )}
    </div>
  );
}

export default Sweets;