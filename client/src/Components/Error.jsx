import { Button } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

function Error() {
  return (
    <div className='w-full h-screen bg-black/50 flex flex-col items-center justify-center text-3xl text space-y-3'>
     <h1 className='text-white p-5 bg-gray-800 flex items-center justify-center rounded-full space-x-3'><h1>page not found</h1> <h1 className='text-red-500 p-5 bg-gray-100 rounded-full '>/404</h1></h1>
     
    <Link to={'/'} >
    <Button gradientDuoTone="tealToLime">Go Home </Button>
    </Link>
    </div>
  )
}

export default Error