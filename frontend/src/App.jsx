// Imports
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './App.css';

// Pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';

// Components
import Navbar from './components/Navbar';
import SingleWorkout from './pages/SingleWorkout';

function App() {
  const {user} = useAuthContext()

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar/>
        <div className='pages'>
          <Routes>
            {/* if we have a user show home, else go to login */}
            <Route path='/' element={user ? <Home/> : <Navigate to="/login"/>}/>
            {/* if we dont have a user show login, if we do show home */}
            <Route path='/login' element={!user ? <Login/> : <Navigate to="/"/>}/>
            {/* if we dont have a user show signup, if we do show home */}
            <Route path='/signup' element={!user ? <Signup/> : <Navigate to="/"/>}/>
            <Route path='/:id' element={user ? <SingleWorkout/> : <Navigate to="/login"/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
