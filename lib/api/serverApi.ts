import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '../../types/user';
import { Note, NotesFilters } from '../../types/note';

// Вспомогательная функция для извлечения кук и передачи их в заголовки axios
const getAuthHeaders = () => {
  const cookieStore = cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(), // Прокидываем все куки на бэкенд
    },
  };
};

export const fetchNotes = async (filters?: NotesFilters): Promise<Note[]> => {
  const { data } = await api.get<Note[]>('/notes', {
    ...getAuthHeaders(),
    params: filters,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, getAuthHeaders());
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me', getAuthHeaders());
  return data;
};

export const checkSession = async (): Promise<import('axios').AxiosResponse<User>> => {
  const response = await api.get<User>('/auth/session', getAuthHeaders());
  return response;
};