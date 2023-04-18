import React from 'react'
import './style.css'
import * as RiIcon from "react-icons/ri";

const Header = ({username}) => {
  return (
    <header>
        <div className='header'>
            <div className="header-logo">
                <RiIcon.RiChatSmile3Line/>
                <h6>Forum</h6>
            </div>
            <div className='header-links'>

            </div>
            <div className='header-user'>
                <h3>Welcome, {username}</h3>
                <RiIcon.RiUser5Line />
            </div>
        </div>
    </header>
  )
}

export default Header;