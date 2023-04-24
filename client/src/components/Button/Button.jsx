import React from 'react'
import './style.css'
const Button = ({
    children,
    onClick,
    buttonClass,
    type
}) => {
  return (
    <button 
        onClick={onClick}
        className={buttonClass}
        type={type}    
    > 
        {children}
    </button>
  )
}

export default Button;