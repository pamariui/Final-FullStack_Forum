import React from 'react'
import './style.css'


const Card = ({
    title,
    category,
    content,
    posted,
    user,
    cardClass,
    children
}) => {
  return (
    <div className={cardClass}  >
        <div className='card-header'>
            <h2>{title}</h2>
            {category ? (
                <h3>Category: {category}</h3>
                ) : (
                <h3>answer by {user}</h3>
            )}
        </div>
        <div className="card-body">
            {content}
        </div>
        <div className="card-footer">
            <p>{posted}</p>
            {!category ? (
                <></>
                ) : (
                <h3>answer by {user}</h3>
            )}
        </div>
            {children}
    </div>
  )
}

export default Card;