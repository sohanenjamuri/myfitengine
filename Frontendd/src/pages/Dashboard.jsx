import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUser } from "../utils/api";

const DISEASES = [
  { key: "diabetes", label: "Diabetes" },
  { key: "hypertension", label: "Hypertension" },
  { key: "pcos", label: "PCOS" },
  { key: "cardiac", label: "Cardiac" },
  { key: "kidney", label: "Kidney" },
  { key: "none", label: "None" },
];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [recentPlan, setRecentPlan] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }
      setUserName(u.displayName || u.email || "");
      setUserPhoto(u.photoURL || null);

      try {
        const user = await getUser(u.uid);
        if (user && user.lastPlan) {
          setRecentPlan(user.lastPlan);
        }
      } catch (e) {
        console.error("Failed to fetch recent plan:", e);
      }
    });
    return () => unsub();
  }, [navigate]);

  // close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setShowMenu(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setShowMenu(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const doSignOut = async () => {
    await signOut(auth).catch(console.error);
    navigate("/login");
  };

  const openDisease = (key) => {
    navigate(`/${key}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/dashboard" className="text-xl font-bold">
            MyFitEngine
          </Link>

          <nav className="ml-6 space-x-4 hidden md:inline-block">
            <Link to="/dashboard" className="underline">
              Dashboard
            </Link>
            <Link to="/planner" className="hover:underline">
              Planner
            </Link>
            <Link to="/analytics" className="hover:underline">
              Analytics
            </Link>
          </nav>

          {/* Profile avatar + dropdown */}
          <div ref={menuRef} className="ml-auto relative">
            <button
              onClick={() => setShowMenu((s) => !s)}
              aria-haspopup="true"
              aria-expanded={showMenu}
              className="flex items-center gap-3 focus:outline-none"
            >
              {/* avatar circle */}
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-white font-semibold">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-md w-44 py-1 z-50 text-gray-800">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/profile");
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    doSignOut();
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold">Today's summary</h3>
            <div className="mt-3 text-3xl font-bold">
              {recentPlan ? `${recentPlan.tdee} kcal` : "No saved plan"}
            </div>
            <div className="mt-2 text-sm text-gray-500">Profile to see personalized info</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold">Quick actions</h3>
            <div className="mt-3 space-x-2">
              <Link to="/planner" className="bg-indigo-600 text-white px-3 py-1 rounded">
                Open planner
              </Link>
              <Link to="/meals" className="border px-3 py-1 rounded">
                Meals
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold">Recent plan</h3>
            <div className="mt-3 text-sm text-gray-700">
              {recentPlan ? `${recentPlan.tdee} kcal • ${recentPlan.meals?.length || 0} meals` : "No saved plan"}
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Condition-specific pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DISEASES.map((d) => (
              <button
                key={d.key}
                onClick={() => openDisease(d.key)}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-md text-left"
              >
                <div className="font-semibold text-lg">{d.label}</div>
                <div className="text-sm text-gray-500 mt-1">Open {d.label} planner & tips</div>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold mb-4">Health & Goals</h3>

            {/* BMI Gauge */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-gray-700">BMI Status</span>
                {recentPlan?.profile?.height && recentPlan?.profile?.weight ? (
                  <span className="text-2xl font-bold text-indigo-600">
                    {(recentPlan.profile.weight / ((recentPlan.profile.height / 100) ** 2)).toFixed(1)}
                  </span>
                ) : <span className="text-sm text-gray-400">--</span>}
              </div>

              {recentPlan?.profile?.height && recentPlan?.profile?.weight ? (
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden flex">
                  {/* BMI Zones */}
                  <div className="w-[18.5%] bg-blue-300 h-full" title="Underweight" />
                  <div className="w-[26.5%] bg-emerald-400 h-full" title="Normal" />
                  <div className="w-[25%] bg-yellow-400 h-full" title="Overweight" />
                  <div className="w-[30%] bg-red-400 h-full" title="Obese" />

                  {/* Marker */}
                  {(() => {
                    const bmi = recentPlan.profile.weight / ((recentPlan.profile.height / 100) ** 2);
                    // Map BMI 0-40 to 0-100%
                    const left = Math.min(Math.max((bmi / 40) * 100, 0), 100);
                    return (
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-black border-white border-x"
                        style={{ left: `${left}%` }}
                      />
                    );
                  })()}
                </div>
              ) : (
                <div className="h-4 bg-gray-100 rounded-full text-xs flex items-center justify-center text-gray-400">
                  Update profile to see BMI
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40+</span>
              </div>
            </div>

            {/* Macro Targets */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Daily Targets</h4>
              {recentPlan?.macros ? (
                <div className="space-y-3">
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Protein</span>
                      <span className="font-bold">{recentPlan.macros.proteinG}g</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-3/4 rounded-full" />
                    </div>
                  </div>
                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Carbs</span>
                      <span className="font-bold">{recentPlan.macros.carbsG}g</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-1/2 rounded-full" />
                    </div>
                  </div>
                  {/* Fat */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Fats</span>
                      <span className="font-bold">{recentPlan.macros.fatG}g</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-1/3 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 text-center py-2">No active plan</div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold">Tips</h3>
            <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
              <li>Save profile for better plans</li>
              <li>Log workouts to track progress</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
