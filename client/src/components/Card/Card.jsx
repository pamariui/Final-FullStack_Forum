import React from 'react'

const Card = ({
    title,
    category,
    content,
    posted,
    user,
    childer
}) => {
  return (
    <div className="card">
        <div className='card-header'>
            <h2>{title}</h2>
            {category ? (
                <h3>Category: {category}</h3>
                ) : (
                <h3>answer</h3>
            )}
        </div>
        <div className="card-body">
            {content}
        </div>
        <div className="card-footer">
            <p>{posted}</p>
            <h3>{user}</h3>
        </div>
    </div>
  )
}

export default Card;