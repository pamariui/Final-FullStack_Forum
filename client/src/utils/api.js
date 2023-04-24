export const fetchQuestions = async (sortBy, sortOrder, filter) => {
    const url = `/api/v1/questions?sortBy=${sortBy}&sortOrder=${sortOrder}&filter=${filter}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export const fetchAnswers = async (questionId) => {
    const url = `/api/v1/questions/${questionId}/answer/`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export const postAnswer = async (questionId, answerContent, userId) => {
    const url = `/api/v1/question/${questionId}/answer/`;
    try {
      const response = await fetch(url, {
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
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export const deleteAnswer = async (answerId) => {
    const url = `/api/v1/question/answers/${answerId}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/v1/verify', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error('User not authorized');
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
  };
  