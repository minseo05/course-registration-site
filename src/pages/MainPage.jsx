import { useEffect, useRef, useState } from 'react';

import AppHeader from '../components/AppHeader';
import TabMenu from '../components/TabMenu';
import HomeTab from '../tabs/HomeTab';
import CourseApplyTab from '../tabs/CourseApplyTab';
import PreCartTab from '../tabs/PreCartTab';
import ApplyCheckTab from '../tabs/ApplyCheckTab';
import TimetableTab from '../tabs/TimetableTab';

import { getCourses } from '../api/courseApi';
import {
  getEnrollments,
  applyCourse as requestApplyCourse,
  cancelCourse as requestCancelCourse,
} from '../api/enrollmentApi';
import {
  getPreCart,
  addPreCart as requestAddPreCart,
  removePreCart as requestRemovePreCart,
} from '../api/preCartApi';

export default function MainPage({ student, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [preCartIds, setPreCartIds] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const messageTimer = useRef(null);

  const showMessage = (text) => {
    setMessage(text);
    window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(''), 2500);
  };

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      const [courseList, enrollmentList, preCartList] = await Promise.all([
        getCourses(),
        getEnrollments(),
        getPreCart(),
      ]);

      setCourses(courseList);
      setEnrolledCourseIds(enrollmentList.map((item) => item.courseId));
      setPreCartIds(preCartList.map((item) => item.courseId));
    } catch (error) {
      showMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const applyCourse = async (courseId) => {
    try {
      const result = await requestApplyCourse(courseId);
      showMessage(result.message || '수강신청이 완료되었습니다.');
      await loadInitialData();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const cancelCourse = async (courseId) => {
    try {
      const result = await requestCancelCourse(courseId);
      showMessage(result.message || '수강신청이 취소되었습니다.');
      await loadInitialData();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const addPreCart = async (courseId) => {
    try {
      const result = await requestAddPreCart(courseId);
      showMessage(result.message || '사전 신청함에 담았습니다.');
      await loadInitialData();
    } catch (error) {
      showMessage(error.message);
    }
  };

  const removePreCart = async (courseId) => {
    try {
      const result = await requestRemovePreCart(courseId);
      showMessage(result.message || '사전 신청함에서 삭제했습니다.');
      await loadInitialData();
    } catch (error) {
      showMessage(error.message);
    }
  };

  if (isLoading) {
    return <main className="main-page">데이터를 불러오는 중입니다.</main>;
  }

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
            onApplyAll={() => {}}
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

        {activeTab === 'timetable' && (
          <TimetableTab courses={courses} enrolledCourseIds={enrolledCourseIds} />
        )}
      </section>
    </main>
  );
}