import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Login(){
  const [form,setForm] = useState({ email:'', password:'' });
  const [err,setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await api('/auth/login', { method:'POST', body: form });
      localStorage.setItem('pb_token', data.token);
      localStorage.setItem('pb_user', JSON.stringify(data.user));
      nav('/dashboard');
    } catch(e){
      setErr(e.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="input"/>
        <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" placeholder="Password" className="input"/>
        {err && <div className="text-red-400">{err}</div>}
        <button className="px-4 py-2 bg-indigo-600 rounded">Login</button>
      </form>
    </div>
  );
    }
