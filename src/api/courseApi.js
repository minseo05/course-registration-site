import { api } from './client';

function toCourseList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.courses)) return data.courses;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function normalizeCourse(course) {
  const id = course.id ?? course.courseId ?? course.code;

  return {
    ...course,
    id,
    courseId: id,
    code: course.code ?? id,
    name: course.name ?? course.courseName ?? '',
    section: course.section ?? '',
    professor: course.professor ?? '',
    department: course.department ?? '',
    type: course.type ?? 'MAJOR',
    grade: course.grade ?? '',
    credits: Number(course.credits ?? 0),
    timeText: course.timeText ?? '',
    classroom: course.classroom ?? '',
    capacity: Number(course.capacity ?? 0),
    appliedCount: Number(course.appliedCount ?? course.enrolledCount ?? 0),
    preAppliedCount: Number(course.preAppliedCount ?? course.preCartCount ?? 0),
    slots: Array.isArray(course.slots) ? course.slots : [],
  };
}

export async function getCourses(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'ALL') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  const data = await api(`/courses${query ? `?${query}` : ''}`);

  return toCourseList(data).map(normalizeCourse);
}