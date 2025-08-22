import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function AdminLogin(){
  const [form,setForm] = useState({ email:'', password:''});
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const data = await api('/auth/login', { method: 'POST', body: form });
    if(data.user.isAdmin){
      localStorage.setItem('pb_token', data.token);
      nav('/admin');
    } else alert('Not an admin');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2>Admin Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input" placeholder="Email"/>
        <input value={form.password} type="password" onChange={e=>setForm({...form,password:e.target.value})} className="input" placeholder="Password"/>
        <button className="px-3 py-2 bg-indigo-600 rounded">Login</button>
      </form>
    </div>
  );
}
