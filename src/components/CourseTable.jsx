import CourseStatusButton from './CourseStatusButton';
import { getUnavailableReason, typeLabel } from '../utils/courseRules';

export default function CourseTable({
  courses,
  allCourses,
  enrolledCourseIds,
  preCartIds,
  student,
  onApply,
  onCancel,
  onAddPreCart,
  onRemovePreCart,
  showPreCartAction = true,
  emptyMessage = '표시할 과목이 없습니다.',
}) {
  return (
    <div className="table-wrap">
      <table className="course-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>과목코드</th>
            <th>과목명</th>
            <th>분반</th>
            <th>교수</th>
            <th>학점</th>
            <th>시간</th>
            <th>강의실</th>
            <th>정원</th>
            <th>신청</th>
            <th>예비</th>
            <th>상태</th>
            {showPreCartAction && <th>사전 신청함</th>}
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan={showPreCartAction ? 13 : 12} className="empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            courses.map((course) => {
              const isEnrolled = enrolledCourseIds.includes(course.id);
              const isPreCart = preCartIds.includes(course.id);
              const reason = getUnavailableReason(
                course,
                enrolledCourseIds,
                allCourses ?? courses,
                student.maxCredits,
              );

              return (
                <tr key={course.id} className={isEnrolled ? 'row-enrolled' : ''}>
                  <td>
                    <span className={`type-badge ${course.type.toLowerCase()}`}>{typeLabel[course.type]}</span>
                  </td>
                  <td>{course.code}</td>
                  <td className="course-name">{course.name}</td>
                  <td>{course.section}</td>
                  <td>{course.professor}</td>
                  <td>{course.credits}</td>
                  <td>{course.timeText}</td>
                  <td>{course.classroom}</td>
                  <td>{course.capacity}</td>
                  <td>{course.appliedCount}</td>
                  <td>{course.preAppliedCount}</td>
                  <td>
                    <CourseStatusButton
                      course={course}
                      isEnrolled={isEnrolled}
                      reason={reason}
                      onApply={onApply}
                      onCancel={onCancel}
                    />
                  </td>
                  {showPreCartAction && (
                    <td>
                      {isPreCart ? (
                        <button className="line-button small" type="button" onClick={() => onRemovePreCart(course.id)}>
                          삭제
                        </button>
                      ) : (
                        <button className="secondary-button small" type="button" onClick={() => onAddPreCart(course.id)}>
                          담기
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
