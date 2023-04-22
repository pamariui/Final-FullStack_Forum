import React, { useEffect, useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom'
import * as RiIcon from "react-icons/ri";


const Header = ({username}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() =>{
    const handleClickOutside = (event) => {
      const headerElement = document.querySelector("header");
      if (headerElement && !headerElement.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[])

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // reload the page after logout
  };

  const modifiedUsername = username ? username.charAt(0).toUpperCase() + username.slice(1) : 'Guest!';

  return (
    <header>
        <div className='header'>
            <Link className="header-logo" to={'/'}>
                <RiIcon.RiChatSmile3Line className='logo-icon'/>
                <h6>Forum</h6>
            </Link>
            
            <div className='header-user'>
                <h3>Welcome, {modifiedUsername}</h3>
                <RiIcon.RiUser5Line className='user-icon' onClick={togglePopup}/>
            </div>
            {isPopupOpen && (
              <div className="user-popup">
              <ul>
                  {username ? (
                    <>
                      <li>
                          <a href="/myprofile">My profile</a>
                      </li>
                      <li>
                          <a href="/" onClick={handleLogout}>Log out</a>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                          <a href="/login">Log in</a>
                      </li>
                      <li>
                          <a href="/register">Sign up</a>
                      </li>
                    </>
                  )}
              </ul>                          
            </div>
            )}
        </div>
    </header>
  )
}

export default Header;
