import axios from 'axios';

const baseURL = 'https://notehub-api.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const noteApi = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});