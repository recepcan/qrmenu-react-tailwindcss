import { Button } from 'flowbite-react'
import React from 'react'
import { MdAddShoppingCart } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import { toggleTheme } from '../store/headerSlice'
import {useSelector,useDispatch} from 'react-redux'
function Header() {
  const {theme}=useSelector(state=>state.header)
  console.log(theme,"theme")
  const dispatch=useDispatch()
   const { username } = useParams();
  return (
    <div className='w-full flex items-center justify-center space-x-5 text-xl transition-all duration-300  bg-gray-200 dark:bg-gray-600
     font-extrabold tracking-wider p-3 h-16 sm:h-20  absolute top-0 left-0  z-40'>
  <div className=' w-full flex items-center justify-between  '>
      <div className='flex space-x-3'>
      <Link to={'/panel'}>
      <Button outline gradientDuoTone="tealToLime">
      Panel
    </Button>
    </Link>
  
      <Link to={'/sign-in'}>
      <Button outline  gradientMonochrome="success">
      SignIn
    </Button>
    </Link>
  
    <Link to={'/sign-up'}>
    <Button  outline gradientMonochrome="success">
      SignUp
    </Button>
    </Link>
      </div>
  
      <div>
      <Button outline gradientDuoTone='purpleToBlue'  onClick={()=>dispatch(toggleTheme())}>{theme}</Button>
      <h1 className='text-2xl'>{username}</h1>
      </div>
      </div>
  
     </div>
  )
}

export default Header