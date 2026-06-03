import { api } from './client';

export async function login(studentId, password) {
  return api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      studentId,
      password,
    }),
  });
}

export async function getMe() {
  return api('/me');
}