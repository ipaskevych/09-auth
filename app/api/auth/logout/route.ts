
import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api'; 
import { logErrorResponse } from '@/app/api/_utils/utils';

export async function POST(request: Request) {
  try {
    // Делаем обязательный запрос к внешнему API
    await api.post('/auth/logout');

    // Очищаем куки
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(error.response?.data, { status: error.response?.status || 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}