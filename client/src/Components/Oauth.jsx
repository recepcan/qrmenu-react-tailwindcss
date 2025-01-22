import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { useSelector,useDispatch } from 'react-redux'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { signInSuccess } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
        <button type='button' disabled={loading} onClick={googleAuth} className=' flex items-center justify-center font-bold hover:bg-gradient-to-tr  bg-gradient-to-br  from-yellow-500 via-orange-500 to-red-500 w-full p-2 rounded-lg  text-white hover:bg-sky-500 transition-all'>
            Countinue with Google  <AiFillGoogleCircle className='w-8 h-8 m-2'  />
        </button>
    )
}

export default Oauth