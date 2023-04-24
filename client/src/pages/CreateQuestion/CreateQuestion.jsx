import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer';
import Main from '../../components/Main';
import './style.css'

const CreateQuestion = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [username, setUsername] = useState('');
  const [userId, setuserId] = useState();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('/api/v1/verify', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          setUsername(data.username);
          setuserId(data.id)
          if (response.ok) {
          } else {
            throw new Error('User not authorized');
          }
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    };

    setTimeout(() => {
      checkToken();
    }, 300);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/v1/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category_id:category,
          content,
          user_id:userId
        }),
      });
      if (response.status === 201) {
        console.log('Question created successfully');
        window.location.href = '/'
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/v1/categories');
        const data = await response.json();
        setCategoryList(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      <Header  username={username}  />
      <Main>
        <div className='create-question'>
          <h1>Create a new question</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category">Category:</label>
              <select
                type="text"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              > <option value="">Select Department</option>
              {categoryList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
              </select>
            </div>
            <div>
              <label htmlFor="content">Content:</label>
              <textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <button className='create' type="submit">Submit</button>
          </form>
        </div>
      </Main>
      <Footer copy={'Marius'} years={'2023 04'} color={'#666666'} />
    </>
  );
};

export default CreateQuestion;
