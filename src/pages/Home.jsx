import React from 'react';
import anaekranfoto from '../assets/anaekran-foto.jpg';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Home() {
    const {categoryList} =useSelector(state=>state.product)

  return (
    <div
      className="h-screen py-10  bg-cover bg-center bg-no-repeat flex items-center justify-center "
      style={{
        backgroundImage: `url(${anaekranfoto})`,
      }}
    >
      
    <div className='overflow-auto      w-full flex flex-wrap items-center justify-center gap-5 '>
    {
        categoryList.map((item,index)=>(
            <div className='sm:w-52  sm:h-52 w-40 h-40 bg-cover bg-center 
            bg-no-repeat rounded-lg border-2 flex items-center justify-center text-center'
            style={{
              backgroundImage: `url(${item.image})`,
              objectPosition:'cover'
            }}
            >
            <Link to={item.to} key={index}
             className=
 'p-3 bg-black/40 sm:w-52 sm:h-52 w-40 h-40 shadow-lg shadow-black rounded-lg text-white font-extrabold text-xl flex items-center justify-center'>
             
             {item.category}
             
             </Link>
             
            </div>
        ))
    }
     

    </div>

    </div>
  );
}

export default Home;
