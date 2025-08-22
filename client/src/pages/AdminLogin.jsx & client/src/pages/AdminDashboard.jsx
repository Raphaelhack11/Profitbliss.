import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function AdminDashboard(){
  const [deposits,setDeposits] = useState([]);
  const [withdrawals,setWithdrawals] = useState([]);
  const [messages,setMessages] = useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const d = await api('/admin/pending/deposits'); setDeposits(d.pending);
      const w = await api('/admin/pending/withdrawals'); setWithdrawals(w.pending);
      const m = await api('/admin/messages'); setMessages(m.messages);
    }catch(e){}
  }

  async function approveDeposit(id){ await api(`/admin/deposits/${id}/approve`, { method: 'POST' }); load(); }
  async function approveWithdraw(id){ await api(`/admin/withdrawals/${id}/approve`, { method: 'POST' }); load(); }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2>Admin Dashboard</h2>
      <section>
        <h3>Pending Deposits</h3>
        {deposits.map(d=>(
          <div key={d.id} className="p-3 bg-white/5 rounded mb-2">
            <div>{d.email} — ${d.amount}</div>
            <button className="px-2 py-1 bg-green-500 rounded mr-2" onClick={()=>approveDeposit(d.id)}>Approve</button>
          </div>
        ))}
      </section>

      <section>
        <h3>Pending Withdrawals</h3>
        {withdrawals.map(w=>(
          <div key={w.id} className="p-3 bg-white/5 rounded mb-2">
            <div>{w.email} — ${w.amount}</div>
            <button className="px-2 py-1 bg-green-500 rounded mr-2" onClick={()=>approveWithdraw(w.id)}>Approve</button>
          </div>
        ))}
      </section>
    </div>
  );
      }
