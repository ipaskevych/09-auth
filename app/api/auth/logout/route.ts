import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api'; 
import { logErrorResponse } from '@/app/api/_utils/utils';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // Получаем строку кук напрямую из хранилища cookies() по требованию ментора
    const cookieHeader = cookieStore.toString();

    // Передаем null вторым аргументом для POST-запроса на logout
    await api.post('/auth/logout', null, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    logErrorResponse(error);

    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = {
        message: error.message,
        response: error.response?.data,
        ...(error.response?.data || {})
      };
      return NextResponse.json(errorData, { status });
    }
    return NextResponse.json({ error: 'Internal Server Error', message: (error as Error).message }, { status: 500 });
  }
}