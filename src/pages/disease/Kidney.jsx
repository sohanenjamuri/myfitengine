
// import React, { useState } from "react";
// import DiseasePage from "../../pages/DiseasePage";
// import PlannerResult from "../../components/PlannerResult";
// import { planMeals } from "../../utils/mealPlanner";
// import { planWorkout } from "../../utils/workoutPlanner";

// export default function Kidney() {
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   async function createPlanner() {
//     setLoading(true);
//     const user = JSON.parse(localStorage.getItem("user_profile") || "null") || { weight: 70, height: 170, age: 30, gender: "male" };
//     const meals = planMeals({ disease: "kidney", user, mealCount: 3 });
//     const workout = planWorkout({ disease: "kidney", equipment: [], focus: "full" });
//     setPlan({ ...meals, workout });
//     try { localStorage.setItem("myfit_last_plan", JSON.stringify({ tdee: meals.tdee, meals: meals.meals })); } catch (_) {}
//     setLoading(false);
//   }

//   return (
//     <>
//       <DiseasePage
//         slug="kidney"
//         title="Kidney"
//         heroImage=""
//         quickTips={[
//           "Monitor potassium & phosphorus in meals",
//           "Prioritize high-quality protein in controlled amounts",
//           "Stay hydrated but follow clinical fluid guidance"
//         ]}
//         recommendedMeals={[
//           "White rice bowl with low-potassium veggies",
//           "Grilled fish with a light salad",
//           "Tofu stir-fry with controlled portion"
//         ]}
//         recommendedWorkouts={[
//           { name: "Low-impact Cardio", notes: "Cycling or brisk walking" },
//           { name: "Light Resistance", notes: "Keep intensity moderate" }
//         ]}
//       />

//       <div className="max-w-4xl mx-auto p-6 text-center">
//         <button onClick={createPlanner} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
//           {loading ? "Creating..." : "Create Planner for Kidney"}
//         </button>
//         <PlannerResult plan={plan} />
//       </div>
//     </>
//   );
// }


// src/pages/disease/Kidney.jsx
// import React, { useEffect, useState } from "react";
// import ProfileForm from "../../components/ProfileForm";
// import { planMeals } from "../../utils/mealPlanner";
// import { planWorkout } from "../../utils/workoutPlanner";

// export default function Kidney() {
//   const [profile, setProfile] = useState(null);
//   const [plan, setPlan] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // load any saved profile on mount
//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("user_profile");
//       if (raw) setProfile(JSON.parse(raw));
//     } catch (_) {}
//   }, []);

//   // handler when ProfileForm saves a profile (ProfileForm should call onSave with profile object)
//   function handleProfileSave(p) {
//     setProfile(p);
//     try {
//       localStorage.setItem("user_profile", JSON.stringify(p));
//     } catch (_) {}
//   }

//   // create planner: calls planMeals + planWorkout and stores plan
//   async function createPlanner() {
//     setLoading(true);

//     // fallback user values if profile missing
//     const user = {
//       age: profile?.age ?? 30,
//       height: profile?.height ?? 170,
//       weight: profile?.weight ?? 70,
//       gender: profile?.gender ?? "male",
//     };

//     try {
//       const meals = await planMeals({ disease: "kidney", user, mealCount: 3 });
//       const workout = await planWorkout({ disease: "kidney", user, equipment: [], focus: "full" });

//       const p = {
//         disease: "kidney",
//         tdee: meals.tdee,
//         meals: meals.meals,
//         macros: meals.macros,
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
//           <h1 className="text-2xl font-bold">Kidney — Planner</h1>
//           <p className="text-sm text-gray-600">
//             Kidney-friendly planner: controlled protein, watch potassium & phosphorus.
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
//             <button
//               onClick={() => {
//                 setPlan(null);
//               }}
//               className="px-3 py-2 border rounded"
//             >
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
//                 <div className="text-2xl font-bold">{plan.tdee}</div>
//                 {plan.macros && (
//                   <div className="text-sm text-gray-600 mt-2">
//                     P: {plan.macros.proteinG}g • C: {plan.macros.carbsG}g • F: {plan.macros.fatsG}g
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 border rounded">
//                 <div className="text-sm text-gray-500">Meals</div>
//                 <ul className="list-disc pl-5 mt-2">
//                   {plan.meals.map((m, i) => (
//                     <li key={i}>{m}</li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="p-4 border rounded">
//                 <div className="text-sm text-gray-500">Workout</div>
//                 <ul className="list-disc pl-5 mt-2">
//                   {plan.workout.map((w, i) => (
//                     <li key={i}>
//                       <strong>{w.name}</strong> — <span className="text-sm text-gray-600">{w.notes}</span>
//                     </li>
//                   ))}
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


// src/pages/disease/Kidney.jsx
// import React, { useState, useEffect } from "react";
// import ProfileForm from "../../components/ProfileForm";
// import PlannerResult from "../../components/PlannerResult";
// import { planMeals } from "../../utils/mealPlanner";
// import { planWorkout } from "../../utils/workoutPlanner";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../../firebase-config";
// import { useNavigate } from "react-router-dom";

// export default function Kidney() {
//   const [profile, setProfile] = useState(null);
//   const [result, setResult] = useState(null);
//   const navigate = useNavigate();

//   useEffect(()=>{
//     const unsub = onAuthStateChanged(auth, (u)=>{
//       if(!u) {
//         // if user not logged in, redirect to login page
//         navigate("/login");
//       }
//     });
//     return () => unsub();
//   }, [navigate]);

//   async function handleCreatePlan(values) {
//     // values = { age, height, weight, gender }
//     setProfile(values);
//     // compute meals + workout
//     const mealResult = planMeals(values, "kidney");
//     const workout = planWorkout(values, "kidney");
//     const combined = {
//       ...mealResult,
//       workout
//     };
//     setResult(combined);
//     // optionally persist to localStorage
//     try {
//       localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "kidney", ...combined }));
//     } catch (_) {}
//     // scroll to results
//     setTimeout(()=> {
//       document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" });
//     }, 80);
//   }

//   const handleSave = (res) => {
//     // example: save to localStorage or call firestore if you want
//     try {
//       const saved = { disease: "kidney", profile, timestamp: Date.now(), ...res };
//       localStorage.setItem("myfit_saved_plan", JSON.stringify(saved));
//       alert("Plan saved locally");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-6">
//           <h1 className="text-3xl font-bold">Kidney — Planner</h1>
//           <p className="text-gray-600 mt-2">Controlled-protein meals and low-potassium choices.</p>
//         </header>

//         <ProfileForm initial={profile || {}} onSubmit={handleCreatePlan} submitLabel="Create Kidney Plan" />

//         <div id="plannerResults" className="mt-6">
//           <PlannerResult result={result} onSave={handleSave} />
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/disease/Kidney.jsx
import React, { useState, useEffect } from "react";
import ProfileForm from "../../components/ProfileForm";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

export default function Kidney() {
  const [profile, setProfile] = useState(null);        // profile from ProfileForm
  const [selectedMeals, setSelectedMeals] = useState([]); // user-chosen meal titles
  const [result, setResult] = useState(null);          // final plan (meals + workout + macros)
  const [step, setStep] = useState(1);                 // 1 = profile, 2 = pick meals, 3 = show result
  const navigate = useNavigate();

  // simple kidney-specific meal choices (kept small so UI is snappy)
  const MEAL_OPTIONS = [
    "White rice bowl + low-potassium veg",
    "Grilled fish + light salad",
    "Tofu & veggies (controlled portion)",
    "Steamed white fish + steamed veg",
    "Quinoa & veg (small portion)",
    "Light lentil soup (controlled sodium)"
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/login");
      }
    });
    return () => unsub();
  }, [navigate]);

  // called when ProfileForm submits
  async function handleProfileSubmit(values) {
    // values: { age, height, weight, gender }
    setProfile(values);
    setStep(2); // proceed to meal selection
    // clear previous result / selection
    setSelectedMeals([]);
    setResult(null);
    // scroll a bit to meal selection
    setTimeout(() => {
      document.getElementById("mealSelection")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  function toggleMealOption(title) {
    setSelectedMeals((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
  }

  // calculate using planMeals and planWorkout; prefer user-selected meals
  function handleCalculatePlan() {
    if (!profile) {
      alert("Please enter your profile first.");
      return;
    }

    // call the shared planner util which returns tdee/macros + default bank meals
    const mealPlan = planMeals(profile, "kidney");
    const workout = planWorkout(profile, "kidney");

    // Use selectedMeals if any; otherwise fall back to planner's meals
    let finalMeals;
    if (selectedMeals && selectedMeals.length) {
      // Map user selections to simple meal objects
      finalMeals = selectedMeals.map((t) => ({ title: t }));
      // Fill remaining slots (to ensure 4 items) from mealPlan.meals avoiding duplicates
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

    // persist a quick last-plan summary for dashboard
    try {
      localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "kidney", tdee: combined.tdee, meals: combined.meals }));
    } catch (_) {}

    setTimeout(() => {
      document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }

  const handleSave = (res) => {
    try {
      const saved = { disease: "kidney", profile, timestamp: Date.now(), ...res };
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
          <h1 className="text-3xl font-bold">Kidney — Personalized Planner</h1>
          <p className="text-gray-600 mt-2">We'll ask a few profile questions, let you choose some kidney-friendly meals, then create a tailored plan.</p>
        </header>

        {/* STEP 1: PROFILE */}
        <div id="profileForm" className="mb-6">
          <ProfileForm initial={profile || {}} onSubmit={handleProfileSubmit} submitLabel={profile ? "Update Profile" : "Next: Choose Meals"} />
        </div>

        {/* STEP 2: MEAL selection */}
        {step >= 2 && (
          <section id="mealSelection" className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-3">Choose preferred meals (optional)</h2>
            <p className="text-sm text-gray-600 mb-4">Pick the meals you'd prefer — selected items will be prioritized in the final plan.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MEAL_OPTIONS.map((m) => {
                const checked = selectedMeals.includes(m);
                return (
                  <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleMealOption(m)} />
                    <div>
                      <div className="font-medium">{m}</div>
                      <div className="text-sm text-gray-500">Kidney-friendly, controlled portions</div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleCalculatePlan} className="bg-emerald-600 text-white px-4 py-2 rounded">Calculate Plan</button>
              <button onClick={resetToProfile} className="px-4 py-2 rounded border">Edit profile</button>
              <button onClick={() => { setSelectedMeals([]); }} className="px-3 py-2 rounded border">Clear selections</button>
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

