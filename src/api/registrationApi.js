import { api } from './client';

export async function getRegistrationInfo() {
  return api('/registration-info');
}