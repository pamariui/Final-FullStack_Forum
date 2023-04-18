import React, { useState } from 'react';
import './style.css'
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        console.log('User registered successfully');
        window.location.href = '/login';
      } else {
        throw new Error('Error registering user');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
        <div className='container'>
            <div className='register-container'>
                <div className='register-left'>
                        <div className='register-icon'>
                            <AiIcons.AiOutlineUserAdd/>
                        </div>
                        <div className='register-text'>
                            <h1>Join Us</h1>
                            <h3>
                                Probably the Greatest comunity 
                            </h3>
                            <h4> Already have account?</h4>
                            <h4>Back to <Link to='/login'>Login</Link></h4>
                        </div>
                </div>
                <div className='register-right'>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        </div>
                        <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        </div>
                        <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        </div>
                        <Button type="submit" buttonClass="main-btn"> Register </Button>
                    </form>
                </div>
            </div>
        </div>
        <Footer copy={'Marius'} 
              years={'2023 04'}
              color={'black'}/>
    </>
  );
};

export default Register;
