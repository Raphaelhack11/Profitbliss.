import React, { useState } from "react";
import { api } from "../lib/api";

export default function Contact(){
  const [body,setBody] = useState('');
  const [msg,setMsg] = useState(null);
  const submit = async e => {
    e.preventDefault();
    try{ await api('/messages',{ method:'POST', body: { body } }); setMsg('Message sent'); }catch(e){ setMsg(e.error || 'Error'); }
  };
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2>Contact</h2>
      <form onSubmit={submit} className="space-y-3">
        <textarea value={body} onChange={e=>setBody(e.target.value)} className="input" placeholder="Your message"/>
        <button className="px-3 py-2 bg-indigo-600 rounded">Send</button>
      </form>
      {msg && <div className="mt-3">{msg}</div>}
    </div>
  );
}
