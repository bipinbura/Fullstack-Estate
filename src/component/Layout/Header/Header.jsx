
import { Link } from 'react-router-dom'
import SearchField from '../../UI/SearchField/SearchField'

function Header() {
  return (
       <header className="bg-slate-200 shadow-md">
           <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
            <Link to='/'>
           <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
         </h1>
         </Link>
         <SearchField/>
         <ul className='flex gap-4'>
            <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline '>Home</li>
            </Link>
            <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline '>About</li>
            </Link>
            <Link to='/signin'>
            <li className=' sm:inline text-slate-700 hover:underline '>SignIn</li>
            </Link>
         </ul>
           </div>
       </header>
  )
}

export default Header
