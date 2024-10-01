import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Welcome to PreQuest</h1>
      <p>This is the main homepage for the PreQuest app.</p>
      <p>
        Use this application to prepare for job interviews with AI-generated mock interview questions.
      </p>

      {/* You can add more links to other parts of the app */}
      <p>Ready to get started? <a href="/login">Login</a> or <a href="/interview">Start an Interview</a></p>
    </div>
  );
};

export default Home;
