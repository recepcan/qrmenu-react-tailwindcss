import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Oauth from '../Components/Oauth'
import { toast } from 'react-toastify'
import { Button } from 'flowbite-react'
function SignUp() {
    const navigate = useNavigate()
    const [formdata, setformData] = useState({ username: "", email: "", password: "" })
    const handleChange = (e) => {
        setformData({ ...formdata, [e.target.id]: e.target.value.trim() })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/server/auth/signup', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formdata)

            })
            const data = await res.json()
            if (data.success === false) {
                return toast.error(data.message)
            }

            if (res.ok) {
                navigate('/sign-in')
            }

        } catch (error) {
            toast.error(error)
        }
    }
    return (

        <div className='w-full py-20 md:space-x-5   min-h-[800px]   flex max-md:flex-col  items-center justify-center'>


            <div className="w-1/3 max-md:w-full md:h-[600px]   flex  flex-col items-center justify-center ">
                <div className='flex  items-center justify-center  w-full'>
                    <h1 className='bg-gradient-to-br  from-green-300 via-teal-500 to-green-900  text-white p-5 rounded-2xl sm:text-3xl  text-xl font-bold font-sans'>qr</h1><span className='font-bold md:text-5xl text-2xl font-sans'> menu</span>
                </div>
                <h2 className='p-5  text-lg font-bold font-sans text-justify'>This is a demo project. you can sign up with your email and password or with google</h2>

            </div>
            <div className="w-1/2 max-md:w-full  md:h-[600px]   flex items-center justify-center ">
                <form className='flex w-full md:border border-black dark:border-white  transition-all duration-300 flex-col h-full items-center justify-evenly  gap-5  shadow-gray-400 p-5 rounded-lg '
                    onSubmit={handleSubmit}>

                    <div className='space-y-3'>
                        <div className='text-sm font-bold'>
                            your username
                            <input id='username' onChange={handleChange} className='p-3  border-2 rounded-lg dark:bg-gray-700 transition-all duration-300 outline-none w-full' type="text" placeholder='username' />
                        </div>
                        <div className='text-sm font-bold'>
                            your email
                            <input id='email' onChange={handleChange} className='p-3  border-2 rounded-lg dark:bg-gray-700 transition-all duration-300 outline-none w-full' type="email" placeholder='email' />
                        </div>

                        <div 
                            className='text-sm font-bold'>
                            your password
                            <input id='password' onChange={handleChange} className='p-3  border-2 rounded-lg dark:bg-gray-700 transition-all duration-300 outline-none w-full' type="password" placeholder='password' />
                        </div>
                    </div>
                    <Button
                        type='submit'
                        outline
                        size="xl"
                        gradientDuoTone="greenToBlue"
                        className='w-full  rounded-lg transition-all'>
                        SignUp
                    </Button>
                    <Oauth />
                </form>
            </div>

        </div>
    )
}

export default SignUp