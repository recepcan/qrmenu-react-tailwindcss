import React from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { increment } from '../store/intheBoxSlice'; // import işlemi
import { toast } from 'react-toastify';

function Products({ category }) {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    
    dispatch(increment({
      name: product.name,
      price: product.price, 
      stock: product.stock, 
    }));
    toast.success(`${product.name} sepete eklendi`)
    console.log(product.name); 
  };

  return (
    <div className="py-28 sm:px-10 px-5 flex items-center justify-center flex-col w-full">
      <h2 className="font-bold mb-4 p-3 rounded-lg bg-black/50 text-white text-3xl">Ürünler</h2>
      <ul className="space-y-2 w-full max-md:w-full md:w-[80%]">
        {category.map((item, index) => (
          <li
            key={index}
            className={`p-2 max-md:w-full  flex items-center justify-between space-x-3 border rounded shadow-sm ${
              item.stock > 0 ? 'bg-gray-200/85' : 'bg-red-300'
            }`}
          >
          <div className='w-28 h-28  rounded-lg'>
          <img src={item.img} alt="" className='object-cover rounded-lg w-28 h-28'/>
          </div>
            <div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <h4>{item.stock <= 0 && 'Bu ürün geçici olarak hizmette değil!'}</h4>
            </div>
            <div className="flex flex-col space-y-2 items-center justify-center ">
              <h2 className="p-3 bg-gray-800 text-green-600 rounded-lg font-bold text-xl  font-serif">{item.price}tl</h2>
              <button
                disabled={item.stock <= 0 && true}
                onClick={() => handleAddToCart(item)} 
                className="text-white bg-sky-600 rounded-lg p-3 w-full flex items-center justify-center text-center text-xl"
              >
                <MdAddShoppingCart />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
