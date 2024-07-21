
import { RouterProvider} from 'react-router-dom'
import { route } from './component/Routes/Route';
function App() {

  return (
    <>
   <RouterProvider router={route}/>
    </>
  )
}

export default App
