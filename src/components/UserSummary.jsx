import { getTotalCredits } from '../utils/courseRules';

export default function UserSummary({ student, enrolledCourseIds, courses }) {
  const credits = getTotalCredits(enrolledCourseIds, courses);

  return (
    <section className="user-summary" aria-label="사용자 신청 요약">
      <div>
        <strong>{student.name}</strong>
        <span>{student.department}</span>
        <span>{student.grade}학년</span>
      </div>
      <div className="credit-pill">
        신청학점 <strong>{credits}</strong> / {student.maxCredits}
      </div>
    </section>
  );
}
