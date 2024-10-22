import React, { useState, useEffect } from 'react';
import axios from 'axios';
// assuming this is another file
// import Stepper from "./components/Stepper/Stepper"; // assuming this is another file
import './AuthFromStudent.css';
import Stepper from '../Stepper/stepper';

const AuthFromStudent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    if (token) {
      const storedStudentData = JSON.parse(localStorage.getItem('studentData')) || {};
      setStudentData(storedStudentData);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7253/api/Account/registerAutomaticallyAndLoginAutomatically', {
        email,
        password,
      });

      const { token, userId, codeUIR, firstName, lastName } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('studentData', JSON.stringify({ userId, codeUIR, firstName, lastName }));

      setStudentData({ userId, codeUIR, firstName, lastName });
    } catch (error) {
      setErrorMessage(error.response?.data?.Message || 'Registration/Login failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setStudentData(null);
    setEmail('');
    setPassword('');
    localStorage.removeItem('token');
    localStorage.removeItem('studentData');
  };

  return (
    <div className="container">
      {!token ? (
        <div>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      ) : (
        <div>
          {/* Navbar to show user info and logout */}
          <div className="navbar">
            <p>Welcome, {studentData.firstName} {studentData.lastName}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* Pass token and skip the token step in Stepper */}
          <Stepper
            token={token}
            skipTokenStep={true}
          />

        </div>
      )}
    </div>
  );
};

export default AuthFromStudent;
