import React, { useState, useEffect } from 'react';
import './style.css'

function Likes(props) {
  const [likes, setLikes] = useState(props.likesCount || 0);
  const [dislikes, setDislikes] = useState(props.dislikesCount || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    const data = {
      user_id: props.userId,
      is_like: true,
      [`${props.type}_id`]: props.itemId
    };

    // Update state immediately
    setLikes(likes + 1);
    setIsLiked(true);

    const url = props.type === 'answer' ? `/api/v1/answers/${props.itemId}/likes` : `/api/v1/questions/${props.itemId}/likes`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setLikes(data.likesCount);
        setIsLiked(true);
      })
      .catch(error => {
        console.error('Error:', error);
        // Revert state if request fails
        setLikes(likes - 1);
        setIsLiked(false);
      });
  };

  const handleDislike = () => {
    const data = {
      user_id: props.userId,
      is_like: false,
      [`${props.type}_id`]: props.itemId
    };

    // Update state immediately
    setDislikes(dislikes + 1);
    setIsLiked(false);

    const url = props.type === 'answer' ? `/api/v1/answers/${props.itemId}/likes` : `/api/v1/questions/${props.itemId}/likes`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setLikes(data.dislikesCount);
        setIsLiked(false);
      })
      .catch(error => {
        console.error('Error:', error);
        // Revert state if request fails
        setDislikes(dislikes - 1);
        setIsLiked(true);
      });
  };

  useEffect(() => {
    const url = props.type === 'answer' ? `/api/v1/answers/${props.itemId}/likes` : `/api/v1/questions/${props.itemId}/likes`;
  
    fetch(url, {
      method: 'GET'
      
    })
      .then(response => response.json())
      .then(data => { 
        
        setLikes(data.like_count);
        setDislikes(data.dislike_count)        
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [props.itemId, props.type, props.userId,likes,dislikes]);

  return (
    <div className='like-btns'>
      <p>
        Likes: {likes}
      </p>
      <button onClick={handleLike} disabled={isLiked}>Like</button>
      <p>
        Dislikes: {dislikes} 
      </p>
      <button onClick={handleDislike}>Dislike</button>
    </div>
  );
}

export default Likes;
