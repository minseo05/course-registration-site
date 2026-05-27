import { useRef, useState } from 'react';
import AppHeader from '../components/AppHeader';
import TabMenu from '../components/TabMenu';
import HomeTab from '../tabs/HomeTab';
import CourseApplyTab from '../tabs/CourseApplyTab';
import PreCartTab from '../tabs/PreCartTab';
import ApplyCheckTab from '../tabs/ApplyCheckTab';
import TimetableTab from '../tabs/TimetableTab';
import { courses, student } from '../data/mockData';
import { canApplyCourse } from '../utils/courseRules';

export default function MainPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(['CS101-01', 'CS201-02']);
  const [preCartIds, setPreCartIds] = useState(['CS330-01', 'LIB210-03']);
  const [message, setMessage] = useState('');
  const messageTimer = useRef(null);

  const showMessage = (text) => {
    setMessage(text);
    window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(''), 2500);
  };

  const applyCourse = (courseId) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return;

    if (!canApplyCourse(course, enrolledCourseIds, courses, student.maxCredits)) {
      showMessage('신청할 수 없는 과목입니다. 불가 사유를 확인하세요.');
      return;
    }

    setEnrolledCourseIds((prev) => [...prev, courseId]);
    showMessage(`${course.name} 과목이 신청되었습니다.`);
  };

  const cancelCourse = (courseId) => {
    const course = courses.find((item) => item.id === courseId);
    setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
    showMessage(`${course?.name ?? '선택 과목'} 신청이 취소되었습니다.`);
  };

  const addPreCart = (courseId) => {
    const course = courses.find((item) => item.id === courseId);
    setPreCartIds((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]));
    showMessage(`${course?.name ?? '선택 과목'}이 사전 신청함에 담겼습니다.`);
  };

  const removePreCart = (courseId) => {
    const course = courses.find((item) => item.id === courseId);
    setPreCartIds((prev) => prev.filter((id) => id !== courseId));
    showMessage(`${course?.name ?? '선택 과목'}이 사전 신청함에서 삭제되었습니다.`);
  };

  const applyAllPreCart = () => {
    const targetCourses = preCartIds
      .map((id) => courses.find((course) => course.id === id))
      .filter(Boolean);

    let nextIds = [...enrolledCourseIds];
    let appliedCount = 0;

    targetCourses.forEach((course) => {
      if (!nextIds.includes(course.id) && canApplyCourse(course, nextIds, courses, student.maxCredits)) {
        nextIds.push(course.id);
        appliedCount += 1;
      }
    });

    setEnrolledCourseIds(nextIds);
    showMessage(`${appliedCount}개 과목이 신청되었습니다.`);
  };

  return (
    <main className="main-page">
      <AppHeader
        student={student}
        enrolledCourseIds={enrolledCourseIds}
        courses={courses}
        onLogout={onLogout}
      />
      <TabMenu activeTab={activeTab} onChange={setActiveTab} />

      {message && <div className="toast">{message}</div>}

      <section className="tab-content">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'course' && (
          <CourseApplyTab
            courses={courses}
            student={student}
            enrolledCourseIds={enrolledCourseIds}
            preCartIds={preCartIds}
            onApply={applyCourse}
            onCancel={cancelCourse}
            onAddPreCart={addPreCart}
            onRemovePreCart={removePreCart}
          />
        )}
        {activeTab === 'preCart' && (
          <PreCartTab
            courses={courses}
            student={student}
            enrolledCourseIds={enrolledCourseIds}
            preCartIds={preCartIds}
            onApply={applyCourse}
            onCancel={cancelCourse}
            onRemovePreCart={removePreCart}
            onApplyAll={applyAllPreCart}
          />
        )}
        {activeTab === 'check' && (
          <ApplyCheckTab
            courses={courses}
            student={student}
            enrolledCourseIds={enrolledCourseIds}
            preCartIds={preCartIds}
            onCancel={cancelCourse}
          />
        )}
        {activeTab === 'timetable' && <TimetableTab courses={courses} enrolledCourseIds={enrolledCourseIds} />}
      </section>
    </main>
  );
}
