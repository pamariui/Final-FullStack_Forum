import React, { useEffect, useState } from 'react'
import './style.css'
import * as RiIcon from "react-icons/ri";
import { Link } from 'react-router-dom';

const Header = ({username}) => {
  const modifiedUsername = username.charAt(0).toUpperCase() + username.slice(1);
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

  return (
    <header>
        <div className='header'>
            <div className="header-logo">
                <RiIcon.RiChatSmile3Line className='logo-icon'/>
                <h6>Forum</h6>
            </div>
            <div className='header-links'>
              <Link to='/'>Questions</Link>
            </div>
            <div className='header-user'>
                <h3>Welcome, {modifiedUsername}</h3>
                <RiIcon.RiUser5Line className='user-icon' onClick={togglePopup}/>
            </div>
            {isPopupOpen && (
              <div className="user-popup">
              <ul>
                  <li>
                      <a href="/">Sign up</a>
                  </li>
                  <li>
                      <a href="/">Log in</a>
                  </li>
              </ul>                          
          </div>
            )

            }
        </div>
    </header>
  )
}

export default Header;