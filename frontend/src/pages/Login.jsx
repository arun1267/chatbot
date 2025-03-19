import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // New state for error messages
  const navigate = useNavigate();
  
  console.log('Login component rendered');

  // Remove the automatic navigation that might be causing issues
  // useEffect(() => {
  //   navigate("/dashboard");
  // }, [navigate]);
  
  // Add a check for existing authentication
  useEffect(() => {
    console.log('Login useEffect running');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    console.log('Is authenticated:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('User is already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Read the data.json file to check credentials
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          dataPath: "C:\\Users\\sudar\\OneDrive\\Desktop\\chatbot-master\\frontend\\src\\pages\\data.json"
        })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        if (data.error === 'EMAIL_NOT_FOUND') {
          setError('This email is not registered. Please sign up first.');
        } else if (data.error === 'INVALID_PASSWORD') {
          setError('Password is incorrect. Please try again.');
        } else {
          setError('Login failed. Please check your credentials.');
        }
        return;
      }

      // If credentials are valid
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      setError('Error during login. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login</h2>
        {error && ( // Display error message if exists
          <div className="error-message" style={{ 
            color: 'red', 
            marginBottom: '10px',
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:border-purple-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:border-purple-500"
            />
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
        <p className='p-2 text-center text-black'>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;