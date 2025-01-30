import { Button } from 'flowbite-react'
import React from 'react'
import { MdAddShoppingCart } from 'react-icons/md'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { toggleMenu, toggleTheme } from '../store/headerSlice'
import {useSelector,useDispatch} from 'react-redux'
import { FaMoon } from 'react-icons/fa'
import { IoMdSunny } from "react-icons/io";
import MobilMenu from './MobilMenu'
import { TiThMenu } from "react-icons/ti";

function Header() {
  const {theme}=useSelector(state=>state.header)
  const {mobilMenu}=useSelector(state=>state.header)
  
  const dispatch=useDispatch()
  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const dynamicUsername =  pathParts[1]; // Eğer params boşsa, URL'den al
  
  return (
    <div className='w-full  flex items-center justify-center space-x-5 text-xl
     transition-all duration-300 border-b border-gray-500 bg-gray-200  dark:bg-black 
     font-extrabold tracking-wider p-3 h-16 sm:h-20  absolute top-0 left-0  z-40'>
  <div className=' w-full flex items-center  '>
  <div className='max-sm:w-1/3 sm:hidden'>
  <button 
  
  className={`sm:hidden  ${mobilMenu && 'text-green-500'}  w-10 p-1 border border-gray-500 rounded-lg transition-all duration-300 `}
  onClick={()=>dispatch(toggleMenu())}
  >
  <TiThMenu className='w-full h-full'/>
  </button>
  </div>
      <div className='flex w-1/3   space-x-3 max-sm:hidden'>
      <Link to={'/panel'}>
      <Button
       size='sm'
        
       gradientDuoTone="tealToLime">
      Panel
    </Button>
    </Link>
  
      <Link to={'/sign-in'}>
      <Button 
       size='sm'
        
      gradientMonochrome="success">
      SignIn
    </Button>
    </Link>
  
    <Link to={'/sign-up'}>
    <Button  
     size='sm'
     
    gradientMonochrome="success">
      SignUp
    </Button>
    </Link>
      </div>
  <MobilMenu />
      
  <div className={`w-1/3 flex items-center justify-center  `}>
  <h1 className={`sm:text-2xl text-lg bg-gradient-to-r bg-clip-text  ${['sign-in', 'sign-up', 'panel','create','update'].some(page => pathParts.includes(page)) && 'hidden'}
  text-transparent from-sky-600 via-purple-600 to-pink-500`}>
  @{dynamicUsername}
  </h1> 
  </div>
      <div className='w-1/3  flex justify-end '>
     
      <button  
        
      className='w-10 h-10 border border-gray-500 rounded-lg flex items-center justify-center transition-all duration-300
      bg-gradient-to-tr from-purple-600 to-blue-600 text-white hover:bg-gradient-to-bl dark:from-orange-600 dark:to-yellow-400
      '
      onClick={()=>dispatch(toggleTheme())}>
      {theme =='light' ? <FaMoon /> : <IoMdSunny />}
      </button>
      
      </div>
      </div>
  
     </div>
  )
}

export default Header