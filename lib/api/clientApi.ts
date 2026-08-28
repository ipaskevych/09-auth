import { api } from './api';
import { User } from '@/types/user';
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export const clientApi = {
  // --- Заметки ---
  async fetchNotes(params?: { search?: string; page?: number; tag?: string }) {
    const { data } = await api.get('/notes', { params });
    return data;
  },

  async fetchNoteById(id: string) {
    const { data } = await api.get(`/notes/${id}`);
    return data;
  },

  async createNote(noteData: { title: string; content: string; tag: string }) {
    const { data } = await api.post('/notes', noteData);
    return data;
  },

  async deleteNote(id: string) {
    const { data } = await api.delete(`/notes/${id}`);
    return data;
  },

  // --- Аутентификация ---
  async register({ email, password, username }: any): Promise<User> {
    const { data } = await api.post('/auth/register', { email, password, name: username });
    return data;
  },

  async login(credentials: LoginCredentials): Promise<User> {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async checkSession(): Promise<User | null> {
    const { data } = await api.get('/auth/session');
    return data || null;
  },

  // --- Пользователи ---
  async getMe(): Promise<User> {
    const { data } = await api.get('/users/me');
    return data;
  },

  async updateMe(userData: Partial<User>): Promise<User> {
    const { data } = await api.patch('/users/me', userData);
    return data;
  },
};