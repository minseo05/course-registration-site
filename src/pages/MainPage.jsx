import { useEffect, useRef, useState } from 'react';

import AppHeader from '../components/AppHeader';
import TabMenu from '../components/TabMenu';
import HomeTab from '../tabs/HomeTab';
import CourseApplyTab from '../tabs/CourseApplyTab';
import PreCartTab from '../tabs/PreCartTab';
import ApplyCheckTab from '../tabs/ApplyCheckTab';
import TimetableTab from '../tabs/TimetableTab';
import { getRegistrationInfo } from '../api/registrationApi';
import { getTimetable } from '../api/timetableApi';

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

function unwrapList(response, keys = []) {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== 'object') return [];

  for (const key of keys) {
    if (Array.isArray(response[key])) return response[key];
  }

  for (const key of ['data', 'result', 'payload']) {
    const value = response[key];

    if (Array.isArray(value)) return value;

    if (value && typeof value === 'object') {
      const nested = unwrapList(value, keys);
      if (nested.length > 0) return nested;
    }
  }

  return Object.values(response).find(Array.isArray) ?? [];
}

function pickCourseId(item) {
  if (!item) return null;
  if (typeof item === 'string' || typeof item === 'number') return String(item);

  return (
    item.courseId ??
    item.course_id ??
    item.course?.id ??
    item.course?.courseId ??
    item.id ??
    null
  );
}


export default function MainPage({ student, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [preCartIds, setPreCartIds] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [registrationInfo, setRegistrationInfo] = useState(null);
  const [timetable, setTimetable] = useState(null);

  const messageTimer = useRef(null);

  const showMessage = (text) => {
    setMessage(text);
    window.clearTimeout(messageTimer.current);
    messageTimer.current = window.setTimeout(() => setMessage(''), 2500);
  };

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      const [
        courseResult,
        enrollmentResult,
        preCartResult,
        registrationResult,
        timetableResult,
      ] = await Promise.allSettled([
        getCourses(),
        getEnrollments(),
        getPreCart(),
        getRegistrationInfo(),
        getTimetable(),
      ]);

      const failedMessages = [];

      if (courseResult.status === 'fulfilled') {
        const courseItems = unwrapList(courseResult.value, [
          'courses',
          'items',
          'data',
          'results',
        ]);

        setCourses(courseItems);
      } else {
        failedMessages.push('강의 목록');
      }

      if (enrollmentResult.status === 'fulfilled') {
        const enrollmentItems = unwrapList(enrollmentResult.value, [
          'enrollments',
          'enrolledCourses',
          'courses',
          'items',
          'data',
          'results',
        ]);

        setEnrolledCourseIds(
          enrollmentItems.map(pickCourseId).filter(Boolean)
        );
      } else {
        failedMessages.push('신청 내역');
      }

      if (preCartResult.status === 'fulfilled') {
        const preCartItems = unwrapList(preCartResult.value, [
          'preCart',
          'preCartItems',
          'cart',
          'courses',
          'items',
          'data',
          'results',
        ]);

        setPreCartIds(
          preCartItems.map(pickCourseId).filter(Boolean)
        );
      } else {
        failedMessages.push('사전 신청함');
      }

      if (registrationResult.status === 'fulfilled') {
        setRegistrationInfo(registrationResult.value);
      } else {
        failedMessages.push('수강신청 정보');
      }

      if (timetableResult.status === 'fulfilled') {
        setTimetable(timetableResult.value);
      } else {
        failedMessages.push('시간표');
      }

      if (failedMessages.length > 0) {
        showMessage(`${failedMessages.join(', ')}을 불러오지 못했습니다.`);
      }
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
        {activeTab === 'home' && <HomeTab registrationInfo={registrationInfo} />}

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
          <TimetableTab
            courses={courses}
            enrolledCourseIds={enrolledCourseIds}
            timetable={timetable}
          />
        )}
      </section>
    </main>
  );
}