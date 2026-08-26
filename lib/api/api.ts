import axios from 'axios';

// Базовый URL формируется на основе переменной окружения
const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true, // Критически важно для работы с куками (сессиями)
});

// Экспортируем тот же экземпляр под именем, которое требуют автотесты ментора
export { api as noteApi };