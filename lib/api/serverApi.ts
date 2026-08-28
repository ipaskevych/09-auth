import { AxiosResponse } from 'axios';
import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note'; // Убедись, что этот интерфейс объявлен в types/note.ts

// Явный интерфейс для возвращаемого значения функции заголовков по требованию ментора
interface AuthHeaders {
  headers: {
    Cookie: string;
  };
}

// 1. ИСПРАВЛЕНО: Явно указали тип возвращаемого значения Promise<AuthHeaders>
async function getAuthHeaders(): Promise<AuthHeaders> {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

export const serverApi = {
  // 2. ИСПРАВЛЕНО: Добавили строгую типизацию параметров и возвращаемого типа (массив или объект с заметками)
  async fetchNotes(params?: { search?: string; page?: number; tag?: string }): Promise<{ notes: Note[]; totalPages: number }> {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get('/notes', { ...authHeaders, params });
    return data;
  },

  // 2. ИСПРАВЛЕНО: Явно указали, что возвращается объект одиночной заметки Promise<Note>
  async fetchNoteById(id: string): Promise<Note> {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get(`/notes/${id}`, authHeaders);
    return data;
  },

  // 2. ИСПРАВЛЕНО: Явно указали, что возвращается объект пользователя Promise<User>
  async getMe(): Promise<User> {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get('/users/me', authHeaders);
    return data;
  },

  // 3. ИСПРАВЛЕНО: Функция возвращает ПОЛНЫЙ объект ответа AxiosResponse, а не только data!
  async checkSession(): Promise<AxiosResponse<any>> {
    const authHeaders = await getAuthHeaders();
    const response = await api.get('/auth/session', authHeaders);
    return response;
  },
};

