import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { noteApi } from '@/lib/api/api'; 
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Запрос к внешнему бэкенду для проверки текущей сессии
    const apiRes = await noteApi.get('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    // Обязательное логирование для автотестов
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

    return NextResponse.json(
      { error: 'Internal Server Error', message: (error as Error).message }, 
      { status: 500 }
    );
  }
}