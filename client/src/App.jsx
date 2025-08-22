import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ActivePlans from "./pages/ActivePlans";
import VerifyPage from "./pages/VerifyPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ChatWidget from "./components/ChatWidget";

export default function App(){
  const [theme, setTheme] = useState(localStorage.getItem('pb_theme') || 'dark');
  useEffect(()=>{ document.documentElement.className = theme; localStorage.setItem('pb_theme', theme); },[theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-700 via-purple-700 to-teal-500 text-white">
          <div className="font-bold text-xl">Profit Bliss</div>
          <div className="space-x-4">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button className="ml-4 px-3 py-1 bg-white/20 rounded" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?'Light':'Dark'}</button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/deposit" element={<Deposit/>} />
          <Route path="/withdraw" element={<Withdraw/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/plans/active" element={<ActivePlans/>} />
          <Route path="/verify" element={<VerifyPage/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
        </Routes>

        <ChatWidget />
      </div>
    </BrowserRouter>
  );
}
