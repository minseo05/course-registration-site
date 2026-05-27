import { useState } from 'react';
import { registrationInfo } from '../data/mockData';

export default function LoginPage({ onLogin }) {
  const [studentId, setStudentId] = useState('20261234');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin({ studentId });
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
            <input value={studentId} onChange={(event) => setStudentId(event.target.value)} />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="데모에서는 입력하지 않아도 됩니다"
            />
          </label>
          <button className="primary-button wide" type="submit">
            로그인
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
