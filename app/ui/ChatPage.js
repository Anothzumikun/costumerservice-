 'use client';

import { useEffect,useRef,useState } from 'react';
import Link from 'next/link';

export default function ChatPage(){
  const [data,setData]=useState(null),[text,setText]=useState('');
  const bottom=useRef(null);

  async function load(){
    const r=await fetch('/api/customer/messages',{cache:'no-store'});
    if(r.ok) setData(await r.json());
    else location.href='/';
  }
  useEffect(()=>{load();const t=setInterval(load,4000);return()=>clearInterval(t)},[]);
  useEffect(()=>bottom.current?.scrollIntoView({behavior:'smooth'}),[data]);

  async function send(e){
    e.preventDefault();
    if(!text.trim())return;
    const r=await fetch('/api/customer/messages',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:text})
    });
    const d=await r.json();
    if(!r.ok) alert(d.error||'Gagal mengirim');
    setText('');load();
  }

  if(!data)return <div className="center"><div className="card compact">Memuat chat...</div></div>;

  return <div className="chat-wrap">
    <header className="chat-header">
      <div><strong>Customer Service</strong><small>ID: {data.conversation.public_id}</small></div>
      <Link href="/" className="small-link">Menu</Link>
    </header>
    <div className="notice chat-notice"><b>Laporkan masalah kamu ke admin tentang mod</b></div>
    <main className="messages">
      {data.messages.length===0&&<div className="empty">Belum ada pesan.<br/><span>Kirim pesan untuk memulai chat.</span></div>}
      {data.messages.map(m=><div key={m.id} className={'bubble '+(m.sender_type==='customer'?'mine':'theirs')}>
        <div>{m.message}</div><small>{new Date(m.created_at).toLocaleString('id-ID')}</small>
      </div>)}<div ref={bottom}/>
    </main>
    {data.conversation.status==='open'?
      <form className="composer" onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} maxLength={2000} placeholder="Ketik pesan..." required/><button className="primary send">➤</button></form>
      :<div className="closed">Chat ditutup sementara. Riwayat tetap tersimpan dan bisa dibuka lagi.</div>}
  </div>;
}
