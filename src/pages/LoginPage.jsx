import { useState } from 'react';
import { registrationInfo } from '../data/mockData';
import { login } from '../api/authApi';

export default function LoginPage({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage('');

      const result = await login(studentId, password);

      onLogin(result);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div>
          <p className="eyebrow">{registrationInfo.schoolName}</p>
          <h1>{registrationInfo.title}</h1>
          <p className="login-description">
            신청 기간과 학년별 일정을 확인한 뒤 로그인하세요.
          </p>
        </div>

        <div className="period-panel">
          <strong>수강신청 기간</strong>
          <span>{registrationInfo.period}</span>
        </div>

        <div className="target-grid">
          {registrationInfo.targetSchedule.map((item) => (
            <div key={item.target} className="target-card">
              <strong>{item.target}</strong>
              <span>{item.period}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="login-card">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <label>
            학번
            <input 
              value={studentId} 
              onChange={(event) => setStudentId(event.target.value)} 
              placeholder='학번을 입력하세요'
              required  
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="primary-button wide" type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="notice-box">
          <strong>공지사항</strong>
          <ul>
            {registrationInfo.notices.slice(0, 3).map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
