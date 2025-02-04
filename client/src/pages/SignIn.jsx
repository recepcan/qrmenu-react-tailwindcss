import React, { useState } from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../store/userSlice'
import { toast } from 'react-toastify'
import Oauth from '../Components/Oauth'
import { Button } from 'flowbite-react'

function SignIn() {

    const dispatch = useDispatch()
    const { error: errorMessage, loading, currentUser } = useSelector(state => state.user)

    const navigate = useNavigate()
    const [formdata, setformData] = useState({ email: "", password: "" })
    const handleChange = (e) => {
        setformData({ ...formdata, [e.target.id]: e.target.value.trim() })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            return toast.error('Lütfen bütün alanları doldurun')
        }

        try {
            dispatch(signInStart())
            const res = await fetch('/server/auth/signin', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formdata),
                credentials: 'include'// Kimlik bilgilerini (cookie'leri) cross-origin isteklerde gönderir

            })
            const data = await res.json()
            if (data.success === false) {
                toast.error(data.message)
            }

            if (res.ok) {

                dispatch(signInSuccess(data))
                navigate('/panel ')
            }
        } catch (error) {
          (toast.error(error))
        }



    }

    return (

        <div className='w-full py-20 md:space-x-5   min-h-[800px]   flex max-md:flex-col  items-center justify-center'>


            <div className="w-1/3 max-md:w-full md:h-[600px]   flex  flex-col items-center justify-center ">
            <div className='flex  items-center justify-center  w-full'>
            <h1 className='bg-gradient-to-br  from-green-300 via-teal-500 to-green-900  text-white p-5 rounded-2xl sm:text-3xl  text-xl font-bold font-sans'>qr</h1><span className='font-bold md:text-5xl text-2xl font-sans'> menu</span>
             </div>
             <h2 className='p-5  text-lg font-bold font-sans text-justify'>This is a demo project. you can sign in with your email and password or with google</h2>
     
            </div>
            <div className="w-1/2 max-md:w-full  md:h-[600px]   flex items-center justify-center ">
                <form className='flexflex-col items-center justify-center space-y-3 h-full  w-full md:border border-black dark:border-white  transition-all
                 duration-300   gap-5  shadow-gray-400 p-5 
                 rounded-lg '
                 onSubmit={handleSubmit}>
                   
                    <div className='space-y-3'>
                        <div className='text-sm font-bold'>
                            your email
                            <input 
                            id='email' 
                            onChange={handleChange} 
                            className='p-3  border-2 rounded-lg dark:bg-gray-700 transition-all duration-300 outline-none w-full' 
                            type="email" 
                            placeholder='email' />
                        </div>
                        <div className='text-sm font-bold'>
                            your password
                            <input 
                            id='password' 
                            onChange={handleChange} 
                            className='p-3  border-2 rounded-lg dark:bg-gray-700 transition-all duration-300 outline-none w-full' 
                            type="password" placeholder='password' />
                        </div>

                        
                    </div>
                    <Button 
                    type='submit'
                    outline
                    size="xl"
                    gradientDuoTone="greenToBlue" 
                    className='w-full  rounded-lg transition-all'>
                    SignIn
                    </Button>
              <Oauth/>
                    </form>
            </div>

        </div>
    )
}

export default SignIn