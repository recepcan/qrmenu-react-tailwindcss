import React from 'react'
import { MdAddShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div className='w-full flex items-center justify-center space-x-5 text-xl
     font-extrabold tracking-wider h-16 sm:h-24 absolute top-0 left-0  '>
   <Link to={'/'} className='p-2 bg-gray-100 shadow-lg shadow-black rounded-lg'>Menu</Link>
    <Link to={'/intheBox'} className='p-2 bg-gray-100 shadow-lg shadow-black rounded-lg'>Sepetim</Link>
    </div>
  )
}

export default Header