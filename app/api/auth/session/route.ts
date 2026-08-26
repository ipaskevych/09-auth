import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '../../api'; 
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Проверяем состояние сессии через внешний API, передавая куки
    const apiRes = await api.get('/auth/session', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    const setCookie = apiRes.headers['set-cookie'];
    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
      for (const cookieStr of cookieArray) {
        const parsed = parseSetCookie(cookieStr);
        if (parsed.value) {
          cookieStore.set(parsed.name, parsed.value, parsed);
        }
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });

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