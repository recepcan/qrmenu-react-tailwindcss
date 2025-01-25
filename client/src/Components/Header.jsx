import { Button } from 'flowbite-react'
import React from 'react'
import { MdAddShoppingCart } from 'react-icons/md'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { toggleTheme } from '../store/headerSlice'
import {useSelector,useDispatch} from 'react-redux'
import { FaMoon } from 'react-icons/fa'
import { IoMdSunny } from "react-icons/io";

function Header() {
  const {theme}=useSelector(state=>state.header)
  console.log(theme,"theme")
  const dispatch=useDispatch()
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const dynamicUsername =  pathParts[1]; // Eğer params boşsa, URL'den al
  console.log(dynamicUsername)
  return (
    <div className='w-full flex items-center justify-center space-x-5 text-xl transition-all duration-300  bg-gray-200 dark:bg-gray-600
     font-extrabold tracking-wider p-3 h-16 sm:h-20  absolute top-0 left-0  z-40'>
  <div className=' w-full flex items-center justify-between  '>
      <div className='flex space-x-3'>
      <Link to={'/panel'}>
      <Button
       size='sm'
       outline 
       gradientDuoTone="tealToLime">
      Panel
    </Button>
    </Link>
  
      <Link to={'/sign-in'}>
      <Button 
       size='sm'
      outline  
      gradientMonochrome="success">
      SignIn
    </Button>
    </Link>
  
    <Link to={'/sign-up'}>
    <Button  
     size='sm'
    outline 
    gradientMonochrome="success">
      SignUp
    </Button>
    </Link>
      </div>
  
      <div className=' flex space-x-2'>
      <Button outline 
      size='sm'
      gradientDuoTone='purpleToBlue'  
      onClick={()=>dispatch(toggleTheme())}>{theme =='light' ? <FaMoon /> : <IoMdSunny />}</Button>
      <h1 className='sm:text-2xl text-lg '>@{dynamicUsername}</h1>
      </div>
      </div>
  
     </div>
  )
}

export default Header