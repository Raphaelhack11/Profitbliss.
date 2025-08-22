import React, { useEffect, useState } from "react";

export default function VerifyPage(){
  const [msg,setMsg] = useState('Verifying...');
  useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if(!token) { setMsg('Invalid token'); return; }
    fetch(`/api/auth/verify/${token}`).then(r=>{
      if(r.redirected) window.location = r.url;
      else setMsg('Verification complete — you can login.');
    }).catch(()=>setMsg('Verification failed'));
  },[]);
  return <div className="p-6 max-w-xl mx-auto"><h2>{msg}</h2></div>;
}
