import { NextResponse } from 'next/server';
import { signAdmin } from '../../../../lib/server';

export async function POST(request) {
  const { username, password } = await request.json();

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ ok: false, error: 'Username atau password salah.' }, { status: 401 });
  }

  const value = `${Date.now()}.${crypto.randomUUID()}`;
  const cookieValue = `${value}.${signAdmin(value)}`;

  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_session', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  });
  return response;
}
