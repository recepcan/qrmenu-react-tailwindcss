import React, { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import { useSearchParams, useParams, Link, useNavigate } from "react-router-dom"; // useParams import edildi
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { IoMdArrowRoundBack } from "react-icons/io";

function UserProducts() {
  const { username } = useParams(); // URL'den kullanıcı adını al
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab"); // URL'deki ?tab= kısmını alır
  const [userProducts, setUserProducts] = useState([]);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/server/product/getproducts?username=${username}&category=${tab}`);
        const data = await res.json();
      
        setUserProducts(data.products)
      } catch (error) {
        console.log(error.message);
      }
    };
    
      fetchProducts();

  }, [username]);

  return (
    <div className=" w-full min-h-screen  flex flex-col items-center  space-y-5 py-24  ">
    
    

  <button onClick={()=>navigate(-1)} className="w-full px-5">
  <IoMdArrowRoundBack className="p-2 w-10 h-10 rounded-lg bg-green-600 text-white"/>
  </button>
    <h1 className="text-3xl bg-gray-200 dark:bg-gray-800 rounded-lg p-2 shadow-md uppercase font-mono"> {tab}</h1>
      
      <ul className="md:w-[60%] max-md:w-full flex flex-col space-y-3 p-5">
        {userProducts?.map((product,index) => (
         <li
                     key={index}
                     className={`p-2 dark:shadow-none shadow-md shadow-gray-400 max-md:w-full transition-all duration-300  flex items-center justify-between space-x-3 border rounded ${
                       product.stock > 0 ? 'bg-gray-200/85 dark:bg-gray-700' : 'bg-red-300 dark:bg-red-800'
                     }`}
                   >
                   <div className='w-28 h-28  rounded-lg'>
                   <img 
                   src={product.image} 
                    alt="" 
                   className='object-cover rounded-lg w-28 h-28'/>
                   </div>
                     <div>
                       <h3 
                       className="text-xl font-semibold">{product.title}</h3>
                       <div 
                       dangerouslySetInnerHTML={{ __html: product?.content }} />

                       {
                       product.stock <= 0 &&
                       <h4>Bu ürün geçici olarak hizmette değil!</h4>
                      }
                     </div>
                     <div 
                     className="flex flex-col space-y-2 items-center justify-center ">
                       <h2 
                       className="p-3 bg-gray-800 text-green-600 rounded-lg font-bold text-xl  font-serif">{product.price}tl</h2>
                       
                     </div>
                   </li>
          
        ))}
      </ul>
    </div>
  );
}

export default UserProducts;


{/*
  <button
                         disabled={product.stock <= 0 && true}
                         className="text-white bg-sky-600 rounded-lg p-3 w-full flex items-center 
                         justify-center text-center text-xl"
                       >
                         <MdAddShoppingCart />
                       </button>
  */}