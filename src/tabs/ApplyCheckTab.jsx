import CourseTable from '../components/CourseTable';
import { getTotalCredits } from '../utils/courseRules';

export default function ApplyCheckTab({ courses, student, enrolledCourseIds, preCartIds, onCancel }) {
  const enrolledCourses = enrolledCourseIds
    .map((id) => courses.find((course) => course.id === id))
    .filter(Boolean);
  const credits = getTotalCredits(enrolledCourseIds, courses);

  return (
    <div className="content-panel">
      <div className="section-title-row">
        <div>
          <h2>신청 확인</h2>
          <p>실제로 신청 완료된 과목만 표시됩니다.</p>
        </div>
        <div className="summary-cards compact">
          <div>
            <span>신청 과목</span>
            <strong>{enrolledCourses.length}개</strong>
          </div>
          <div>
            <span>신청 학점</span>
            <strong>{credits} / {student.maxCredits}</strong>
          </div>
        </div>
      </div>

      <CourseTable
        courses={enrolledCourses}
        allCourses={courses}
        enrolledCourseIds={enrolledCourseIds}
        preCartIds={preCartIds}
        student={student}
        onApply={() => {}}
        onCancel={onCancel}
        onAddPreCart={() => {}}
        onRemovePreCart={() => {}}
        showPreCartAction={false}
        emptyMessage="신청 완료된 과목이 없습니다."
      />
    </div>
  );
}
