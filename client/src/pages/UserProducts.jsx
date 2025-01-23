import React, { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import { useSearchParams, useParams } from "react-router-dom"; // useParams import edildi
import { toast } from "react-toastify";

function UserProducts() {
  const { username } = useParams(); // URL'den kullanıcı adını al
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab"); // URL'deki ?tab= kısmını alır
const {currentUser}=useSelector(state=>state.user)
  const [userProducts, setUserProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/server/product/getproducts?userId=${currentUser._id}&category=${tab}`);
        const data = await res.json();
      
        setUserProducts(data.products)
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchProducts();
    }
  }, [currentUser._id]);

  return (
    <div className="bg-black/70 w-full h-screen  flex flex-col items-center space-y-5">
    <h2 className="text-xl text-white font-mono"> @{currentUser.username}</h2>
    <h1 className="text-3xl text-white font-mono"> {tab}</h1>
      
      <ul className="md:w-[60%] max-md:w-full flex flex-col space-y-3">
        {userProducts?.map((product,index) => (
         <li
                     key={index}
                     className={`p-2 max-md:w-full  flex items-center justify-between space-x-3 border rounded shadow-sm ${
                       product.stock > 0 ? 'bg-gray-200/85' : 'bg-red-300'
                     }`}
                   >
                   <div className='w-28 h-28  rounded-lg'>
                   <img src={`http://localhost:5000${product.image}`} alt="" className='object-cover rounded-lg w-28 h-28'/>
                   </div>
                     <div>
                       <h3 className="text-xl font-semibold">{product.title}</h3>
                       <div dangerouslySetInnerHTML={{ __html: product?.content }} />
                       <h4>{product.stock <= 0 && 'Bu ürün geçici olarak hizmette değil!'}</h4>
                     </div>
                     <div className="flex flex-col space-y-2 items-center justify-center ">
                       <h2 className="p-3 bg-gray-800 text-green-600 rounded-lg font-bold text-xl  font-serif">{product.price}tl</h2>
                       <button
                         disabled={product.stock <= 0 && true}
                         
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

export default UserProducts;
