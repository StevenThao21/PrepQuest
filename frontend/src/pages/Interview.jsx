import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';  // Ensure constants are imported

const Interview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responseText, setResponseText] = useState('');
  const [interviewSessionId, setInterviewSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const startInterview = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      console.log("Access Token: ", accessToken);  // Debugging

      if (!accessToken) {
        setError('No access token found. Please log in.');
        return;
      }

      try {
        console.log("Starting Interview API Call...");
        const res = await axios.post('http://127.0.0.1:8000/api/interview/start/', {}, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        console.log("Interview Session Response: ", res.data); // Debugging

        setInterviewSessionId(res.data.interview_session);  // Store interview session ID
        setQuestions(res.data.questions);  // Load questions
      } catch (err) {
        if (err.response) {
          console.error('Server Error:', err.response.data);  // Server errors
        } else if (err.request) {
          console.error('No response received:', err.request);  // No response from server
        } else {
          console.error('Error during request:', err.message);  // Client-side errors
        }
        setError('Failed to start interview. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    startInterview();  // Start the interview when component mounts
  }, []);

  // Function to submit response
  const submitResponse = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/response/', {
        interview_session: interviewSessionId,
        question: currentQuestion.id,
        response_text: responseText,
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Response submitted:', res.data);
      setResponseText('');  // Clear the response input

      // Move to the next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        alert('Interview completed!');
        navigate('/dashboard');  // Redirect to dashboard when finished
      }
    } catch (err) {
      setError('Failed to submit response. Please try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Mock Interview</h1>

      {loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : questions.length > 0 ? (
        <div>
          <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
          <p>{questions[currentQuestionIndex].text}</p>

          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Type your response here..."
          ></textarea>

          <button onClick={submitResponse}>Submit Response</button>
        </div>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default Interview;
