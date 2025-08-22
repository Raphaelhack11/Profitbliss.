import React, { useState } from "react";
import { api } from "../lib/api";

export default function Deposit(){
  const [amount, setAmount] = useState(50);
  const [msg, setMsg] = useState(null);

  async function submit(e){
    e.preventDefault();
    if(amount < 50){
      setMsg('Minimum deposit is $50');
      return;
    }
    try{
      const res = await api('/transactions/deposit',{ method:'POST', body: { amount }});
      setMsg(res.message || 'Deposit recorded (pending)');
    }catch(e){ setMsg(e.error || 'Error'); }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2>Deposit funds</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} min="50" className="input"/>
        <div className="text-sm text-slate-300">Send USDT (ERC20) or BTC to the addresses on the deposit page after submitting.</div>
        <button className="px-3 py-2 bg-green-500 rounded">Submit Deposit</button>
      </form>
      {msg && <div className="mt-3">{msg}</div>}
    </div>
  );
}
