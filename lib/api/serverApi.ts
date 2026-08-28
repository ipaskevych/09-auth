import { api } from './api';
import { cookies } from 'next/headers';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

export const serverApi = {
  async fetchNotes(params?: { search?: string; page?: number; tag?: string }) {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get('/notes', { ...authHeaders, params });
    return data;
  },

  async fetchNoteById(id: string) {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get(`/notes/${id}`, authHeaders);
    return data;
  },

  async getMe() {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get('/users/me', authHeaders);
    return data;
  },

  async checkSession() {
    const authHeaders = await getAuthHeaders();
    const { data } = await api.get('/auth/session', authHeaders);
    return data || null;
  },
};