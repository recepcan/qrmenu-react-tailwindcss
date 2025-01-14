import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement } from '../store/intheBoxSlice'; // import işlemi

function IntheBox() {
  const { boxList } = useSelector((state) => state.intheBox);
  const dispatch = useDispatch();

  const totalPrice = boxList.reduce((acc, item) => acc + item.total, 0); // Toplam hesaplama

  return (
    <div className="min-h-screen pt-24 bg-black/40 ">
      <div className="w-full p-3 bg-gray-400 grid grid-cols-4 gap-2 text-center">

        <h2 className="p-2 bg-gray-100 rounded-lg">Ürün Adı</h2>
        <h3 className="p-2 bg-gray-100 rounded-lg">Adedi</h3>
        <h3 className="p-2 bg-gray-100 rounded-lg">Fiyatı</h3>
        <h3 className="p-2 bg-gray-100 rounded-lg">Toplam</h3>
        
      </div>
      {boxList.map((item, index) => (
        <div
          key={index}
          className={` ${item.number<=0&& 'hidden'} " odd:bg-white text-center even:bg-gray-100 p-3 grid grid-cols-4 gap-2"`}
        >
          <h2>{item.name}</h2>
          <h3>{item.number}</h3>
          <h3>{item.price} TL</h3>
          <h3>{item.total} TL</h3>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={() => dispatch(decrement({ name: item.name }))} // Sepetten çıkar
          >
            Çıkar
          </button>
        </div>
      ))}
      <div className="text-right p-4 bg-gray-500 text-white">
        <h2 className="text-xl font-bold">Toplam Ücret: {totalPrice} TL</h2>
      </div>
    </div>
  );
}

export default IntheBox;
