import React, { useEffect, useState } from 'react';
import './style.css'
import Footer from '../../components/Footer';
import Main from '../../components/Main';
import Header from '../../components/Header/Header';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import * as TfiIcons from "react-icons/tfi";
import Button from '../../components/Button';
import Likes from '../../components/Likes';

const MainPage = () => {
  const [username, setUsername] = useState('');
  const [userId, setuserId] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionId, setQuestionId] = useState([]);
  const [idForPost, setIdForPost] = useState('')
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [filter, setFilter] = useState('all')
  
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc'); 

  useEffect(() => {
    fetch(`/api/v1/questions?sortBy=${sortBy}&sortOrder=${sortOrder}`)
      .then(res => res.json())
      .then(data => setQuestions(data),
      console.log(`/api/v1/questions?sortBy=${sortBy}&sortOrder=${sortOrder}`))
      .catch(err => console.error(err));
  }, [sortBy,sortOrder]);

  const handleSortByChange = (event) => {
    const selectedValue = event.target.value;
    const isDescending = selectedValue.startsWith("-");
    const sortKey = isDescending ? selectedValue.slice(1) : selectedValue;
    const order = isDescending ? 'desc' : 'asc';
    setSortOrder(order);
    setSortBy(sortKey);
  };
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
          // window.location.href = '/login';
        }
      } else {
        // window.location.href = '/login';
      }
    };

    setTimeout(() => {
      checkToken();
    }, 300);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let url = '/api/v1/questions';

        if(filter !== 'all') {
          url+= `/answers/${encodeURIComponent(filter)}`;
        } 
         
        console.log(url)
        const response = await fetch(url);
        if (response.status === 200) {
          const data = await response.json();
          setQuestions(data);
          console.log(data)
          const questionIds = data.map((question) => question.id);
          setQuestionId(questionIds);
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    fetchQuestions();
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    const fetchAnswers = async (id) => {
      try {
        const response = await fetch(`/api/v1/questions/${id}/answer/`);
        if (response.status === 200) {
          const data = await response.json();
          setAnswers((prevAnswers) => {
            // Filter out the answers that belong to the question that was just answered
            const filteredAnswers = prevAnswers.filter((answer) => answer.id !== id);
            // Append the new answers to the filtered array
            return [...filteredAnswers, { id, answers: data }];
          });
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };
  
    // Fetch answers for each question
    questionId.forEach((id) => fetchAnswers(id));
  
    // refetch answers after submitting new answer
    if (idForPost) {
      fetchAnswers(idForPost);
    }
  }, [questionId, idForPost]);

  const handleAnswerClick = (id) => {
    if (id === showAnswerForm) {
      setShowAnswerForm(null);
    } else {
      setShowAnswerForm(id);
    }
  };

  const handleChange = (event) => {
    setAnswerContent(event.target.value);
    
  }

  const handleSubmit = async (event, id) => {
    event.preventDefault();

    
    const response = await fetch(`/api/v1/question/${idForPost}/answer/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: answerContent,
        user_id: userId
      })
    });
    const data = await response.json();

    // Add the new answer to the list of answers
    setAnswers((prevAnswers) => [...prevAnswers, { id, answers: data }]);
    
    // Reset the answer form
    setShowAnswerForm(false);
    setAnswerContent('');
    window.location.reload()
  }

  const handleDeleteAnswer = async (event, id) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/v1/question/answers/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log('Answer deleted successfully');
        window.location.reload();
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      // window.location.href = '/login';
    }
  };
  const handleEditAnswer = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    try {
      const response = await fetch(`/api/v1/question/answers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAnswerContent(data.content);
        setEditingAnswer(id);
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      // window.location.href = '/login';
    }
  };
  
  
  const handleSaveAnswer = async (id) => {
    const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
    try {
      const response = await fetch(`/api/v1/question/answers/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: answerContent
        }),
      });
      if (response.ok) {
        setEditingAnswer(null);
        console.log('Answer updated successfully');
        window.location.reload();
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      // window.location.href = '/login';
    }
  };
  return (
    <>
      <Header username={username} />
      <Main>
        <div className='filter-bar'>
          <div className='sorting'>
            <label htmlFor="sort-by">Sort By:</label>
            <select id="sort-by" value={'sortBy'} onChange={handleSortByChange}>
              <option>Select sorting </option>
              <option value="created_at">Date Created - Ascending</option>
              <option value="-created_at">Date Created - Descending</option>
            </select>
          </div>
          <div className='filtering'>
            <label htmlFor="filter">Filters: </label>
            <select value={filter} onChange={handleFilterChange}>
              <option value="">Choose filter</option>
              <option value="all">All Questions</option>
              <option value="without">Unanswered Questions</option>
              <option value="with">Answered Questions</option>
            </select>
          </div>
          <div className='create-question-btn'>
            <Link to={'/question'}>
              <Button 
                buttonClass={'create'}
              >
                <div >
                  <TfiIcons.TfiPlus className='create-icon'/>
                </div>
                  <p>Create question</p> 
                </Button>
            </Link>
          </div>
        </div>
        <div>
          { questions.length > 0 && questions.map((el, i) => {
            return (
              <div key={i} cardClass={'question'} className='question-card'>
                <Card 
                  title={el.title}
                  category={el.category}
                  content={el.content}
                  posted={el.updated_at ? ` Updated: ${el.updated_at} `: ` Created: ${el.created_at} ` }
                  user={el.user}
                  cardClass={'card question'}
                >
                {username ? (
                  <div className='card-btns'>
                    <Button onClick={() => { handleAnswerClick(el.id); setIdForPost(el.id) }}> Answer</Button>
                    <Likes type={'question'} itemId={el.id} userId={userId} />
                  </div>
                ) : ( <>
                </>)
                }
                {showAnswerForm === el.id && (

                  <form onSubmit={handleSubmit} className='answer-form'>
                    <textarea onChange={handleChange} value={answerContent} />
                    <Button type="submit">Submit Answer</Button>
                  </form>
                )}
                </Card>
                {answers.map(({ id, answers }) => {
                  
                  if (id === el.id) {
                    return answers.map((ans, x) => (
                      
                      <div key={x} className='answer-card'>
                        <Card
                          content= {editingAnswer === ans.id ? (
                              <textarea 
                                value={answerContent}
                                onChange={(e) => setAnswerContent(e.target.value)} 
                              />
                          ) : ans.content}
                          posted={
                            ans.updated_at ? `Updated: ${ans.updated_at}` :
                                             `Created: ${ans.created_at}`
                          }
                          user={ans.user}
                          cardClass={'card answer'}
                        >
                          { username && (
                            <div className='card-btns'>
                              {editingAnswer === ans.id ? (
                                <div>
                                  <Button onClick={() => handleSaveAnswer(ans.id)}>Save</Button>
                                  <Button onClick={() => setEditingAnswer(null)}>Cancel</Button>
                                </div>
                              ) : (
                                <>
                                  {username === ans.user && (
                                    <div>
                                      <Button onClick={() => handleEditAnswer(ans.id)}>Edit</Button>
                                      <Button onClick={(event) => handleDeleteAnswer(event, ans.id)}>Delete</Button>
                                    </div>
                                  )}
                                  <Likes type={'answer'} itemId={ans.id} userId={userId} />

                                </>
                              )}
                            </div>
                          )}
                        </Card>
                      </div>
                    ));
                  }
                  return null;
                })}
              </div>
            );
          })}
        </div>
      </Main>
      <Footer copy={'Marius'} years={'2023 04'} color={'#666666'} />
    </>
  );
}
export default MainPage;