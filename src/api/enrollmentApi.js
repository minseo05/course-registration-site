import { api } from './client';

function createIdempotencyKey(courseId) {
  if (crypto?.randomUUID) {
    return `frontend-${courseId}-${crypto.randomUUID()}`;
  }

  return `frontend-${courseId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function getEnrollments() {
  return api('/enrollments');
}

export async function applyCourse(courseId) {
  return api('/enrollments', {
    method: 'POST',
    body: JSON.stringify({
      courseId,
      idempotencyKey: createIdempotencyKey(courseId),
    }),
  });
}

export async function cancelCourse(courseId) {
  return api(`/enrollments/${courseId}`, {
    method: 'DELETE',
  });
}