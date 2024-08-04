import InputBox from "../UI/InputBox/InputBox"
import { Link, useNavigate } from 'react-router-dom'
import Button from "../UI/Button/Button"
import { useState } from "react"
import Oauth from "../GoogleAuth/Oauth";
function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

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
      setLoading(true)
      const res = await fetch('/api/users/signup', {
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
        setError(data.message);
        setLoading(false);
        return
      }
      setLoading(false)
      setError(null)
      navigate('/signin') 
    } catch (error) {
      setLoading(false);
      setError(error.message)
    }

  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">SignUp</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputBox type={"text"} placeholder={"username"} id={"username"} onChange={handleChange} />
        <InputBox type={"text"} placeholder={"email"} id={"email"} onChange={handleChange} />
        <InputBox type={"text"} placeholder={"password"} id={"password"} onChange={handleChange} />
        <Button load={loading} text={'SignUp'} />
        <Oauth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account</p>
        <Link to={"/signin"}>
          <span className="text-blue-700"> Signin</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}

export default SignUp
