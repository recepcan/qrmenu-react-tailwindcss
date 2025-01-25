import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { useSelector,useDispatch } from 'react-redux'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { signInSuccess } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'flowbite-react';
function Oauth() {
    const { error: errorMessage, loading } = useSelector(state => state.user)
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const googleAuth  = async () =>{
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/server/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
                })
            const data = await res.json()
            if (res.ok){
                console.log(resultsFromGoogle)
                dispatch(signInSuccess(data))
                toast.success(data)
                navigate('/panel')
            }
        } catch (error) {
            toast.error(error);
        }
    } 
    

    return (
        <Button 
        size="xl"
        gradientDuoTone="pinkToOrange" 
        disabled={loading} 
        onClick={googleAuth} 
        className='  font-bold
        w-full  rounded-lg transition-all'>
            <h1 className='h-8 p-1 flex items-center justify-center'>Countinue with Google </h1> 
            <AiFillGoogleCircle className='w-8 h-8 '  />
        </Button>
    )
}

export default Oauth