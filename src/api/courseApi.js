import { api } from './client';

export async function getCourses(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== 'ALL') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return api(`/courses${query ? `?${query}` : ''}`);
}