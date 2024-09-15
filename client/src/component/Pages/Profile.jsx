import { useSelector } from "react-redux"
import InputBox from "../UI/InputBox/InputBox"
import Button from "../UI/Button/Button"
import { useState } from "react"
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from "../../redux/user/userSlice"
import { useDispatch } from "react-redux"
import {Link} from 'react-router-dom'
import ProfileImage from "../UI/ProfileImage/ProfileImage"


function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({})
  const [success, setSuccess] = useState(false)
  const [list, setList] = useState(undefined)


  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value
    }))
  }

  async function handleProfileImageUpdate (e){
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("profileImage", formData.profileImage);

    try {
      const res = await fetch('/api/users/updateProfileImage', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }
  async function handleUpdateDetail (e){
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch('/api/users/updateuserProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return
      }

      dispatch(updateUserSuccess(data))

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  async function handlePasswordChange (e){
    e.preventDefault();
    try {
      const res = await fetch('/api/users/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return
      }
      dispatch(updateUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  //later add settimeout to clear message and error
  async function handleSubmit (e){
    e.preventDefault();
    if ((formData.oldPassword && !formData.newPassword) || (!formData.oldPassword && formData.newPassword)) {
      dispatch(updateUserFailure("Both old and new password fields are required to change your password."));
      return;
    }
    // Update profile image if it exists in formData
    if (formData.profileImage) {
      await handleProfileImageUpdate(e);
    }


    // Check if only the password fields are filled
    const isPasswordChangeOnly = formData.oldPassword && formData.newPassword && !formData.username && !formData.email;

    if (isPasswordChangeOnly) {
      await handlePasswordChange(e);
    } else {
      // Otherwise, update user details
      await handleUpdateDetail(e);

      // If password fields are also filled, handle password change
      if (formData.oldPassword && formData.newPassword) {
        await handlePasswordChange(e);
      }
    }
    setSuccess(true)
  }

  async function handleDeleteUser (){
    try {
      dispatch(deleteUserStart());
      const res = await fetch('/api/users/delete', {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  async function handleSignOut () {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/users/signout', {
        method: 'POST',
        credentials: 'include'
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  async function showListing (e) {
      e.preventDefault();
      try {
        const response = await fetch('/api/list/getListing', {
        method: 'POST',
        credentials: 'include'})
        const data = await response.json()
        setList(data.data);
           console.log(data.data)
      } catch (error) {
        console.log(error)
      }
  }

  async function handleDeleteList(id) {
    try {
      const res = await fetch('/api/list/deleteListing', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          _id:id
        }),
      });
      const data = await res.json();
      if(data.success === false){
        return
      }

      setList((pre)=>pre.filter((list)=> list._id !== id))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <ProfileImage formdata={formData} setFormData={setFormData} currentUser={currentUser} />
        <InputBox placeholder="username" id="username" onChange={handleChange} defaultValue={currentUser?.data?.username} />
        <InputBox type="email" placeholder="email" id="email" onChange={handleChange} defaultValue={currentUser?.data?.email} />
        <InputBox type="password" placeholder="oldPassword" id="oldPassword" onChange={handleChange} />
        <InputBox type="password" placeholder="newPassword" id="newPassword" onChange={handleChange} />
        <Button text={"UPDATE"} load={loading} />
        <Link
         className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" 
         to={'/createListing'}>
         Create Listing
        </Link>
      </form>
      <div className=" flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Sign Out</span>
      </div>
      <div className=" grid items-center">
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {success && <p className="text-green-500 mt-5">Success</p>}
      <Button text='Show Listing' onClick={showListing}/>
      </div>
      {list && list.length > 0 && 
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">
          Your Listing
        </h1>
     { list.map((listing)=>(

        <div key={listing._id}
         className="border rounded-lg p-3 flex justify-between items-center gap-4" >
          <Link to={`/listedPage/${listing._id}`}>
          <img src={listing.imageUrls[0]} 
           alt="listing cover"
           className="h-16 object-contain gap-4"  
             />  
          </Link>
          <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate"
          to={`/listedPage/${listing._id}`}>
          <p>
          {listing.name}
          </p>
          </Link>
          <div className=" flex flex-col items-center" >
           <Button text='Delete' className="text-red-700 uppercase" onClick={()=>handleDeleteList(listing._id)}/>
           <Link to={`/updateListing/${listing._id}`}>
           <Button text='Edit' className="text-green-700 uppercase" />
           </Link>
          </div>

        </div>
      ))
      }
      </div>
     }
    </div> 
  )
}

export default Profile

