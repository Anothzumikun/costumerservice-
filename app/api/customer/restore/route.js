import { NextResponse } from 'next/server';
import { db, sha256 } from '../../../../lib/server';

export async function POST(request) {
  try {
    const { publicId, accessCode } = await request.json();
    const id = String(publicId || '').trim().toUpperCase();
    const code = String(accessCode || '').trim().toUpperCase();

    if (!id || !code) {
      return NextResponse.json({ ok: false, error: 'ID Chat dan kode diperlukan.' }, { status: 400 });
    }

    const { data, error } = await db()
      .from('conversations')
      .select('id, public_id, display_name, status')
      .eq('public_id', id)
      .eq('access_hash', sha256(code))
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false, error: 'ID Chat atau kode salah.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, conversation: data });
    response.cookies.set('customer_session', `${data.public_id}.${code}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'Gagal membuka chat.' }, { status: 500 });
  }
}
