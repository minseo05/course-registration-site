import CourseTable from '../components/CourseTable';

export default function PreCartTab({
  courses,
  student,
  enrolledCourseIds,
  preCartIds,
  onApply,
  onCancel,
  onRemovePreCart,
}) {
  const preCartCourses = preCartIds
    .map((id) => courses.find((course) => course.id === id))
    .filter(Boolean);

  return (
    <div className="content-panel">
      <div className="section-title-row">
        <div>
          <h2>사전 신청함</h2>
          <p>신청 시작 전에 관심 과목을 미리 담아두고, 실제 신청 시 빠르게 확인할 수 있습니다.</p>
        </div>
        <button className="primary-button" type="button" onClick={onApplyAll} disabled={preCartCourses.length === 0}>
          전체 신청
        </button>
      </div>

      <div className="info-strip">
        사전 신청함에 담긴 과목은 실제 신청된 과목이 아닙니다. 신청 버튼을 눌러야 최종 신청됩니다.
      </div>

      <CourseTable
        courses={preCartCourses}
        allCourses={courses}
        enrolledCourseIds={enrolledCourseIds}
        preCartIds={preCartIds}
        student={student}
        onApply={onApply}
        onCancel={onCancel}
        onAddPreCart={() => {}}
        onRemovePreCart={onRemovePreCart}
        emptyMessage="사전 신청함에 담긴 과목이 없습니다."
      />
    </div>
  );
}
