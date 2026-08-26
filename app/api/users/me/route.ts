export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { logErrorResponse } from '../../_utils/utils';
import { isAxiosError } from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await api.get('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
      
      const status = error.response?.status || 500;
      const errorData = error.response?.data || { error: error.message };

      return NextResponse.json(errorData, { status });
    }

    logErrorResponse(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.patch('/users/me', body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });

  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error);
    
      const status = error.response?.status || 500;
      const errorData = error.response?.data || { error: error.message };

      return NextResponse.json(errorData, { status });
    }

    logErrorResponse(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
