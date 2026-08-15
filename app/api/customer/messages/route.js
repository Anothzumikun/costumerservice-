import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, sha256 } from '../../../../lib/server';

async function getConversation() {
  const jar = await cookies();
  const raw = jar.get('customer_session')?.value || '';
  const dot = raw.indexOf('.');
  if (dot < 1) return null;

  const publicId = raw.slice(0, dot);
  const accessCode = raw.slice(dot + 1);
  if (!publicId || !accessCode) return null;

  const { data } = await db()
    .from('conversations')
    .select('id, public_id, display_name, status')
    .eq('public_id', publicId)
    .eq('access_hash', sha256(accessCode))
    .single();

  return data || null;
}

export async function GET() {
  const conversation = await getConversation();
  if (!conversation) return NextResponse.json({ ok: false }, { status: 401 });

  const { data, error } = await db()
    .from('messages')
    .select('id, sender_type, message, created_at')
    .eq('conversation_id', conversation.id)
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });

  await db()
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversation.id)
    .eq('sender_type', 'admin');

  return NextResponse.json({ ok: true, conversation, messages: data });
}

export async function POST(request) {
  const conversation = await getConversation();
  if (!conversation) return NextResponse.json({ ok: false }, { status: 401 });

  if (conversation.status !== 'open') {
    return NextResponse.json({ ok: false, error: 'Chat sedang ditutup.' }, { status: 400 });
  }

  const { message } = await request.json();
  const text = String(message || '').trim();

  if (!text || text.length > 2000) {
    return NextResponse.json({ ok: false, error: 'Pesan tidak valid.' }, { status: 400 });
  }

  const { error } = await db().from('messages').insert({
    conversation_id: conversation.id,
    sender_type: 'customer',
    message: text
  });

  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
