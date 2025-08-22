import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ActivePlans(){
  const [active, setActive] = useState([]);
  useEffect(()=>{ (async ()=>{ try{ const r = await api('/plans/active'); setActive(r.active); }catch(e){} })(); },[]);
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2>Active Plans</h2>
      {active.map(a=>(
        <div key={a.id} className="p-3 bg-white/5 rounded mb-3">
          <div className="font-bold">{a.name}</div>
          <div>Stake: ${a.stake}</div>
          <div>Daily ROI: {Math.round(a.dailyRoi*100)}%</div>
          <div>Ends: {new Date(a.endAt).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
