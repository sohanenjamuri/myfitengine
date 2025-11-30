// src/pages/disease/Cardiac.jsx
import React, { useState, useEffect } from "react";
import DiseaseProfileForm from "../../components/DisaeseProfileForm";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

const MEAL_OPTIONS = [
  "Grilled salmon with steamed greens",
  "Baked chicken with quinoa & veg",
  "Lentil & vegetable stew (low-fat)",
  "Oats porridge with fruit & seeds",
  "Mixed bean salad with olive oil",
  "Steamed white fish and vegetables"
];

export default function Cardiac() {
  const [profile, setProfile] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1); // 1: profile, 2: meals, 3: result
  const navigate = useNavigate();
  const storageKey = "user_profile_cardiac";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/login");
    });

    // try to prefill if we have a saved cardiac profile
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && (saved.name || saved.age || saved.height || saved.weight)) {
          setProfile(saved);
          setStep(2);
        }
      }
    } catch (e) {
      console.warn("Could not parse cardiac profile:", e);
    }

    return () => unsub();
  }, [navigate]);

  const onProfileSubmit = (values) => {
    setProfile(values);
    setStep(2);
    setSelectedMeals([]);
    setResult(null);
    setTimeout(() => document.getElementById("mealSelection")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const toggleMealOption = (title) => {
    setSelectedMeals(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  const handleCalculatePlan = () => {
    if (!profile) {
      alert("Please enter your profile first.");
      return;
    }

    const mealPlan = planMeals(profile, "cardiac") || {};
    const workout = planWorkout(profile, "cardiac") || { items: [] };

    let finalMeals;
    if (selectedMeals && selectedMeals.length) {
      finalMeals = selectedMeals.map(t => ({ title: t }));
      const desired = (mealPlan.meals && mealPlan.meals.length) ? mealPlan.meals.length : 4;
      const needed = Math.max(0, desired - finalMeals.length);
      if (needed > 0) {
        const filler = (mealPlan.meals || []).filter(m => !selectedMeals.includes(m.title)).slice(0, needed);
        finalMeals = finalMeals.concat(filler);
      }
    } else {
      finalMeals = mealPlan.meals || [];
    }

    const combined = {
      bmr: mealPlan.bmr || null,
      tdee: mealPlan.tdee || null,
      macros: mealPlan.macros || null,
      meals: finalMeals,
      workout
    };

    setResult(combined);
    setStep(3);

    try {
      localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "cardiac", tdee: combined.tdee, meals: combined.meals }));
    } catch (_) {}

    setTimeout(() => document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const handleSave = (res) => {
    try {
      const saved = { disease: "cardiac", profile, timestamp: Date.now(), ...res };
      localStorage.setItem("myfit_saved_plan", JSON.stringify(saved));
      alert("Plan saved locally");
    } catch (e) {
      console.error(e);
      alert("Could not save plan");
    }
  };

  const editProfile = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Cardiac — Heart-Healthy Planner</h1>
          <p className="text-gray-600 mt-2">Enter a few profile details, choose heart-healthy meals, then create a safe plan.</p>
        </header>

        {step === 1 && (
          <div id="profileForm" className="mb-6">
            <DiseaseProfileForm
              initial={profile || {}}
              onSubmit={onProfileSubmit}
              submitLabel="Next: Choose Meals"
              storageKey={storageKey}
            />
          </div>
        )}

        {step >= 2 && (
          <section id="mealSelection" className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1">Choose preferred meals (optional)</h2>
                <p className="text-sm text-gray-600">Choose meals that are lower in saturated fat and sodium.</p>
              </div>
              <div>
                <button onClick={editProfile} className="text-sm underline text-gray-600">Edit profile</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {MEAL_OPTIONS.map(m => {
                const checked = selectedMeals.includes(m);
                return (
                  <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleMealOption(m)} />
                    <div>
                      <div className="font-medium">{m}</div>
                      <div className="text-sm text-gray-500">Heart-healthy option</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleCalculatePlan} className="bg-emerald-600 text-white px-4 py-2 rounded">Calculate Plan</button>
              <button onClick={editProfile} className="px-4 py-2 rounded border">Change profile</button>
              <button onClick={() => setSelectedMeals([])} className="px-3 py-2 rounded border">Clear selections</button>
            </div>
          </section>
        )}

        <div id="plannerResults" className="mt-6">
          <PlannerResult result={result} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
