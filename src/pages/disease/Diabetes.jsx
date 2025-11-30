import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export default function Diabetes() {
  const [profile, setProfile] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1); 
  const navigate = useNavigate();

  
  const MEAL_OPTIONS = [
    "Oats porridge with berries & a sprinkle of seeds",
    "Greek yogurt bowl with nuts and a small portion of oats",
    "Grilled chicken salad with leafy greens and quinoa",
    "Lentil soup with mixed vegetables and a side of whole grain toast",
    "Tofu & vegetable stir-fry with brown rice (controlled portion)",
    "Chickpea & avocado salad with lemon-olive oil dressing"
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/login");
    });
    return () => unsub();
  }, [navigate]);

  async function handleProfileSubmit(values) {
    setProfile(values);
    setStep(2);
    setSelectedMeals([]);
    setResult(null);
    setTimeout(() => {
      document.getElementById("mealSelection")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function toggleMealOption(title) {
    setSelectedMeals((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
  }

  function handleCalculatePlan() {
    if (!profile) {
      alert("Please enter your profile first.");
      return;
    }

    
    const mealPlan = planMeals(profile, "diabetes");
    const workout = planWorkout(profile, "diabetes");

  
    let finalMeals;
    if (selectedMeals && selectedMeals.length) {
      finalMeals = selectedMeals.map((t) => ({ title: t }));
      const needed = 4 - finalMeals.length;
      if (needed > 0) {
        const filler = (mealPlan.meals || [])
          .filter((m) => !selectedMeals.includes(m.title))
          .slice(0, needed);
        finalMeals = finalMeals.concat(filler);
      }
    } else {
      finalMeals = mealPlan.meals || [];
    }

    const combined = {
      bmr: mealPlan.bmr,
      tdee: mealPlan.tdee,
      macros: mealPlan.macros,
      meals: finalMeals,
      workout
    };

    setResult(combined);
    setStep(3);

    try {
      localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "diabetes", tdee: combined.tdee, meals: combined.meals }));
    } catch (_) {}

    setTimeout(() => {
      document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  const handleSave = (res) => {
    try {
      const saved = { disease: "diabetes", profile, timestamp: Date.now(), ...res };
      localStorage.setItem("myfit_saved_plan", JSON.stringify(saved));
      alert("Plan saved locally");
    } catch (e) {
      console.error(e);
      alert("Could not save plan");
    }
  };

  const resetToProfile = () => {
    setStep(1);
    setProfile(null);
    setSelectedMeals([]);
    setResult(null);
    setTimeout(() => document.getElementById("profileForm")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Diabetes — Blood-Sugar Friendly Planner</h1>
          <p className="text-gray-600 mt-2">Enter your profile, choose low-GI meals, then create a glucose-sensible plan.</p>
        </header>

      
        <div id="profileForm" className="mb-6">
          <ProfileForm initial={profile || {}} onSubmit={handleProfileSubmit} submitLabel={profile ? "Update Profile" : "Next: Choose Meals"} />
        </div>

        
        {step >= 2 && (
          <section id="mealSelection" className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-3">Choose preferred meals (optional)</h2>
            <p className="text-sm text-gray-600 mb-4">Pick meals you'd like prioritized — focus on low-GI carbs, fibre and balanced protein.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEAL_OPTIONS.map((m) => {
                const checked = selectedMeals.includes(m);
                return (
                  <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleMealOption(m)} />
                    <div>
                      <div className="font-medium">{m}</div>
                      <div className="text-sm text-gray-500">Low glycemic index choice</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleCalculatePlan} className="bg-emerald-600 text-white px-4 py-2 rounded">Calculate Plan</button>
              <button onClick={resetToProfile} className="px-4 py-2 rounded border">Edit profile</button>
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
