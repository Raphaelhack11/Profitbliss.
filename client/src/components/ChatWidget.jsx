import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(undefined, { autoConnect: false });

export default function ChatWidget(){
  const [open,setOpen] = useState(false);
  const [messages,setMessages] = useState([]);
  const [text,setText] = useState('');
  useEffect(()=>{
    socket.connect();
    const user = JSON.parse(localStorage.getItem('pb_user')||'null');
    if(user) socket.emit('identify', { userId: user.id });
    socket.on('message:fromAdmin', (m) => setMessages(prev=>[...prev,{fromAdmin:true,body:m.body}]));
    socket.on('message:ack', (m) => setMessages(prev=>[...prev,{fromAdmin:false,body:m.body}]));
    return ()=>socket.disconnect();
  },[]);

  function send(){
    const user = JSON.parse(localStorage.getItem('pb_user')||'null');
    if(!user) return alert('Please login');
    socket.emit('user:message',{ userId: user.id, body: text });
    setMessages(prev=>[...prev,{fromAdmin:false,body:text}]);
    setText('');
  }

  return (
    <>
      <button onClick={()=>setOpen(v=>!v)} className="fixed bottom-6 right-6 rounded-full p-4 bg-indigo-600 text-white z-50">💬</button>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white/5 p-3 rounded z-50">
          <div className="h-48 overflow-auto space-y-2">
            {messages.map((m,i)=>
              <div key={i} className={`p-2 rounded ${m.fromAdmin ? 'bg-indigo-600 text-white self-start' : 'bg-white/10 self-end'}`}>
                {m.body}
              </div>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input className="flex-1 input" value={text} onChange={e=>setText(e.target.value)} />
            <button className="px-3 py-1 bg-indigo-600 rounded" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
