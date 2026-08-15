import { NextResponse } from 'next/server';
import { db, isAdmin } from '../../../../lib/server';

export async function GET(request) {
  if (!isAdmin(request)) return NextResponse.json({ ok: false }, { status: 401 });

  const id = new URL(request.url).searchParams.get('conversation');
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  const { data, error } = await db()
    .from('messages')
    .select('id, sender_type, message, created_at')
    .eq('conversation_id', id)
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  await db()
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', id)
    .eq('sender_type', 'customer');

  return NextResponse.json({ ok: true, messages: data });
}

export async function POST(request) {
  if (!isAdmin(request)) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await request.json();
  const conversationId = Number(body.conversationId);

  if (!conversationId) return NextResponse.json({ ok: false }, { status: 400 });

  if (body.action === 'status') {
    const status = body.status === 'closed' ? 'closed' : 'open';
    const { error } = await db().from('conversations')
      .update({ status })
      .eq('id', conversationId);
    if (error) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const text = String(body.message || '').trim();
  if (!text || text.length > 2000) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { error } = await db().from('messages').insert({
    conversation_id: conversationId,
    sender_type: 'admin',
    message: text
  });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
