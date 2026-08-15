 'use client';

import {useEffect,useState} from 'react';

export default function AdminPanel(){
 const [cs,setCs]=useState([]),[selected,setSelected]=useState(null),[msgs,setMsgs]=useState([]),[text,setText]=useState('');
 async function loadCs(){const r=await fetch('/api/admin/conversations',{cache:'no-store'});if(r.status===401){location.href='/admin/login';return}if(r.ok)setCs((await r.json()).conversations)}
 async function loadMsgs(){if(!selected)return;const r=await fetch('/api/admin/messages?conversation='+selected.id,{cache:'no-store'});if(r.ok)setMsgs((await r.json()).messages)}
 useEffect(()=>{loadCs();const t=setInterval(loadCs,5000);return()=>clearInterval(t)},[]);
 useEffect(()=>{loadMsgs();const t=setInterval(loadMsgs,3000);return()=>clearInterval(t)},[selected]);
 async function send(e){e.preventDefault();if(!text.trim())return;await fetch('/api/admin/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({conversationId:selected.id,message:text})});setText('');loadMsgs();loadCs()}
 async function status(s){await fetch('/api/admin/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({conversationId:selected.id,status:s,action:'status'})});setSelected({...selected,status:s});loadCs()}
 async function logout(){await fetch('/api/admin/logout',{method:'POST'});location.href='/admin/login'}
 return <div className="admin-layout">
 <aside className="sidebar"><div className="side-top"><strong>CS Admin</strong><button onClick={logout}>Keluar</button></div>
 {cs.map(c=><button key={c.id} className={'conversation-item '+(selected?.id===c.id?'active':'')} onClick={()=>setSelected(c)}><strong>{c.display_name}</strong><small>#{c.public_id}</small><p>{c.status==='open'?'● Terbuka':'○ Ditutup'}</p></button>)}</aside>
 <section className="admin-chat">{!selected?<div className="empty big">Pilih percakapan.</div>:<>
 <header className="chat-header"><div><strong>{selected.display_name}</strong><small>ID: {selected.public_id}</small></div><button className="secondary" onClick={()=>status(selected.status==='open'?'closed':'open')}>{selected.status==='open'?'Tutup Chat':'Buka Lagi'}</button></header>
 <main className="messages">{msgs.map(m=><div key={m.id} className={'bubble '+(m.sender_type==='admin'?'mine':'theirs')}><div>{m.message}</div><small>{new Date(m.created_at).toLocaleString('id-ID')}</small></div>)}</main>
 {selected.status==='open'&&<form className="composer" onSubmit={send}><input value={text} onChange={e=>setText(e.target.value)} maxLength={2000} placeholder="Balas pelanggan..." required/><button className="primary send">➤</button></form>}
 </>}</section></div>;
}
