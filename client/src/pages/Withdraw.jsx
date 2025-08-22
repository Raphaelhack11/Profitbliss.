import React, { useState } from "react";
import { api } from "../lib/api";

export default function Withdraw(){
  const [amount,setAmount] = useState('');
  const [addr,setAddr] = useState('');
  const [msg,setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if(Number(amount) < 70){ setMsg('Minimum withdrawal $70'); return; }
    try{
      const res = await api('/transactions/withdraw',{ method:'POST', body: { amount: Number(amount), toAddress: addr }});
      setMsg(res.message || 'Withdrawal requested (pending)');
    }catch(e){ setMsg(e.error || 'Error'); }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2>Withdraw</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} className="input" />
        <input placeholder="Destination wallet address" value={addr} onChange={e=>setAddr(e.target.value)} className="input" />
        <button className="px-3 py-2 bg-red-500 rounded">Request Withdraw</button>
      </form>
      {msg && <div className="mt-3">{msg}</div>}
    </div>
  );
}
