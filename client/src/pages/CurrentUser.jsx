import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CurrentUser() {

    const { currentUser } = useSelector((state) => state.user);
  const [userCategory, setUserCategory] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState('');
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/server/category/getcategory?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserCategory(data.category);
          if (data.category.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
        fetchCategory();
    }
  }, [currentUser._id]);

  return (
    <div className='bg-black/20 w-full h-screen text-white text-5xl flex flex-col items-center justify-center space-y-20'>
    <h1> {currentUser.username}</h1>

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