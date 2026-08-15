# Customer Service Chat v2 — Next.js + Supabase + Vercel

Versi ini dibuat agar chat tidak hilang ketika admin menutup percakapan.

## Perubahan utama
- UI lebih kecil dan sederhana.
- Ada teks: "Laporkan masalah kamu ke admin tentang mod".
- Chat yang ditutup TIDAK dihapus.
- Admin bisa membuka kembali chat.
- Pelanggan punya ID Chat + Kode Akses untuk membuka chat lama.
- Tidak perlu Google login, nomor HP, atau email.
- Kode akses disimpan sebagai SHA-256 hash di database.
- Service-role key hanya digunakan di server API.

## Setup
1. Di Supabase, buat project/database.
2. Jalankan seluruh `supabase.sql` di SQL Editor.
3. Di GitHub, upload seluruh isi project ini.
4. Import repository ke Vercel.
5. Isi Environment Variables:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ADMIN_USERNAME
   ADMIN_PASSWORD
   ADMIN_SESSION_SECRET

ADMIN_SESSION_SECRET harus berupa string acak panjang. Contoh aman bisa dibuat dengan password manager atau generator random.

## URL
Pelanggan: /
Chat: /chat
Admin: /admin/login

## Cara pelanggan kembali
Saat membuat chat, sistem memberikan:
- ID Chat
- Kode Akses

Pelanggan harus menyimpan keduanya. Jika browser/perangkat berganti, masukkan ID + Kode di halaman utama.

## Privasi
Sistem tidak meminta nomor HP/email. Namun hosting, database, dan browser masih dapat menyimpan log teknis. Ini bukan anonimitas absolut.

## Catatan
Jangan pernah memasukkan `SUPABASE_SERVICE_ROLE_KEY` ke frontend, GitHub, atau file `.env` yang di-commit.
