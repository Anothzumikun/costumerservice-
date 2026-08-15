import { NextResponse } from 'next/server';
import { db, randomCode, sha256 } from '../../../../lib/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const displayName = String(body.displayName || 'Pelanggan').trim().slice(0, 40) || 'Pelanggan';

    const publicId = randomCode(10);
    const accessCode = randomCode(8);

    const { data, error } = await db()
      .from('conversations')
      .insert({
        public_id: publicId,
        access_hash: sha256(accessCode),
        display_name: displayName,
        status: 'open'
      })
      .select('id, public_id, display_name, status')
      .single();

    if (error) throw error;

    const response = NextResponse.json({
      ok: true,
      conversation: data,
      accessCode
    });

    response.cookies.set('customer_session', `${data.public_id}.${accessCode}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Gagal membuat chat.' }, { status: 500 });
  }
}
