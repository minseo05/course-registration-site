import { useEffect, useState } from 'react';

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import { getMe } from './api/authApi';

export default function App() {
  const isAdminPath = window.location.pathname.startsWith('/admin');

  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [isBooting, setIsBooting] = useState(!isAdminPath);

  useEffect(() => {
    if (isAdminPath) return;

    const token = localStorage.getItem('accessToken');

    if (!token) {
      setIsBooting(false);
      return;
    }

    getMe()
      .then((result) => {
        const nextStudent = result.student ?? result;
        localStorage.setItem('student', JSON.stringify(nextStudent));
        setStudent(nextStudent);
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('student');
        setStudent(null);
      })
      .finally(() => {
        setIsBooting(false);
      });
  }, [isAdminPath]);

const handleLoginSuccess = (result) => {
  const token = result.token ?? result.accessToken ?? result.jwt;
  const nextStudent = result.student ?? result.user ?? result.profile;

  if (!token || !nextStudent) {
    throw new Error('로그인 응답 형식이 올바르지 않습니다.');
  }

  localStorage.setItem('accessToken', token);
  localStorage.setItem('student', JSON.stringify(nextStudent));
  setStudent(nextStudent);
};

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('student');
    setStudent(null);
  };

const handleAdminLoginSuccess = (result) => {
  const token = result.token ?? result.accessToken ?? result.jwt;
  const nextAdmin = result.admin ?? result.user ?? result.profile;

  if (!token || !nextAdmin) {
    throw new Error('관리자 로그인 응답 형식이 올바르지 않습니다.');
  }

  localStorage.setItem('adminAccessToken', token);
  localStorage.setItem('admin', JSON.stringify(nextAdmin));
  setAdmin(nextAdmin);
};

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  if (isAdminPath) {
    return admin ? (
      <AdminPage admin={admin} onLogout={handleAdminLogout} />
    ) : (
      <AdminLoginPage onLogin={handleAdminLoginSuccess} />
    );
  }

  if (isBooting) {
    return <main className="main-page">로그인 상태를 확인하는 중입니다.</main>;
  }

  return student ? (
    <MainPage student={student} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLoginSuccess} />
  );
}