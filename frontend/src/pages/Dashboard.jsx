import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';  // Import token keys
import api from '../api';  // Assuming api is your axios instance

const Dashboard = () => {
  const [questions, setQuestions] = useState([]);  // State to store fetched questions
  const [loading, setLoading] = useState(true);    // State to track loading
  const [error, setError] = useState(null);        // State to track errors
  console.log("Access Token on page load:", localStorage.getItem(ACCESS_TOKEN));

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (!accessToken) {
      setError('No access token found. Please log in again.');
      setLoading(false);
      return;
    }

    // Function to refresh token if it's expired
    const refreshToken = async () => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        setError('No refresh token found. Please log in again.');
        return;
      }
      try {
        const res = await api.post("/api/token/refresh/", {
          refresh: refreshToken,
        });
        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          fetchQuestions(res.data.access);  // Retry fetching questions with the new token
        } else {
          setError('Failed to refresh token. Please log in again.');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        setError('Failed to refresh token. Please log in again.');
      }
    };

    // Function to fetch questions from the backend
    const fetchQuestions = async (token) => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/questions/', {
          headers: {
            'Authorization': `Bearer ${token}`  // Pass the access token in the headers
          }
        });
        setQuestions(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // If unauthorized, attempt to refresh the token
          console.log('Token expired. Attempting to refresh...');
          refreshToken();  // Try refreshing the token
        } else {
          console.error('Error fetching questions:', error);
          setError('Failed to load interview questions. Please try again.');
        }
      } finally {
        setLoading(false);  // Stop the loading state
      }
    };

    fetchQuestions(accessToken);  // Call the function to fetch questions
  }, []);

  return (
    <div>
      <h1>Welcome to PreQuest</h1>
      <p>This is the main Dashboard page for the PreQuest app.</p>
      <p>Use this application to prepare for job interviews with AI-generated mock interview questions.</p>
      <Link to="/login">Logout</Link>
      <Link to="/interview">Start Mock Interview</Link>

      <h2>Interview Questions</h2>

      {loading ? (
        <p>Loading questions...</p>  // Show loading state
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>  // Show error message
      ) : (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>{question.text}</li>  // Display each question
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
