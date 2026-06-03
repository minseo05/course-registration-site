import { api } from './client';

export async function adminLogin(username, password) {
  return api('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
    tokenType: 'admin',
  });
}

export async function adminListCourses() {
  return api('/admin/courses', { tokenType: 'admin' });
}

export async function adminCreateCourse(payload) {
  return api('/admin/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
    tokenType: 'admin',
  });
}

export async function adminPatchCourse(courseId, payload) {
  return api(`/admin/courses/${courseId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    tokenType: 'admin',
  });
}

export async function adminDeleteCourse(courseId) {
  return api(`/admin/courses/${courseId}`, {
    method: 'DELETE',
    tokenType: 'admin',
  });
}

export async function adminListStudents() {
  return api('/admin/students', { tokenType: 'admin' });
}

export async function adminCreateStudent(payload) {
  return api('/admin/students', {
    method: 'POST',
    body: JSON.stringify(payload),
    tokenType: 'admin',
  });
}

export async function adminPatchStudent(studentId, payload) {
  return api(`/admin/students/${studentId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    tokenType: 'admin',
  });
}

export async function adminDeleteStudent(studentId) {
  return api(`/admin/students/${studentId}`, {
    method: 'DELETE',
    tokenType: 'admin',
  });
}

export async function adminListRegistrationWindows() {
  return api('/admin/registration-windows', { tokenType: 'admin' });
}

export async function adminCreateRegistrationWindow(payload) {
  return api('/admin/registration-windows', {
    method: 'POST',
    body: JSON.stringify(payload),
    tokenType: 'admin',
  });
}

export async function adminPatchRegistrationWindow(id, payload) {
  return api(`/admin/registration-windows/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    tokenType: 'admin',
  });
}

export async function adminDeleteRegistrationWindow(id) {
  return api(`/admin/registration-windows/${id}`, {
    method: 'DELETE',
    tokenType: 'admin',
  });
}