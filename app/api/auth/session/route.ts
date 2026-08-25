import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { noteApi } from '../../api'; 
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // 1. Если есть активный accessToken, сессия валидна
    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    // 2. Если accessToken истёк, но есть refreshToken, пробуем обновить сессию
    if (refreshToken) {
      const apiRes = await noteApi.get('auth/me', {
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
    }

    // 3. Если вообще никаких токенов нет
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  } catch (error) {
    if (isAxiosError(error)) {
      return logErrorResponse(error);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
