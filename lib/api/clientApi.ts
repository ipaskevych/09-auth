import { api } from './api';
import { User } from '@/types/user';
import { Note, NewNote } from '@/types/note'; // Импортируем Note и ваш готовый NewNote
import { LoginCredentials, RegisterCredentials } from '@/types/auth';

export const clientApi = {
  // --- Заметки ---
  // Явно указываем, что функция возвращает массив заметок (Note[])
  async fetchNotes(params?: { search?: string; page?: number; tag?: string }): Promise<any> {
  const { data } = await api.get('/notes', { params });
  return data;
},

  async fetchNoteById(id: string): Promise<Note> {
    const { data } = await api.get(`/notes/${id}`);
    return data;
  },

  // Используем ваш интерфейс NewNote вместо анонимного объекта или any
  async createNote(noteData: NewNote): Promise<Note> {
    const { data } = await api.post('/notes', noteData);
    return data;
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },

  // --- Аутентификация ---
  async register(credentials: RegisterCredentials): Promise<User> {
    const { data } = await api.post('/auth/register', credentials);
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