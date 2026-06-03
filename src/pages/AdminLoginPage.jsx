import { useState } from 'react';
import { adminLogin } from '../api/adminApi';

export default function AdminLoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      setMessage('');

      const result = await adminLogin(username, password);
      onLogin(result);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>관리자 로그인</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            관리자 ID
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="관리자 ID를 입력하세요"
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

          {message && <p className="error-message">{message}</p>}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </section>
    </main>
  );
}