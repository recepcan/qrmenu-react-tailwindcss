import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../Components/Header';
import { Button } from "flowbite-react";
function CurrentUser() {

    const { currentUser } = useSelector((state) => state.user);
  const [userCategory, setUserCategory] = useState([]);
  const [userhome, setUserHome] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState('');
  const { username } = useParams();

  const navigate=useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/server/user/username/${username}`);
        if (!response.ok) {
          
          navigate('*')  // Eğer kullanıcı bulunamazsa, 404 sayfasına yönlendir
        }
        const data = await response.json();
        setUserData(data); // Kullanıcıyı bulduğunda verileri state'e set et
      } catch (error) {
        toast.error(error);
       
      }
    };

    fetchUser();
  }, [username]);



  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/server/category/getcategory?username=${username}`);
        const data = await res.json();
        if (res.ok) {
         
          setUserCategory(data.category);
          if (data.category.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
   
        fetchCategory();
   
  }, [username]);

 

  return (
    <div 
   
    className=' w-full min-h-screen   flex flex-col object-cover py-20 sm:py-32
    items-center   space-y-5'>
    
<h1 className='p-3 rounded-xl bg-sky-900 text-white text-2xl'>{username}</h1>

    <div className='overflow-auto  w-full grid grid-cols-1 max-[429px]:px-14 min-[429px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center lg:w-[1024px]  gap-5 p-5'>
    {
        userCategory.map((ctg,index)=>(
            <Link to={`products?tab=${ctg.name}`}
             key={index*2} 
            className='w-full min-h-48 rounded-lg dark:shadow-none shadow-md shadow-gray-400 bg-gray-200 dark:bg-black/70 transition-all duration-300'> 
            

            <div 
                        key={index}
                        className='w-full h-full  bg-cover bg-center p-3 space-y-5
                        bg-no-repeat rounded-lg border-2 flex flex-col items-center justify-center text-center'
                        
                        >
                        <img src={ctg.image}
                        className='w-36 h-36 rounded-[50%] object-cover'
                        alt="" />
                        <h1 key={index}
                         className=
                        'p-2  w-full bg-sky-900    rounded-lg text-white font-extrabold text-xl flex items-center justify-center'>
                         
                         {ctg.title}
                         
                         </h1>
                         
                        </div>
            
            
            </Link>
        ))

    }</div>
    </div>
  )
}

export default CurrentUser

{
  /*
   useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch(`/server/home/gethome?username=${username}`);
        const data = await res.json();
        if (res.ok) {
          console.log(username)
          setUserHome(data.home);
          if (data.home.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
   
        fetchHome();
   
  }, [username]);
  
   style={{
      backgroundImage: `url(http://localhost:5000${userhome[0]?.image})`,
      backgroundSize: "cover", // objectCover yerine doğru kullanım
      backgroundRepeat: "no-repeat", // Resmin tekrarlanmamasını sağlamak için
      backgroundPosition: "center", // Ortaya hizalamak için
    }}
  
  */
}