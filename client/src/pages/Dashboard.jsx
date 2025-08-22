import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Dashboard(){
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('pb_user')||'null'));
  const [balance, setBalance] = useState(user?.balance || 0);
  const [plans, setPlans] = useState([]);

  useEffect(()=>{ fetchPlans(); fetchBalance(); },[]);

  async function fetchPlans(){
    try{
      const data = await api('/plans');
      setPlans(data.plans);
    }catch(e){}
  }

  async function fetchBalance(){
    try{
      const me = JSON.parse(localStorage.getItem('pb_user')||'null');
      if(!me) return;
      // refresh user by login token via protected endpoint (not created here) – we'll use local cache
      setBalance(me.balance);
    }catch(e){}
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl">Welcome back, {user?.name || user?.email}</h2>
      <div className="mt-4 p-4 bg-white/5 rounded">
        <div className="text-sm text-slate-300">Account Balance</div>
        <div className="text-3xl font-bold">${balance.toFixed(2)}</div>
        <div className="mt-4 space-x-3">
          <Link to="/deposit" className="px-4 py-2 bg-green-500 rounded">Deposit</Link>
          <Link to="/withdraw" className="px-4 py-2 bg-red-500 rounded">Withdraw</Link>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-xl mb-3">Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {plans.map(p=>(
            <div key={p.id} className="p-4 rounded bg-white/5">
              <div className="font-bold">{p.name}</div>
              <div>Stake: ${p.stake}</div>
              <div>Daily ROI: {Math.round(p.dailyRoi*100)}%</div>
              <div>Duration: {p.durationDays} days</div>
              <button className="mt-3 px-3 py-1 bg-indigo-600 rounded" onClick={async ()=>{
                try{
                  await api('/plans/subscribe',{ method: 'POST', body: { planId: p.id }});
                  alert('Subscribed. Your plan will start.');
                  // refresh
                }catch(err){
                  if(err.error) alert(err.error);
                }
              }}>Subscribe</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl">Active Plans</h3>
        <Link to="/plans/active" className="text-indigo-300">View active plans →</Link>
      </section>
    </div>
  );
                    }
