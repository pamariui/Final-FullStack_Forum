import React, { useEffect, useState } from 'react';
import './style.css'
import Footer from '../../components/Footer';
import Main from '../../components/Main';
import Header from '../../components/Header/Header';
import Card from '../../components/Card';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const MainPage = () => {
  const [username, setUsername] = useState('');
  const [userId, setuserId] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionId, setQuestionId] = useState([]);
  const [idForPost, setIdForPost] = useState('')
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState('');

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
        const response = await fetch('/api/v1/questions');
        if (response.status === 200) {
          const data = await response.json();
          setQuestions(data);
          
          const questionIds = data.map((question) => question.id);
          setQuestionId(questionIds);
        }
      } catch (error) {
        console.log(error);
        return error;
      }
    };
    fetchQuestions();
  }, []);

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
    
    console.log("el.id:", id);
    console.log("showAnswerForm:", showAnswerForm);
    
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
  return (
    <>
      <Header username={username} />
      <Main>
        <Link to={'/question'}>
          <Button>
            Create question
          </Button>
        </Link>
        <div>
          <h1>
            {username} Welcome to the Forum
          </h1>
          {questions.map((el, i) => {
            return (
              <div key={i} className='question'>
                <Card 
                  title={el.title}
                  category={el.category}
                  content={el.content}
                  posted={el.updated_at ? ` Updated: ${el.updated_at} `: ` Created: ${el.created_at} ` }
                  user={el.user}
                />
                {username ? (
                  <div>
                    <Button onClick={() => { handleAnswerClick(el.id); setIdForPost(el.id) }}> Answer</Button>
                    <Button>Like</Button>
                    <Button>Dislike</Button>
                  </div>
                ) : ( <>
                </>)
                }
                {showAnswerForm === el.id && (

                  <form onSubmit={handleSubmit}>
                    <textarea onChange={handleChange} value={answerContent} />
                    <Button type="submit">Submit Answer</Button>
                  </form>
                )}
                {answers.map(({ id, answers }) => {
                  if (id === el.id) {
                    return answers.map((ans, x) => (
                      <Card
                        key={x}
                        content={ans.content}
                        posted={
                          ans.updated_at
                            ? ` Updated: ${ans.updated_at} `
                            : ` Created: ${ans.created_at} `
                        }
                        user={ans.user}
                      ></Card>
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