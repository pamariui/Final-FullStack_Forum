import React from 'react'
import './style.css'
import * as FaIcon from "react-icons/fa";

const Footer= ({copy, years,color}) => {
  return (
    <footer>
        <p style={color= {color}}>
        {copy} <FaIcon.FaRegCopyright className='icon'/> {years}
        </p>
        
    </footer>
  )
}

export default Footer;