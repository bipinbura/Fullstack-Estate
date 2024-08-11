import { useSelector } from "react-redux"
import InputBox from "../UI/InputBox/InputBox"
import Button from "../UI/Button/Button"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import { app } from '../../FireBase'
import { updateUserStart,
   updateUserSuccess, 
   updateUserFailure ,
   deleteUserStart,
   deleteUserSuccess,
   deleteUserFailure,
   signOutUserStart,
   signOutUserSuccess,
   signOutUserFailure} from "../../redux/user/userSlice"
import { useDispatch } from "react-redux"


function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [success, setSuccess] = useState(false)
  const dispatch = useDispatch();


  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    
  }

  const handleUpdateDetail = async (e) => {
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

  const handlePasswordChange = async (e) => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((formData.oldPassword && !formData.newPassword) || (!formData.oldPassword && formData.newPassword)) {
      dispatch(updateUserFailure("Both old and new password fields are required to change your password."));
      return;
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
  };

  const handleDeleteUser = async()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch('/api/users/delete',{
        method:'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async()=>{
  try {
    dispatch(signOutUserStart())
    const res = await fetch('/api/users/signout',{
      method: 'POST',
      credentials: 'include'
    })
    const data = await res.json();
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return
    }
    dispatch(signOutUserSuccess(data))
  } catch (error) {
    dispatch(signOutUserFailure(error.message))
  }
  }


  // later use cloudinary for storing pictures
  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },

      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (DownloadURL) => {
            setFormData({ ...formData, avatar: DownloadURL })
          }
        )
      });
  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef} hidden accept="image/.*" />
        <img src={formData.avatar || currentUser.avatar} //bug
          onClick={() => fileRef.current.click()}
          alt="profile"
          className=" rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="'text-sm self-center">
          {fileUploadError ?
            (<span className="text-red-700">Error Image upload</span>) :
            (filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>)
              :
              filePerc === 100 ? (
                <span className="text-green-700">Image successfully upload</span>
              ) : (''))
          }
        </p>
        <InputBox placeholder="username" id="username" onChange={handleChange} defaultValue={currentUser?.data?.username} />
        <InputBox type="email" placeholder="email" id="email" onChange={handleChange} defaultValue={currentUser?.data?.email} />
        <InputBox type="password" placeholder="oldPassword" id="oldPassword" onChange={handleChange} />
        <InputBox type="password" placeholder="newPassword" id="newPassword" onChange={handleChange} />
        <Button text={"UPDATE"} load={loading}/>
      </form>
      <div className=" flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete Account</span>
        <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Sign Out</span>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {success && <p className="text-green-500 mt-5">Success</p>}
    </div>
  )
}

export default Profile

//firebaseStorage
// allow read;
// allow write: if request.resource.size < 2*1024*1024 && request.resource.contentType.matches('image/.*')
