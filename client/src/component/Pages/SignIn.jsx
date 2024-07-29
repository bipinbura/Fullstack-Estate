
import InputBox from "../UI/InputBox/InputBox"
import { Link, useNavigate } from 'react-router-dom'
import Button from "../UI/Button/Button"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice"

function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading ,error} = useSelector((state) => state.user) //data coming from redux/store

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value, //whate ever is id input value in that id
      }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if(!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Something went wrong')
      }
      const data = await res.json();
      if (!data.success) {
         dispatch(signInFailure(data.message));
        return
      }
       dispatch(signInSuccess(data))
      navigate('/') 
    } catch (error) {
      dispatch(signInFailure(error.message));
    }

  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputBox type={"text"} placeholder={"email"} id={"email"} onChange={handleChange} />
        <InputBox type={"text"} placeholder={"password"} id={"password"} onChange={handleChange} />
        <Button load={loading} text={'Sign In'} />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Not have an account</p>
        <Link to={"/signup"}>
          <span className="text-blue-700"> SignUp</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}



export default SignIn
