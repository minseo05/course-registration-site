import { api } from './client';

export async function getTimetable() {
  return api('/timetable');
}