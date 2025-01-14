import React from 'react';
import Products from '../Components/products';
import { useSelector } from 'react-redux';

function Cookie() {
  const { categoryList } = useSelector((state) => state.product);

  // "Sıcak İçecekler" kategorisini bul
  const cookie = categoryList?.find(
    (category) => category.category === 'Atıştırmalıklar'
  );

  return (
    <div className='bg-black/40 min-h-screen'>
      {cookie ? (
        <Products category={cookie.content} />
      ) : (
        <p>Bu kategori bulunamadı.</p>
      )}
    </div>
  );
}

export default Cookie;