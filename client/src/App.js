import React from 'react';
import { Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import Register from './pages/Register';




const App = () => {
  return (
    <>
      <Routes>
         <Route exact path='/login' element= {<Login />} />
         <Route path='/register' element={<Register/> } />
         <Route path="/" element={<MainPage/>} />
      </Routes>
    </>
  )
}

export default App;
