import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../../FireBase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../../redux/user/userSlice';
import {useNavigate} from 'react-router-dom'


function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async ()=> {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
 
            const result = await signInWithPopup(auth, provider)

            console.log(result)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: result.user.displayName, email: result.user.email, photo:result.user.photoURL}),
            })
            const data = await res.json();
            dispatch(signInSuccess(data))
            navigate('/')

        } catch (error) {
            console.log("Couldn't sign with google", error)
        }
    }
  return (
   <button 
   type="button" 
   onClick={handleGoogleClick}
   className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
    Continue with google
   </button>
  )
}

export default Oauth
