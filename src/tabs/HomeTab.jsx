import { useEffect, useState } from 'react';
import { registrationInfo } from '../data/mockData';
import NoticeCard from '../components/NoticeCard';

function formatTime(date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export default function HomeTab() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="home-tab">
      <section className="clock-panel">
        <p className="clock-label">현재 시각</p>
        <strong className="clock-time">{formatTime(now)}</strong>
        <p className="start-time">신청 시작 시간 {registrationInfo.startTimeText}</p>
      </section>

      <div className="home-grid">
        <NoticeCard title="수강신청 기간">
          <p className="large-text">{registrationInfo.period}</p>
        </NoticeCard>

        <NoticeCard title="대상별 신청 일정">
          <div className="schedule-list">
            {registrationInfo.targetSchedule.map((item) => (
              <div key={item.target} className="schedule-item">
                <strong>{item.target}</strong>
                <span>{item.period}</span>
              </div>
            ))}
          </div>
        </NoticeCard>

        <NoticeCard title="주의사항">
          <ul className="notice-list">
            {registrationInfo.notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </NoticeCard>
      </div>
    </div>
  );
}
