
import React from "react";
import { Link } from "react-router-dom";

export default function DiseasePage({ slug, title, quickTips = [], recommendedMeals = [], recommendedWorkouts = [], heroImage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071133] to-[#0f172a] text-slate-100">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold">MyFitEngine <span className="text-amber-300">AI</span></Link>
          <div className="text-xs text-slate-400">Condition: {title}</div>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/dashboard" className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/8">Dashboard</Link>
          <Link to="/planner" className="px-4 py-2 rounded-md bg-emerald-500">Open Planner</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2 bg-white/5 p-6 rounded-2xl">
          <div className="flex gap-6 items-start">
            <div className="w-40 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0 border border-white/6">
              <img src={heroImage} alt={`${title} hero`} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{title} — Friendly Plan</h1>
              <p className="mt-3 text-slate-300">
                Personalized suggestions for <strong>{title}</strong>. This page highlights dietary changes, workout
                considerations, and quick safety tips that help you pursue fitness while managing your condition.
              </p>

              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/6">
                  <div className="text-sm font-semibold">Top Tips</div>
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {quickTips.map((t,i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white/6">
                  <div className="text-sm font-semibold">Recommended Meals</div>
                  <ul className="mt-2 list-disc pl-5 text-sm">
                    {recommendedMeals.map((m,i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Workout Notes</h3>
            <div className="mt-2 grid md:grid-cols-2 gap-4">
              {recommendedWorkouts.map((w, i) => (
                <div key={i} className="p-4 rounded-lg bg-white/5">
                  <div className="font-medium">{w.name}</div>
                  <div className="text-sm text-slate-300 mt-1">{w.notes}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="p-6 rounded-2xl bg-white/3 border border-white/6">
          <div className="text-sm text-slate-200 font-semibold">Action</div>
          <div className="mt-3 space-y-3">
            <Link to="/planner" className="block text-center py-2 rounded bg-emerald-500 font-medium">Create a Planner</Link>
            <Link to="/meals" className="block text-center py-2 rounded border">Browse Meals</Link>
            <a href="#safety" className="block text-center py-2 rounded bg-white/6">Safety Info</a>
          </div>

          <div className="mt-6 text-xs text-slate-300">
            <strong>Note:</strong> This is educational content — always consult your doctor for medical advice.
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto p-6 text-slate-400">
        © {new Date().getFullYear()} MyFitEngine AI — {title}
      </footer>
    </div>
  );
}
