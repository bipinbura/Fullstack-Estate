import { useSelector } from "react-redux"
import InputBox from "../UI/InputBox/InputBox"
import Button from "../UI/Button/Button"


function Profile() {
  const {currentUser} = useSelector(state => state.user)

  function handleChange (){
    console.log(hi)
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center">
         Profile
      </h1>
      <form className="flex flex-col gap-4">
         <img src={currentUser.avatar} alt="profile" 
         className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <InputBox type={"text"} placeholder={"username"} id={"username"} onChange={handleChange} />
        <InputBox type={"email"} placeholder={"email"} id={"email"} onChange={handleChange} />
        <InputBox type={"password"} placeholder={"password"} id={"password"} onChange={handleChange} />
        <Button text={"UPDATE"} load={null}/>
      </form>
      <div className=" flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}

export default Profile
