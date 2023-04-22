import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import Main from '../../components/Main';
import Header from '../../components/Header/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

const MyProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [title, setTitle] = useState('');
  const[category,setCategory] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const response = await fetch('/api/v1/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setUsername(data.username);
          setEmail(data.email);
          setUserId(data.id);
        } else {
          throw new Error('User not authorized');
        }
      } catch (error) {
        console.error(error);
        window.location.href = '/login';
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserQuestions = async () => {
        try {
          const response = await fetch(`/api/v1/questions/user/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setQuestions(data);
          } else {
            throw new Error('Unable to fetch user questions');
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchUserQuestions();
    }
  }, [userId]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
    try {
      const response = await fetch('/api/v1/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        const response2 = await fetch(`/api/v1/users/${data.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
        if (response2.ok) {
          window.location.href = '/';
          console.log('User data updated successfully');
        }
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      window.location.href = '/login';
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/v1/verify');
      const data = await response.json();
      const response2 = await fetch(`/api/v1/users/${data.id}`, {
        method: 'DELETE'
      });
      if (response2.ok) {
        console.log('User account deleted successfully');
        window.location.href = '/login';
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      window.location.href = '/login';
    }
  };

  const handleDeleteQuestion = async (event, id) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/v1/questions/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log('Question deleted successfully');
        window.location.reload();
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      // window.location.href = '/login';
    }
  };
  const handleEditQuestion = (id) => {
    const question = questions.find((q) => q.id === id);
    setTitle(question.title);
    setCategory(question.category);
    setContent(question.content);
    setEditingQuestion(id);
  };
  
  const handleSaveQuestion = async (id) => {
    const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
    try {
      const response = await fetch(`/api/v1/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category_id:category
        }),
      });
      if (response.ok) {
        setEditingQuestion(null);
        console.log('Question updated successfully');
        window.location.reload();
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      // window.location.href = '/login';
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
        <Header username={username} />
        <Main>
          <div>
          {questions.map((el, i) => {

            return (
              <div key={i}>
                <Card 
                    title={editingQuestion === el.id ? (
                            <input type="text" value={title} onChange={(e) =>       setTitle(e.target.value)} />
                            ) : el.title}
                    category={editingQuestion === el.id ? (
                          <select
                            type="text"
                            name="category"
                            value={el.category}
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="">Select Category</option>
                                {categoryList.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.category}
                                  </option>
                                  ))}
                          </select>
                          ) : el.category}
                    content={editingQuestion === el.id ? (
                      <textarea value={el.content} onChange={(e) => setContent(e.target.value)} />
                    ) : el.content}
                    posted={el.updated_at ? ` Updated: ${el.updated_at} `: ` Created: ${el.created_at} ` }
                    user={el.user}
              />
                <div>
                  {editingQuestion === el.id ? (
                    <>
                      <Button onClick={() => handleSaveQuestion(el.id)}>Save</Button>
                      <Button onClick={() => setEditingQuestion(null)}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEditQuestion(el.id)}>Edit</Button>
                  )}
                  <Button onClick={(event) => handleDeleteQuestion(event, el.id)}>Delete</Button>
                </div>

              </div>
            );
          })}

          </div>

          <div>
              <h1>{username} Welcome to My Profile</h1>
              <form onSubmit={handleUpdate}>
              <label>
                  Email:
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <br />
              <label>
                  Password:
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  required/>
              </label>
              <br />
              <button type="submit">Update</button>
              </form>
              <br />
              <button onClick={handleDelete}>Delete Account</button>
          </div>
        </Main>
        <Footer copy={'Marius'} years={'2023 04'} color={'#666666'} />
    </>
    );
}
export default MyProfile;