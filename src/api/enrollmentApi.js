import { api } from './client';

function createIdempotencyKey(courseId) {
  const uuid =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `frontend-click-${courseId}-${uuid}`;
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
  return api(`/enrollments/${encodeURIComponent(courseId)}`, {
    method: 'DELETE',
  });
}