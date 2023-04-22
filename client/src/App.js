import React from 'react';
import { Route, Routes} from 'react-router-dom';


import Login from './pages/Login';
import MainPage from './pages/MainPage';
import Register from './pages/Register';
import MyProfile from './pages/MyProfile';
import CreateQuestion from './pages/CreateQuestion';




const App = () => {
  return (
    <>
      <Routes>
         <Route exact path='/login' element= {<Login />} />
         <Route path='/register' element={<Register/> } />
         <Route path="/" element={<MainPage/>} />
         <Route path="/myprofile" element={<MyProfile/>} />
         <Route path='/question' element={<CreateQuestion />} />
      </Routes>
    </>
  )
}

export default App;
