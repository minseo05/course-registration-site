import { api } from './client';

export async function getEnrollments() {
  return api('/enrollments');
}

export async function applyCourse(courseId) {
  return api('/enrollments', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

export async function cancelCourse(courseId) {
  return api(`/enrollments/${courseId}`, {
    method: 'DELETE',
  });
}