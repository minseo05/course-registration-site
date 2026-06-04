import { api } from './client';

export async function getPreCart() {
  return api('/pre-cart');
}

export async function addPreCart(courseId) {
  return api('/pre-cart', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

export async function removePreCart(courseId) {
  return api(`/pre-cart/${encodeURIComponent(courseId)}`, {
    method: 'DELETE',
  });
}