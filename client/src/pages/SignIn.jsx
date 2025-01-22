import React, { useState } from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../store/userSlice'
import { toast } from 'react-toastify'
import Oauth from '../Components/Oauth'

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
            return dispatch(signInFailure(toast.error('Lütfen bütün alanları doldurun')))
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
                dispatch(signInFailure(toast.error(data.message)))
            }

            if (res.ok) {

                dispatch(signInSuccess(data))
                navigate('/panel ')
            }
        } catch (error) {
            dispatch(signInFailure(toast.error(error)))
        }



    }

    return (

        <div className='w-full p-10 space-x-5 min-h-screen font-inter bg-gray-100 dark:bg-gray-900 dark:text-white
        flex md:flex-row flex-col items-center justify-center'>


            <div className="md:w-1/3 w-full  md:h-[600px] p-3 md:p-10 bg-gray-100 dark:bg-gray-900 dark:text-white
            flex  flex-col items-center justify-center ">
                <div className='flex  items-center justify-start'>
                    <h1 className='bg-gradient-to-br from-green-300 via-teal-500 to-green-900 
                     text-white p-5 rounded-2xl text-3xl font-bold font-inter'>
                    Recep Can's
                   </h1>
                </div>
                <h2 className='p-5  text-lg font-bold font-inter'>
                This is a demo project. you can sign in with your email and password or with google
                </h2>

            </div>
            <div className="md:w-1/2 w-full md:h-[400px] md:p-10 p-3  flex flex-col items-center  lg:justify-center ">
                <form onSubmit={handleSubmit} className='flex  flex-col h-full   md:justify-evenly
                 w-full md:w-2/3 gap-5  shadow-gray-400 p-5 rounded-lg bg-gray-100 dark:bg-gray-900 dark:text-white' >

                    <div className='space-y-3'>

                        <div className='text-sm font-bold'>
                            your email
                            <input id='email' onChange={handleChange} className='p-3  border-2 rounded-lg dark:bg-gray-900 bg-gray-100 outline-none w-full'
                             type="email" 
                             placeholder='email' />
                        </div>

                        <div 
                        className='text-sm font-bold'>
                            your password
                            <input 
                            id='password' 
                            onChange={handleChange} 
                            className='p-3  border-2 rounded-lg bg-gray-100 dark:bg-gray-900 outline-none w-full'
                             type="password" 
                             placeholder='password' />
                        </div>
                    </div>
                    <button 
                    type='submit' 
                    disabled={loading} 
                    className='bg-gradient-to-br hover:bg-gradient-to-tr font-bold
                     from-green-300 via-teal-500 to-green-900 w-full p-5 rounded-lg  text-white hover:bg-sky-500 transition-all'>
                        {loading ? '...' : 'SignIn '}
                    </button>

                    <Oauth />

                    <Link to='/forgot-password' className='text-blue-600 text-sm'>Forgot Password</Link>

                </form>

            </div>

        </div>
    )
}

export default SignIn