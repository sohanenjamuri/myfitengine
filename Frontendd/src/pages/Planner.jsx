import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { getUser } from "../utils/api";

export default function Planner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(location?.state?.plan || null);
  const [loading, setLoading] = useState(!location?.state?.plan);

  useEffect(() => {
    if (plan) return;

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setLoading(false);
        return;
      }

      try {
        const user = await getUser(u.uid);
        if (user && user.lastPlan) {
          setPlan(user.lastPlan);
        } else if (user && user.savedPlans && user.savedPlans.length > 0) {
          // Use the most recent saved plan
          const sorted = user.savedPlans.sort((a, b) => b.timestamp - a.timestamp);
          const latest = sorted[0];
          // Normalize structure: savedPlans have data inside planData
          setPlan({
            disease: latest.disease,
            timestamp: latest.timestamp,
            ...latest.planData
          });
        }
      } catch (e) {
        console.error("Failed to load plan:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [plan]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">Loading plan...</div>;
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">No saved plan found</h2>
          <p className="text-sm text-gray-600 mb-4">Create a plan from the planner first.</p>
          <div className="flex gap-2">
            <button onClick={() => navigate("/dashboard")} className="px-4 py-2 rounded bg-indigo-600 text-white">Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const { disease, profile, tdee, macros, meals = [], workout = [] } = plan;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Saved Plan{disease ? ` — ${disease}` : ""}</h1>
          {profile && <p className="text-sm text-gray-600">Profile: {profile.name || "—"}, Age: {profile.age || "—"}, Height: {profile.height || "—"} cm, Weight: {profile.weight || "—"} kg</p>}
        </header>

        <section className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="font-semibold mb-3">Nutrition</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>Target Calories: <strong>{tdee || "—"}</strong></div>
            <div>Protein: <strong>{macros?.proteinG || "—"} g</strong></div>
            <div>Carbs: <strong>{macros?.carbsG || "—"} g</strong></div>
            <div>Fat: <strong>{macros?.fatG || "—"} g</strong></div>

          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="font-semibold mb-3">Meals</h2>
          <div className="space-y-3">
            {Array.isArray(meals) ? (
              meals.length ? meals.map((m, i) => (
                <div key={i} className="p-3 rounded border bg-gray-50">
                  <div className="font-medium">{m.title || m.name || `Meal ${i + 1}`}</div>
                  {m.desc && <div className="text-sm text-gray-600">{m.desc}</div>}
                </div>
              )) : <div className="text-sm text-gray-500">No meals in this plan</div>
            ) : (
              <div className="space-y-4">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                  meals[type] && meals[type].length > 0 && (
                    <div key={type}>
                      <h3 className="font-medium text-emerald-700 text-sm uppercase tracking-wide mb-2">{type}</h3>
                      <div className="space-y-2">
                        {meals[type].map((m, i) => (
                          <div key={i} className="p-3 rounded border bg-gray-50">
                            <div className="font-medium">{m.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Workout</h2>
          <div className="space-y-2">
            {workout.length ? workout.map((w, i) => (
              <div key={i} className="p-3 rounded border bg-gray-50 flex justify-between">
                <div>
                  <div className="font-medium">{w.name}</div>
                  {w.notes && <div className="text-sm text-gray-600">{w.notes}</div>}
                </div>
                {w.sets && <div className="text-sm text-gray-500">{w.sets}</div>}
              </div>
            )) : <div className="text-sm text-gray-500">No workout in this plan</div>}
          </div>
        </section>

        <div className="mt-6 flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded border">Back</button>
        </div>
      </div>
    </div>
  );
}
