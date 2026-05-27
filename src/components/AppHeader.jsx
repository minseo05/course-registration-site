import { registrationInfo } from '../data/mockData';
import UserSummary from './UserSummary';

export default function AppHeader({ student, enrolledCourseIds, courses, onLogout }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">{registrationInfo.schoolName}</p>
        <h1>{registrationInfo.title}</h1>
      </div>
      <div className="header-right">
        <UserSummary student={student} enrolledCourseIds={enrolledCourseIds} courses={courses} />
        <button className="ghost-button" type="button" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
}
