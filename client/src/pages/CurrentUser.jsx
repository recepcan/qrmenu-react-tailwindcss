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
console.log(userdata.username)
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
          console.log(username)
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
   
    className=' w-full min-h-screen   flex flex-col object-cover 
    items-center  justify-center sm:space-y-20'>
    

    <div className='overflow-auto  w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center lg:w-[1024px]  gap-5 p-5'>
    {
        userCategory.map((ctg,index)=>(
            <Link to={`products?tab=${ctg.name}`} key={index*2} className='w-full min-h-48'> 
            

            <div 
                        key={index}
                        className='w-full h-full  bg-cover bg-center 
                        bg-no-repeat rounded-lg border-2 flex items-center justify-center text-center'
                        style={{
                          backgroundImage: `url(${`http://localhost:5000${ctg.image}`})`,
                          objectPosition:'cover'
                        }}
                        >
                        <Link to={`products?tab=${ctg.name}`} key={index}
                         className=
             'p-3 bg-black/40  w-full  h-full shadow-lg shadow-black rounded-lg text-white font-extrabold text-xl flex items-center justify-center'>
                         
                         {ctg.title}
                         
                         </Link>
                         
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