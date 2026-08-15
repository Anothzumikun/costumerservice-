 'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AdminLogin(){
 const [u,setU]=useState(''),[p,setP]=useState(''),[loading,setLoading]=useState(false),router=useRouter();
 async function submit(e){
  e.preventDefault();setLoading(true);
  const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
  const d=await r.json();setLoading(false);
  if(r.ok)router.push('/admin');else alert(d.error||'Login gagal');
 }
 return <main className="center"><section className="card compact"><div className="logo">CS</div><h1>Admin CS</h1><form onSubmit={submit}><label>Username</label><input value={u} onChange={e=>setU(e.target.value)} required/><label>Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} required/><button className="primary">{loading?'Masuk...':'Masuk'}</button></form></section></main>;
}
