import React, { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useParams, Link, useNavigate } from "react-router-dom"; // useParams import edildi
import { toast } from "react-toastify";
import { Button } from "flowbite-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BsColumnsGap } from "react-icons/bs";
import { toggleProductStyle } from "../store/productSlice";

function UserProducts() {
const dispatch =useDispatch()

  const { username } = useParams(); // URL'den kullanıcı adını al
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab"); // URL'deki ?tab= kısmını alır
  const [userProducts, setUserProducts] = useState([]);
  const {productStyleColumn}=useSelector(state=>state.product)
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
    
    

  <button  className="w-full px-5  flex items-center justify-between ">
  <IoMdArrowRoundBack  onClick={()=>navigate(-1)} className="p-2 w-10 h-10 rounded-lg bg-green-600 text-white"/>
  <h1 className="text-2xl  bg-gray-200 dark:bg-gray-800 rounded-lg p-2 shadow-md uppercase font-mono"> {tab}</h1>
  <button onClick={()=>dispatch(toggleProductStyle())}
  className="w-10 h-10 border  rounded-lg p-2 border-gray-500  ">
  {
productStyleColumn?
<svg height="1em" viewBox="0 0 512 512" width="1em" fill="currentColor" font-size="20" class="mr-3 c-accent-dark"><path d="M72 0C32.299 0 0 32.299 0 72s32.299 72 72 72 72-32.299 72-72S111.701 0 72 0zm0 112c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40zM72 184c-39.701 0-72 32.299-72 72s32.299 72 72 72 72-32.299 72-72-32.299-72-72-72zm0 112c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40zM72 368c-39.701 0-72 32.299-72 72s32.299 72 72 72 72-32.299 72-72-32.299-72-72-72zm0 112c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40zM248 144h192c39.701 0 72-32.299 72-72S479.701 0 440 0H248c-39.701 0-72 32.299-72 72s32.299 72 72 72zm0-112h192c22.056 0 40 17.944 40 40s-17.944 40-40 40H248c-22.056 0-40-17.944-40-40s17.944-40 40-40zM440 184H248c-39.701 0-72 32.299-72 72s32.299 72 72 72h192c39.701 0 72-32.299 72-72s-32.299-72-72-72zm0 112H248c-22.056 0-40-17.944-40-40s17.944-40 40-40h192c22.056 0 40 17.944 40 40s-17.944 40-40 40zM440 368H248c-39.701 0-72 32.299-72 72s32.299 72 72 72h192c39.701 0 72-32.299 72-72s-32.299-72-72-72zm0 112H248c-22.056 0-40-17.944-40-40s17.944-40 40-40h192c22.056 0 40 17.944 40 40s-17.944 40-40 40z"></path></svg>
  : 
  <svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" font-size="20" class="opacity-06"><path d="M176.792 0H59.208C26.561 0 0 26.561 0 59.208v117.584C0 209.439 26.561 236 59.208 236h117.584C209.439 236 236 209.439 236 176.792V59.208C236 26.561 209.439 0 176.792 0zM196 176.792c0 10.591-8.617 19.208-19.208 19.208H59.208C48.617 196 40 187.383 40 176.792V59.208C40 48.617 48.617 40 59.208 40h117.584C187.383 40 196 48.617 196 59.208v117.584zM452 0H336c-33.084 0-60 26.916-60 60v116c0 33.084 26.916 60 60 60h116c33.084 0 60-26.916 60-60V60c0-33.084-26.916-60-60-60zm20 176c0 11.028-8.972 20-20 20H336c-11.028 0-20-8.972-20-20V60c0-11.028 8.972-20 20-20h116c11.028 0 20 8.972 20 20v116zM176.792 276H59.208C26.561 276 0 302.561 0 335.208v117.584C0 485.439 26.561 512 59.208 512h117.584C209.439 512 236 485.439 236 452.792V335.208C236 302.561 209.439 276 176.792 276zM196 452.792c0 10.591-8.617 19.208-19.208 19.208H59.208C48.617 472 40 463.383 40 452.792V335.208C40 324.617 48.617 316 59.208 316h117.584c10.591 0 19.208 8.617 19.208 19.208v117.584zM452 276H336c-33.084 0-60 26.916-60 60v116c0 33.084 26.916 60 60 60h116c33.084 0 60-26.916 60-60V336c0-33.084-26.916-60-60-60zm20 176c0 11.028-8.972 20-20 20H336c-11.028 0-20-8.972-20-20V336c0-11.028 8.972-20 20-20h116c11.028 0 20 8.972 20 20v116z"></path></svg>

  }
  </button>

  </button>
    
      
      <ul className={` max-md:w-full grid  justify-items-center gap-5  
      ${productStyleColumn ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-md:w-[75%]' :'lg:w-[80%] md:grid-cols-2'} `}>
        {userProducts?.map((product,index) => (
         <li
                     key={index}
                     className={`p-2 dark:shadow-none shadow-md shadow-gray-400  transition-all duration-300 
                       flex ${productStyleColumn ? 'flex-col max-h-72 max-w-72 sm:max-w-60 items-center justify-center' : 'min-h-32 max-h-52 w-full space-x-3'} items-center justify-between rounded-lg
                       ${
                       product.stock > 0 ? 'bg-gray-200/85 dark:bg-gray-700' : 'bg-red-300 dark:bg-red-800'
                     }`}
                   >


                   <div className= {`  ${productStyleColumn ? ' w-72 h-32   flex flex-row items-center justify-center' : 'xs:w-1/3 w-1/2 max-h-36 overflow-hidden  flex flex-col items-center justify-center   rounded-lg'}`}>
                   <img 
                   src={product.image} 
                    alt="" 
                   className={`object-cover object-center border border-gray-800   h-24 ${productStyleColumn ? ' w-28   rounded-l-2xl  h-28' : 'w-32 max-h-36 rounded-t-lg'}`}/>
                   
                       <h2 
                       className={`p-2  bg-gray-800 border border-gray-800 text-green-500  font-bold text-xl  font-serif  flex items-center justify-center
                        ${productStyleColumn ? 'h-28 rounded-r-2xl ' : 'w-32 max-h-36 rounded-b-lg'}`}>{product.price}tl</h2>
                       
                     
                   </div>


                     <div className={`  p-2 rounded-lg  h-36 ${productStyleColumn ? 'flex flex-col items-center  w-full  ' : 'xs:w-2/3  w-1/2 '}
                     text-justify overflow-y-scroll scrollbar-hide`}>
                       <h3 
                       className="text-xl font-semibold">{product.title}</h3>
                       <p 
                       className="text-sm"
                       dangerouslySetInnerHTML={{ __html: product?.content }} />

                       {
                       product.stock <= 0 &&
                       <h4>Bu ürün geçici olarak hizmette değil!</h4>
                      }
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