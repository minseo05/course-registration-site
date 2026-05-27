import { getScheduleCell } from '../utils/courseRules';

const days = ['월', '화', '수', '목', '금'];
const periods = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TimetableTab({ courses, enrolledCourseIds }) {
  return (
    <div className="content-panel">
      <div className="section-title-row">
        <div>
          <h2>시간표</h2>
          <p>신청/취소 결과가 자동으로 반영됩니다.</p>
        </div>
      </div>

      <div className="timetable-wrap">
        <table className="timetable">
          <thead>
            <tr>
              <th>교시</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period}>
                <th>{period}교시</th>
                {days.map((day) => {
                  const course = getScheduleCell(day, period, enrolledCourseIds, courses);
                  return (
                    <td key={`${day}-${period}`} className={course ? 'filled-cell' : ''}>
                      {course && (
                        <div className="schedule-block">
                          <strong>{course.name}</strong>
                          <span>{course.classroom}</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
