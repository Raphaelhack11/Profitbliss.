const API = (import.meta.env.VITE_API_BASE || '') + '/api';

export async function api(path, opts = {}){
  const token = localStorage.getItem('pb_token');
  const headers = opts.headers || {};
  if(token) headers['Authorization'] = `Bearer ${token}`;
  if(opts.body && !(opts.body instanceof FormData)) headers['Content-Type']='application/json';
  const res = await fetch(API + path, { ...opts, headers, body: opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body });
  const data = await res.json().catch(()=>null);
  if(!res.ok) throw data || { error: 'Request failed' };
  return data;
    }
