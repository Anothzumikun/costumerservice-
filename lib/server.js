import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function randomCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return out;
}

export function signAdmin(value) {
  const secret = process.env.ADMIN_SESSION_SECRET || '';
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export function validAdminCookie(cookie) {
  if (!cookie || !cookie.includes('.')) return false;
  const [value, sig] = cookie.split('.');
  if (!value || !sig) return false;
  const expected = signAdmin(value);
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function isAdmin(request) {
  return validAdminCookie(request.cookies.get('admin_session')?.value || '');
}
