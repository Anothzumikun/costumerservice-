 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StartPage(){
  const [name,setName]=useState('');
  const [id,setId]=useState('');
  const [code,setCode]=useState('');
  const [loading,setLoading]=useState(false);
  const [created,setCreated]=useState(null);
  const router=useRouter();

  async function createChat(e){
    e.preventDefault(); setLoading(true);
    const r=await fetch('/api/customer/start',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({displayName:name})
    });
    const d=await r.json();
    setLoading(false);
    if(r.ok) setCreated(d); else alert(d.error||'Gagal membuat chat');
  }

  async function restore(e){
    e.preventDefault(); setLoading(true);
    const r=await fetch('/api/customer/restore',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({publicId:id,accessCode:code})
    });
    const d=await r.json();
    setLoading(false);
    if(r.ok) router.push('/chat'); else alert(d.error||'Data salah');
  }

  if(created) return <main className="center"><section className="card compact">
    <div className="icon">✓</div>
    <h1>Chat dibuat</h1>
    <p className="muted">Simpan dua data ini. Keduanya diperlukan jika kamu membuka chat dari perangkat lain.</p>
    <div className="credential"><span>ID Chat</span><b>{created.conversation.public_id}</b></div>
    <div className="credential"><span>Kode Akses</span><b>{created.accessCode}</b></div>
    <button className="primary" onClick={()=>router.push('/chat')}>Masuk ke Chat</button>
    <button className="linkbtn" onClick={()=>navigator.clipboard?.writeText(`ID Chat: ${created.conversation.public_id}\nKode: ${created.accessCode}`)}>Salin ID & Kode</button>
  </section></main>;

  return <main className="center"><section className="card compact">
    <div className="logo">CS</div>
    <h1>Customer Service</h1>
    <div className="notice"><b>Laporkan masalah kamu ke admin tentang mod</b><br/><span>Jelaskan masalah dengan singkat dan jelas.</span></div>
    <form onSubmit={createChat}>
      <label>Nama panggilan <span>(opsional)</span></label>
      <input value={name} onChange={e=>setName(e.target.value)} maxLength={40} placeholder="Contoh: Andi"/>
      <button className="primary">{loading?'Membuat...':'Mulai Chat Baru'}</button>
    </form>
    <div className="divider"><span>atau</span></div>
    <form onSubmit={restore}>
      <label>Sudah punya chat?</label>
      <input value={id} onChange={e=>setId(e.target.value.toUpperCase())} maxLength={20} placeholder="ID Chat"/>
      <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} maxLength={8} placeholder="Kode Akses" style={{marginTop:8}}/>
      <button className="secondary full">Buka Chat Lama</button>
    </form>
    <p className="privacy">🔒 Tidak perlu nomor HP atau email.</p>
  </section></main>;
}
