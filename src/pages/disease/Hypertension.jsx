// // src/pages/diseases/Hypertension.jsx
// import React from "react";
// import DiseasePage from "../DiseasePage";

// const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

// export default function Hypertension() {
//   return (
//     <DiseasePage
//       slug="hypertension"
//       title="Hypertension"
//       heroImage={hero}
//       quickTips={[
//         "Reduce sodium; prefer whole foods over processed",
//         "Increase potassium-rich foods if advised",
//         "Prioritize aerobic exercise for heart health"
//       ]}
//       recommendedMeals={[
//         "Oats with fruits and nuts",
//         "Grilled salmon, sweet potato, spinach",
//         "Lentil stew and salad"
//       ]}
//       recommendedWorkouts={[
//         { name: "Aerobic Cardio", notes: "30 min moderate intensity most days" },
//         { name: "Mobility & Core", notes: "Daily light mobility helps overall health" }
//       ]}
//     />
//   );
// }


// import React, { useState } from "react";
// import DiseasePage from "../../pages/DiseasePage";
// import PlannerResult from "../../components/PlannerResult";
// import { planMeals } from "../../utils/mealPlanner";
// import { planWorkout } from "../../utils/workoutPlanner";

// export default function Hypertension() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   async function createPlanner() {
//     setLoading(true);
//     const user = JSON.parse(localStorage.getItem("user_profile") || "null") || { weight: 70, height: 170, age: 45, gender: "male" };
//     const meals = planMeals({ disease: "hypertension", user, mealCount: 3 });
//     const workout = planWorkout({ disease: "hypertension", equipment: [], focus: "full" });
//     setPlan({ ...meals, workout });
//     try { localStorage.setItem("myfit_last_plan", JSON.stringify({ tdee: meals.tdee, meals: meals.meals })); } catch (_) {}
//     setLoading(false);
//   }

//   return (
//     <>
//       <DiseasePage
//         slug="hypertension"
//         title="Hypertension"
//         heroImage=""
//         quickTips={[
//           "Reduce sodium; prefer whole foods over processed",
//           "Increase potassium-rich foods if advised",
//           "Prioritize aerobic exercise for heart health"
//         ]}
//         recommendedMeals={[
//           "Oats with fruits and nuts",
//           "Grilled salmon, sweet potato, spinach",
//           "Lentil stew and salad"
//         ]}
//         recommendedWorkouts={[
//           { name: "Aerobic Cardio", notes: "30 min moderate intensity most days" },
//           { name: "Mobility & Core", notes: "Daily light mobility helps overall health" }
//         ]}
//       />

//       <div className="max-w-4xl mx-auto p-6 text-center">
//         <button onClick={createPlanner} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
//           {loading ? "Creating..." : "Create Planner for Hypertension"}
//         </button>
//         <PlannerResult plan={plan} />
//       </div>
//     </>
//   );
// }

// src/pages/disease/Hypertension.jsx
// import React, { useEffect, useState } from "react";
// import ProfileForm from "../../components/ProfileForm";
// import { planMeals } from "../../utils/mealPlanner";
// import { planWorkout } from "../../utils/workoutPlanner";

// export default function Hypertension() {
//   const [profile, setProfile] = useState(null);
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("user_profile");
//       if (raw) setProfile(JSON.parse(raw));
//     } catch (_) {}
//   }, []);

//   function handleProfileSave(p) {
//     setProfile(p);
//     try {
//       localStorage.setItem("user_profile", JSON.stringify(p));
//     } catch (_) {}
//   }

//   async function createPlanner() {
//     setLoading(true);
//     const user = {
//       age: profile?.age ?? 45,
//       height: profile?.height ?? 170,
//       weight: profile?.weight ?? 78,
//       gender: profile?.gender ?? "male",
//     };

//     try {
//       const meals = await planMeals({ disease: "hypertension", user, mealCount: 3 });
//       const workout = await planWorkout({ disease: "hypertension", user, equipment: [], focus: "cardio" });

//       const p = {
//         disease: "hypertension",
//         tdee: meals.tdee,
//         meals: meals.meals || [],
//         macros: meals.macros || null,
//         workout,
//         createdAt: Date.now(),
//       };

//       setPlan(p);
//       try {
//         localStorage.setItem("myfit_last_plan", JSON.stringify(p));
//       } catch (_) {}
//     } catch (err) {
//       console.error("createPlanner error:", err);
//       alert("Failed to create a plan. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-6">
//           <h1 className="text-2xl font-bold">Hypertension — Planner</h1>
//           <p className="text-sm text-gray-600">
//             Hypertension-friendly planner: low-sodium meals, potassium-aware choices and regular aerobic sessions.
//           </p>
//         </header>

//         <section className="bg-white p-6 rounded shadow mb-6">
//           <h3 className="font-semibold mb-3">Your profile</h3>
//           <ProfileForm initialProfile={profile} onSave={handleProfileSave} />
//           <div className="mt-4 flex gap-3">
//             <button
//               onClick={createPlanner}
//               disabled={loading}
//               className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
//             >
//               {loading ? "Creating…" : "Create Planner"}
//             </button>
//             <button onClick={() => setPlan(null)} className="px-3 py-2 border rounded">
//               Reset Result
//             </button>
//           </div>
//         </section>

//         {plan ? (
//           <section className="bg-white p-6 rounded shadow">
//             <h3 className="font-semibold mb-3">Plan result</h3>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div className="p-4 border rounded">
//                 <div className="text-sm text-gray-500">Target kcal</div>
//                 <div className="text-2xl font-bold">{plan.tdee ?? "—"}</div>
//                 {plan.macros && (
//                   <div className="text-sm text-gray-600 mt-2">
//                     P: {plan.macros.proteinG}g • C: {plan.macros.carbsG}g • F: {plan.macros.fatsG}g
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border rounded">
//                 <div className="text-sm text-gray-500">Meals</div>
//                 <ul className="list-disc pl-5 mt-2">
//                   {(plan.meals && plan.meals.length) ? plan.meals.map((m, i) => (
//                     <li key={i}>{m}</li>
//                   )) : <li className="text-sm text-gray-500">No meals generated</li>}
//                 </ul>
//               </div>

//               <div className="p-4 border rounded">
//                 <div className="text-sm text-gray-500">Workout</div>
//                 <ul className="list-disc pl-5 mt-2">
//                   {(plan.workout && plan.workout.length) ? plan.workout.map((w, i) => (
//                     <li key={i}>
//                       <strong>{w.name}</strong> — <span className="text-sm text-gray-600">{w.notes}</span>
//                     </li>
//                   )) : <li className="text-sm text-gray-500">No workout generated</li>}
//                 </ul>
//               </div>
//             </div>

//             <div className="text-sm text-gray-500">Saved to local storage.</div>
//           </section>
//         ) : (
//           <div className="text-gray-600 mt-4">No plan yet. Complete your profile and click Create Planner.</div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/pages/disease/Hypertension.jsx
import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export default function Hypertension() {
  const [profile, setProfile] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1); // 1 = profile, 2 = meal select, 3 = results
  const navigate = useNavigate();

  // Hypertension-friendly sample meal options (user will choose preferred ones)
  const MEAL_OPTIONS = [
    "Oats with berries and a sprinkle of seeds",
    "Grilled salmon with steamed spinach and quinoa",
    "Lentil & vegetable stew (low-sodium)",
    "Chicken & mixed greens with lemon vinaigrette",
    "Roasted sweet potato with sautéed greens",
    "Greek yogurt with fruit and walnuts (light on added salt)"
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

    // compute using shared utils
    const mealPlan = planMeals(profile, "hypertension");
    const workout = planWorkout(profile, "hypertension");

    // prefer user-selected meals if provided
    let finalMeals;
    if (selectedMeals && selectedMeals.length) {
      finalMeals = selectedMeals.map((t) => ({ title: t }));
      const needed = 4 - finalMeals.length;
      if (needed > 0) {
        const filler = (mealPlan.meals || []).filter((m) => !selectedMeals.includes(m.title)).slice(0, needed);
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
      localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "hypertension", tdee: combined.tdee, meals: combined.meals }));
    } catch (_) {}

    setTimeout(() => {
      document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  const handleSave = (res) => {
    try {
      const saved = { disease: "hypertension", profile, timestamp: Date.now(), ...res };
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
          <h1 className="text-3xl font-bold">Hypertension — Personalized Planner</h1>
          <p className="text-gray-600 mt-2">Enter your profile, pick low-sodium meals, then create a heart-healthy plan.</p>
        </header>

        {/* STEP 1: PROFILE */}
        <div id="profileForm" className="mb-6">
          <ProfileForm initial={profile || {}} onSubmit={handleProfileSubmit} submitLabel={profile ? "Update Profile" : "Next: Choose Meals"} />
        </div>

        {/* STEP 2: MEAL SELECTION */}
        {step >= 2 && (
          <section id="mealSelection" className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-3">Choose preferred meals (optional)</h2>
            <p className="text-sm text-gray-600 mb-4">Pick meals you'd like prioritized — low-sodium, high-fiber options are recommended.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEAL_OPTIONS.map((m) => {
                const checked = selectedMeals.includes(m);
                return (
                  <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleMealOption(m)} />
                    <div>
                      <div className="font-medium">{m}</div>
                      <div className="text-sm text-gray-500">Low-sodium, heart-friendly choice</div>
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

        {/* STEP 3: RESULTS */}
        <div id="plannerResults" className="mt-6">
          <PlannerResult result={result} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}

