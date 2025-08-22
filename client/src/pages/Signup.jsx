import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', referral:'' });
  const [error, setError] = useState();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/auth/register', { method: 'POST', body: form });
      alert('Check email for verification link');
      nav('/login');
    } catch(err){
      setError(err.error || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Create account</h2>
      <form className="space-y-3" onSubmit={submit}>
        <input required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input"/>
        <input required placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input"/>
        <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input"/>
        <input placeholder="Phone (optional)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input" />
        <input placeholder="Referral code (optional)" value={form.referral} onChange={e=>setForm({...form,referral:e.target.value})} className="input" />
        {error && <div className="text-red-400">{error}</div>}
        <button className="px-4 py-2 bg-indigo-600 rounded">Sign up</button>
      </form>
    </div>
  );
}
