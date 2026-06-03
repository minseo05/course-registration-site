import { useEffect, useState } from 'react';
import {
  adminCreateCourse,
  adminCreateRegistrationWindow,
  adminCreateStudent,
  adminDeleteCourse,
  adminDeleteRegistrationWindow,
  adminDeleteStudent,
  adminListCourses,
  adminListRegistrationWindows,
  adminListStudents,
  adminPatchCourse,
  adminPatchRegistrationWindow,
  adminPatchStudent,
} from '../api/adminApi';

const emptyCourse = {
  courseId: '',
  name: '',
  professor: '',
  department: '',
  type: 'MAJOR',
  grade: 1,
  credits: 3,
  capacity: 30,
  classroom: '',
  timeText: '',
};

const emptyStudent = {
  studentId: '',
  password: '',
  name: '',
  department: '',
  grade: 1,
  maxCredits: 18,
};

const emptyWindow = {
  id: '',
  name: '',
  targetGrade: 1,
  startsAt: '',
  endsAt: '',
};

function JsonEditor({ value, onChange }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  const handleChange = (event) => {
    const nextText = event.target.value;
    setText(nextText);

    try {
      onChange(JSON.parse(nextText));
    } catch {
      // JSON 입력 중 문법이 잠시 깨지는 경우는 무시
    }
  };

  return (
    <textarea
      value={text}
      onChange={handleChange}
      rows={8}
      style={{
        width: '100%',
        padding: 12,
        borderRadius: 8,
        border: '1px solid #ddd',
        fontFamily: 'monospace',
      }}
    />
  );
}

export default function AdminPage({ admin, onLogout }) {
  const [tab, setTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [windows, setWindows] = useState([]);
  const [draft, setDraft] = useState(emptyCourse);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const [courseList, studentList, windowList] = await Promise.all([
        adminListCourses(),
        adminListStudents(),
        adminListRegistrationWindows(),
      ]);

      setCourses(Array.isArray(courseList) ? courseList : courseList.courses ?? []);
      setStudents(Array.isArray(studentList) ? studentList : studentList.students ?? []);
      setWindows(Array.isArray(windowList) ? windowList : windowList.windows ?? []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setMessage('');

    if (nextTab === 'courses') setDraft(emptyCourse);
    if (nextTab === 'students') setDraft(emptyStudent);
    if (nextTab === 'windows') setDraft(emptyWindow);
  };

  const getCurrentList = () => {
    if (tab === 'courses') return courses;
    if (tab === 'students') return students;
    return windows;
  };

  const setCurrentList = (nextList) => {
    if (tab === 'courses') setCourses(nextList);
    if (tab === 'students') setStudents(nextList);
    if (tab === 'windows') setWindows(nextList);
  };

  const getItemId = (item) => {
    if (tab === 'courses') return item.courseId ?? item.id ?? item.code;
    if (tab === 'students') return item.studentId;
    if (tab === 'windows') return item.id;
    return item.id;
  };

  const handleCreate = async () => {
    try {
      setMessage('');

      if (tab === 'courses') await adminCreateCourse(draft);
      if (tab === 'students') await adminCreateStudent(draft);
      if (tab === 'windows') await adminCreateRegistrationWindow(draft);

      setMessage('생성되었습니다.');

      if (tab === 'courses') setDraft(emptyCourse);
      if (tab === 'students') setDraft(emptyStudent);
      if (tab === 'windows') setDraft(emptyWindow);

      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handlePatch = async (item) => {
    try {
      const id = getItemId(item);

      if (!id) {
        setMessage('수정할 항목의 ID가 없습니다.');
        return;
      }

      if (tab === 'courses') await adminPatchCourse(id, item);
      if (tab === 'students') await adminPatchStudent(id, item);
      if (tab === 'windows') await adminPatchRegistrationWindow(id, item);

      setMessage('수정되었습니다.');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async (item) => {
    try {
      const id = getItemId(item);

      if (!id) {
        setMessage('삭제할 항목의 ID가 없습니다.');
        return;
      }

      if (tab === 'courses') await adminDeleteCourse(id);
      if (tab === 'students') await adminDeleteStudent(id);
      if (tab === 'windows') await adminDeleteRegistrationWindow(id);

      setMessage('삭제되었습니다.');
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const currentList = getCurrentList();

  return (
    <main className="main-page">
      <header className="app-header">
        <div>
          <h1>수강신청 관리자</h1>
          <p>{admin?.name ?? admin?.username ?? '관리자'}님</p>
        </div>

        <button className="line-button" type="button" onClick={onLogout}>
          로그아웃
        </button>
      </header>

      <nav className="tab-menu">
        <button
          type="button"
          className={tab === 'courses' ? 'active' : ''}
          onClick={() => changeTab('courses')}
        >
          강의 관리
        </button>

        <button
          type="button"
          className={tab === 'students' ? 'active' : ''}
          onClick={() => changeTab('students')}
        >
          학생 관리
        </button>

        <button
          type="button"
          className={tab === 'windows' ? 'active' : ''}
          onClick={() => changeTab('windows')}
        >
          신청 기간 관리
        </button>
      </nav>

      {message && <p className="error-message">{message}</p>}

      <section className="content-panel">
        <div className="section-title-row">
          <div>
            <h2>
              {tab === 'courses' && '강의 관리'}
              {tab === 'students' && '학생 관리'}
              {tab === 'windows' && '신청 기간 관리'}
            </h2>
            <p>JSON 형태로 데이터를 입력해서 생성, 수정, 삭제를 테스트합니다.</p>
          </div>

          <button className="secondary-button" type="button" onClick={loadData}>
            새로고침
          </button>
        </div>

        <h3>새 항목 생성</h3>
        <JsonEditor value={draft} onChange={setDraft} />

        <button
          className="primary-button"
          type="button"
          onClick={handleCreate}
          style={{ marginTop: 12 }}
        >
          생성
        </button>
      </section>

      <section className="content-panel" style={{ marginTop: 20 }}>
        <h3>목록</h3>

        {isLoading ? (
          <p>불러오는 중입니다.</p>
        ) : currentList.length === 0 ? (
          <p>데이터가 없습니다.</p>
        ) : (
          currentList.map((item, index) => (
            <div
              key={getItemId(item) ?? index}
              className="content-panel"
              style={{ marginTop: 16 }}
            >
              <JsonEditor
                value={item}
                onChange={(nextItem) => {
                  const nextList = [...currentList];
                  nextList[index] = nextItem;
                  setCurrentList(nextList);
                }}
              />

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => handlePatch(item)}
                >
                  수정
                </button>

                <button
                  className="line-button"
                  type="button"
                  onClick={() => handleDelete(item)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}