import { useMemo, useState } from 'react';
import CourseTable from '../components/CourseTable';
import { departments, grades } from '../data/mockData';
import { getUnavailableReason } from '../utils/courseRules';

export default function CourseApplyTab({
  courses,
  student,
  enrolledCourseIds,
  preCartIds,
  onApply,
  onCancel,
  onAddPreCart,
  onRemovePreCart,
}) {
  const [courseType, setCourseType] = useState('ALL');
  const [keyword, setKeyword] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [grade, setGrade] = useState('ALL');
  const [sort, setSort] = useState('name');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [excludeConflict, setExcludeConflict] = useState(false);

  const filteredCourses = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return courses
      .filter((course) => courseType === 'ALL' || course.type === courseType)
      .filter((course) => department === 'ALL' || course.department === department)
      .filter((course) => grade === 'ALL' || String(course.grade) === grade)
      .filter((course) => {
        if (!normalizedKeyword) return true;
        return [course.code, course.name, course.professor, course.timeText]
          .join(' ')
          .toLowerCase()
          .includes(normalizedKeyword);
      })
      .filter((course) => {
        if (!availableOnly && !excludeConflict) return true;
        const reason = getUnavailableReason(course, enrolledCourseIds, courses, student.maxCredits);
        if (availableOnly) return !reason || enrolledCourseIds.includes(course.id);
        if (excludeConflict) return reason !== '이미 신청한 과목과 시간이 겹칩니다.';
        return true;
      })
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name, 'ko');
        if (sort === 'capacity') return b.capacity - b.appliedCount - (a.capacity - a.appliedCount);
        if (sort === 'preApplied') return b.preAppliedCount - a.preAppliedCount;
        return a.code.localeCompare(b.code);
      });
  }, [availableOnly, courseType, courses, department, enrolledCourseIds, excludeConflict, grade, keyword, sort, student.maxCredits]);

  return (
    <div className="content-panel">
      <div className="section-title-row">
        <div>
          <h2>수강신청</h2>
          <p>교양/전공을 선택하고 과목을 검색한 뒤 신청하세요.</p>
        </div>
      </div>

      <section className="search-panel">
        <div className="radio-group" aria-label="이수 구분">
          <span>이수 구분</span>
          <label>
            <input
              type="radio"
              name="courseType"
              value="ALL"
              checked={courseType === 'ALL'}
              onChange={(event) => setCourseType(event.target.value)}
            />
            전체
          </label>
          <label>
            <input
              type="radio"
              name="courseType"
              value="MAJOR"
              checked={courseType === 'MAJOR'}
              onChange={(event) => setCourseType(event.target.value)}
            />
            전공
          </label>
          <label>
            <input
              type="radio"
              name="courseType"
              value="GENERAL"
              checked={courseType === 'GENERAL'}
              onChange={(event) => setCourseType(event.target.value)}
            />
            교양
          </label>
        </div>

        <div className="search-grid">
          <label>
            과목명/코드/교수
            <input
              value={keyword}
              placeholder="예: 자료구조, CS101"
              onChange={(event) => setKeyword(event.target.value)}
            />
          </label>
          <label>
            학과
            <select value={department} onChange={(event) => setDepartment(event.target.value)}>
              {departments.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            학년
            <select value={grade} onChange={(event) => setGrade(event.target.value)}>
              {grades.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            정렬
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="name">과목명순</option>
              <option value="code">과목코드순</option>
              <option value="capacity">잔여석 많은순</option>
              <option value="preApplied">예비인원 많은순</option>
            </select>
          </label>
        </div>

        <div className="option-row">
          <label>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(event) => setAvailableOnly(event.target.checked)}
            />
            신청가능만 보기
          </label>
          <label>
            <input
              type="checkbox"
              checked={excludeConflict}
              onChange={(event) => setExcludeConflict(event.target.checked)}
            />
            시간중복 제외
          </label>
        </div>
      </section>

      <CourseTable
        courses={filteredCourses}
        allCourses={courses}
        enrolledCourseIds={enrolledCourseIds}
        preCartIds={preCartIds}
        student={student}
        onApply={onApply}
        onCancel={onCancel}
        onAddPreCart={onAddPreCart}
        onRemovePreCart={onRemovePreCart}
      />
    </div>
  );
}
