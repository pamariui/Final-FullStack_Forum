import React, { useState } from 'react';
import './style.css'
import * as GiIcons from "react-icons/gi";
import * as IoIcons from "react-icons/io5";
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    };
  
    try {
      const response = await fetch('/api/v1/login', requestOptions);
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); // store token in local storage
        window.location.href = '/';
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className='container'>
        <div className='login-container'>
          <div className='login-left'>
            <div className='login-icon'>
              <GiIcons.GiEntryDoor/>
            </div>
            <h1>Login</h1>
            {message && <div>{message}</div>}
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" buttonClass="main-btn">
                Login <IoIcons.IoEnterOutline/>
              </Button>
            </form>
          </div>
          <div className="login-right">
            <h1>Welcome</h1>
            <h3>Want to join Us?</h3>
            <Link to='/register'>Register</Link>
          </div>
        </div>
      </div>
      <Footer copy={'Marius'} 
              years={'2023 04'}
              color={'black'}/>
    </>
  );
}

export default Login;
