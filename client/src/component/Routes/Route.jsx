import { createBrowserRouter, createRoutesFromElements ,Route } from "react-router-dom"
import Home from '../Pages/Home';
import About from '../Pages/About';
import Profile from '../Pages/Profile';
import SignIn from '../Pages/SignIn';
import SignUp from '../Pages/SignUp'
import Layout from "../Layout/Layout";
import PrivateRoutes from "./PrivateRoutes";
import CreateList from "../Pages/CreateList";
import UpdateListing from "../Pages/UpdateListing";
import ListedPages from "../Pages/ListedPages";
import Search from "../Pages/Search";
// export  const Route = createBrowserRouter([
//     {
//         path: "/",
//         element: <Home/> ,
//       }, 
//       {
//         path: "/about",
//         element: <About/> ,
//       }, 
//       {
//         path: "/profile",
//         element: <Profile/> ,
//       }, 
//       {
//         path: "/signin",
//         element: <SignIn/> ,
//       }, 
//       {
//         path: "/signout",
//         element: <SignOut/> ,
//       }, 
// ])

export const route = createBrowserRouter(
  createRoutesFromElements(
     <Route path='/' element={<Layout/>}>
       <Route path='' element={<Home/>}/>
       <Route path='about' element={<About/>}/>
       <Route path='signin' element={<SignIn/>}/>
       <Route path='signup' element={<SignUp/>}/>
       <Route path='search' element={<Search/>}/>
       <Route path='listedPage/:id' element={<ListedPages/>}/>
       <Route element={<PrivateRoutes/>} >
         <Route path='profile' element={<Profile/>}/>
         <Route path='createListing' element={<CreateList/>}/>
         <Route path='updateListing/:id' element={<UpdateListing/>}/>
       </Route>
     </Route>
  )
)