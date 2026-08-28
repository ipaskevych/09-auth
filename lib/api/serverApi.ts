import { AxiosResponse } from 'axios';
import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';

interface AuthHeaders {
  headers: {
    Cookie: string;
  };
}

async function getAuthHeaders(): Promise<AuthHeaders> {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

export const serverApi = {
  async fetchNotes(params?: { search?: string; page?: number; tag?: string }): Promise<{ notes: Note[]; totalPages: number }> {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get('/notes', { ...authHeaders, params });
    return data;
  },

  async fetchNoteById(id: string): Promise<Note> {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get(`/notes/${id}`, authHeaders);
    return data;
  },

  async getMe(): Promise<User> {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get('/users/me', authHeaders);
    return data;
  },

  // ИСПРАВЛЕНО: Добавили необязательный параметр customHeaders
  async checkSession(customHeaders?: AuthHeaders): Promise<AxiosResponse<any>> {
    const authHeaders = customHeaders || await getAuthHeaders();
    const response = await api.get('/auth/session', authHeaders);
    return response;
  },
};