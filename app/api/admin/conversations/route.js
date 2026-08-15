import { NextResponse } from 'next/server';
import { db, isAdmin } from '../../../../lib/server';

export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ ok: false }, { status: 401 });

  const { data, error } = await db()
    .from('conversations')
    .select('id, public_id, display_name, status, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, conversations: data });
}
