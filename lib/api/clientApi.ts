import { api } from './api';
import { User, AuthResponse } from '@/types/user';
import { Note, NotesFilters } from '@/types/note';

// === Заметки (Notes) ===
export const fetchNotes = async (filters?: NotesFilters): Promise<Note[]> => {
  const { data } = await api.get<Note[]>('/notes', { params: filters });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (noteData: Omit<Note, 'id'>): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

// === Аутентификация (Auth) ===
export const register = async (authData: Record<string, any>): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', authData);
  return data;
};

export const login = async (authData: Record<string, any>): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', authData);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>('/auth/session');
  return data;
};

// === Пользователи (Users) ===
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', userData);
  return data;
};