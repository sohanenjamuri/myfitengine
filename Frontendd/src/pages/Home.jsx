
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071133] to-[#0f172a] text-slate-100">
      <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ring-1 ring-white/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="9" width="22" height="6" rx="3" fill="#ffd166" opacity=".95" />
              <rect x="0.5" y="7" width="4" height="10" rx="2" fill="#ff7a59" />
              <rect x="19.5" y="7" width="4" height="10" rx="2" fill="#ff7a59" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-xl">MyFitEngine <span className="text-amber-300">AI</span></div>
            <div className="text-xs text-slate-400 -mt-0.5">Personalized fitness & nutrition</div>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm px-3 py-2 rounded-md bg-white/6 hover:bg-white/8 transition">Sign in</Link>
          <Link to="/Register" className="text-sm px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 transition font-medium">Create account</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid gap-12 lg:grid-cols-2 items-center">
        {/* Left: hero content */}
        <section className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Smart plans that adapt to <span className="text-emerald-300">you</span>
          </h1>
          <p className="text-slate-300 max-w-xl">
            MyFitEngine AI builds dynamic meal & workout plans from your biometrics, available foods, and equipment.
            Realistic goals, practical habits, and recommendations that actually fit your life — not the other way around.
          </p>

          <div className="flex gap-4 items-center">
            <Link to="/Register" className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-semibold shadow-lg transition">
              Get started
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-white/10 text-sm hover:bg-white/4 transition">
              Already have an account
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-4 rounded-xl bg-white/4 border border-white/6">
              <div className="text-sm text-slate-200 font-semibold">Personalized Calories</div>
              <div className="text-2xl font-bold mt-2">BMR → TDEE → Targets</div>
            </div>
            <div className="p-4 rounded-xl bg-white/4 border border-white/6">
              <div className="text-sm text-slate-200 font-semibold">Dynamic Meal Plans</div>
              <div className="text-2xl font-bold mt-2">Use only what you have</div>
            </div>
            <div className="p-4 rounded-xl bg-white/4 border border-white/6">
              <div className="text-sm text-slate-200 font-semibold">Workout Builder</div>
              <div className="text-2xl font-bold mt-2">Gear-aware routines</div>
            </div>
            <div className="p-4 rounded-xl bg-white/4 border border-white/6">
              <div className="text-sm text-slate-200 font-semibold">Progress you keep</div>
              <div className="text-2xl font-bold mt-2">Realistic & sustainable</div>
            </div>
          </div>
        </section>

        {/* Right: hero image / card */}
        <aside className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/6">
            {/* Use uploaded image path as decorative photo */}
            <img
              src="fitness-hero.jpg"
              alt="fitness hero"
              className="w-full object-cover h-96 md:h-full"
            />
          </div>

          <div className="absolute left-6 bottom-6 bg-gradient-to-r from-white/10 to-white/6 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/6 shadow-lg w-[calc(100%-4rem)] md:w-[320px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-300">Starter plan</div>
                <div className="text-lg font-semibold">Free • Personalized</div>
              </div>
              <div className="text-emerald-300 font-bold">Try now</div>
            </div>
            <div className="text-sm text-slate-400 mt-2">
              Quick setup — add your biometrics & available foods. We'll build a simple plan you can use today.
            </div>
          </div>
        </aside>
      </main>

      <footer className="border-t border-white/6 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
          <div>© {new Date().getFullYear()} MyFitEngine AI</div>
          <div className="flex gap-6">
            <a className="hover:underline" href="/Register">Create account</a>
            <a className="hover:underline" href="/login">Sign in</a>
            <a className="hover:underline" href="mailto:support@myfitengine.example">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
