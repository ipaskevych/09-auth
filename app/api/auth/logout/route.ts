import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { api } from '@/lib/api/api'; 
import { logErrorResponse } from '@/app/api/_utils/utils';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    await api.post('/auth/logout', {}, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      const errorData = error.response?.data || { message: error.message };
      logErrorResponse(errorData);
      return NextResponse.json(errorData, { status: error.response?.status || 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}