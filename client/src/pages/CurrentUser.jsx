import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function CurrentUser() {

    const { currentUser } = useSelector((state) => state.user);
  const [userCategory, setUserCategory] = useState([]);
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
    <div className='bg-black/20 w-full h-screen text-white text-5xl flex flex-col items-center justify-center space-y-20'>
    <h1> {username}</h1>

    <div className='overflow-auto w-full flex flex-wrap items-center justify-center gap-5'>
    {
        userCategory.map((ctg,index)=>(
            <Link to={`products?tab=${ctg.name}`} key={index}> 
            

            <div 
                        key={index}
                        className='sm:w-52  sm:h-52 w-40 h-40 bg-cover bg-center 
                        bg-no-repeat rounded-lg border-2 flex items-center justify-center text-center'
                        style={{
                          backgroundImage: `url(${`http://localhost:5000${ctg.image}`})`,
                          objectPosition:'cover'
                        }}
                        >
                        <Link to={`products?tab=${ctg.name}`} key={index}
                         className=
             'p-3 bg-black/40 sm:w-52 sm:h-52 w-40 h-40 shadow-lg shadow-black rounded-lg text-white font-extrabold text-xl flex items-center justify-center'>
                         
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