import { useState } from 'react';

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

export default function App() {
  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('student');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = ({ token, student }) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('student', JSON.stringify(student));
    setStudent(student);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('student');
    setStudent(null);
  };

  return student ? (
    <MainPage student={student} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLoginSuccess} />
  );
}