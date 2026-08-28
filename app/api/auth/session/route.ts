import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Асинхронные куки Next.js 15
import { isAxiosError } from 'axios';
// Правильные относительные пути с учетом структуры папок:
import { noteApi } from '../../api'; 
import { logErrorResponse } from '../../_utils/utils'; 

export async function GET() {
  try {
    // Обязательно используем await для cookies() в Next.js 15
    const cookieStore = await cookies();

    // Запрос к внешнему бэкенду для проверки текущей сессии
    const apiRes = await noteApi.get('/auth/session', {
      headers: {
        // Передаем куки в виде строки заголовка
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    // Логирование ошибок для автотестов GoIT
    logErrorResponse(error);

    if (isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorData = {
        message: error.message,
        response: error.response?.data,
        ...(error.response?.data || {}),
      };

      return NextResponse.json(errorData, { status });
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}