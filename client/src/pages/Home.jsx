import React from "react";
import { Link } from "react-router-dom";

export default function Home(){
  return (
    <main className="p-8">
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">Profit Bliss</h1>
        <p className="text-lg">Secure crypto investment plans with daily ROI.</p>
        <div className="flex justify-center gap-4">
          <Link to="/signup" className="px-6 py-3 bg-emerald-400 rounded text-black">Get Started</Link>
          <Link to="/about" className="px-6 py-3 border rounded">Learn more</Link>
        </div>
      </section>
    </main>
  );
}
