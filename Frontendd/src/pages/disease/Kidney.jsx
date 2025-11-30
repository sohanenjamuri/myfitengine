
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
//   const [selectedMeals, setSelectedMeals] = useState([]); 
//   const [result, setResult] = useState(null);          
//   const [step, setStep] = useState(1);                 
//   const navigate = useNavigate();

//   const MEAL_OPTIONS = [
//     "White rice bowl + low-potassium veg",
//     "Grilled fish + light salad",
//     "Tofu & veggies (controlled portion)",
//     "Steamed white fish + steamed veg",
//     "Quinoa & veg (small portion)",
//     "Light lentil soup (controlled sodium)"
//   ];

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       if (!u) {
//         navigate("/login");
//       }
//     });
//     return () => unsub();
//   }, [navigate]);

  
//   async function handleProfileSubmit(values) {
    
//     setProfile(values);
//     setStep(2); 
    

//     setSelectedMeals([]);
//     setResult(null);
    

//     setTimeout(() => {
//       document.getElementById("mealSelection")?.scrollIntoView({ behavior: "smooth" });
//     }, 80);
//   }

//   function toggleMealOption(title) {
//     setSelectedMeals((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
//   }


//   function handleCalculatePlan() {
//     if (!profile) {
//       alert("Please enter your profile first.");
//       return;
//     }

    
//     const mealPlan = planMeals(profile, "kidney");
//     const workout = planWorkout(profile, "kidney");

    

//     let finalMeals;
//     if (selectedMeals && selectedMeals.length) {
     

//       finalMeals = selectedMeals.map((t) => ({ title: t }));
   

//       const needed = 4 - finalMeals.length;
//       if (needed > 0) {
//         const filler = (mealPlan.meals || []).filter((m) => !selectedMeals.includes(m.title)).slice(0, needed);
//         finalMeals = finalMeals.concat(filler);
//       }
//     } else {
//       finalMeals = mealPlan.meals || [];
//     }

//     const combined = {
//       bmr: mealPlan.bmr,
//       tdee: mealPlan.tdee,
//       macros: mealPlan.macros,
//       meals: finalMeals,
//       workout
//     };

//     setResult(combined);
//     setStep(3);

  
//     try {
//       localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "kidney", tdee: combined.tdee, meals: combined.meals }));
//     } catch (_) {}

//     setTimeout(() => {
//       document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" });
//     }, 80);
//   }

//   const handleSave = (res) => {
//     try {
//       const saved = { disease: "kidney", profile, timestamp: Date.now(), ...res };
//       localStorage.setItem("myfit_saved_plan", JSON.stringify(saved));
//       alert("Plan saved locally");
//     } catch (e) {
//       console.error(e);
//       alert("Could not save plan");
//     }
//   };

//   const resetToProfile = () => {
//     setStep(1);
//     setProfile(null);
//     setSelectedMeals([]);
//     setResult(null);
//     setTimeout(() => document.getElementById("profileForm")?.scrollIntoView({ behavior: "smooth" }), 50);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-6">
//           <h1 className="text-3xl font-bold">Kidney — Personalized Planner</h1>
//           <p className="text-gray-600 mt-2">We'll ask a few profile questions, let you choose some kidney-friendly meals, then create a tailored plan.</p>
//         </header>

        
//         <div id="profileForm" className="mb-6">
//           <ProfileForm initial={profile || {}} onSubmit={handleProfileSubmit} submitLabel={profile ? "Update Profile" : "Next: Choose Meals"} />
//         </div>

        
//         {step >= 2 && (
//           <section id="mealSelection" className="bg-white p-6 rounded-2xl shadow-sm mb-6">
//             <h2 className="text-xl font-semibold mb-3">Choose preferred meals (optional)</h2>
//             <p className="text-sm text-gray-600 mb-4">Pick the meals you'd prefer — selected items will be prioritized in the final plan.</p>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {MEAL_OPTIONS.map((m) => {
//                 const checked = selectedMeals.includes(m);
//                 return (
//                   <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}>
//                     <input type="checkbox" checked={checked} onChange={() => toggleMealOption(m)} />
//                     <div>
//                       <div className="font-medium">{m}</div>
//                       <div className="text-sm text-gray-500">Kidney-friendly, controlled portions</div>
//                     </div>
//                   </label>
//                 );
//               })}
//             </div>

//             <div className="mt-4 flex items-center gap-3">
//               <button onClick={handleCalculatePlan} className="bg-emerald-600 text-white px-4 py-2 rounded">Calculate Plan</button>
//               <button onClick={resetToProfile} className="px-4 py-2 rounded border">Edit profile</button>
//               <button onClick={() => { setSelectedMeals([]); }} className="px-3 py-2 rounded border">Clear selections</button>
//             </div>
//           </section>
//         )}

       
//         <div id="plannerResults" className="mt-6">
//           <PlannerResult result={result} onSave={handleSave} />
//         </div>
//       </div>
//     </div>
//   );
// }


//2 time

// src/pages/disease/Kidney.jsx
// import React, { useEffect, useState } from "react";
// import PlannerResult from "../../components/PlannerResult";
// import { planMeals } from "../../utils/mealPlanner";
// import { planWorkout } from "../../utils/workoutPlanner";
// import useUserProfile from "../../hooks/UseUserProfile";
// import { useNavigate } from "react-router-dom";

// export default function Kidney() {
//   const { loading, profile } = useUserProfile();
//   const navigate = useNavigate();
//   const [selectedMeals, setSelectedMeals] = useState([]);
//   const [result, setResult] = useState(null);

//   // quick options
//   const MEAL_OPTIONS = [
//     "White rice bowl + low-potassium veg",
//     "Grilled fish + light salad",
//     "Tofu & veggies (controlled portion)",
//     "Steamed white fish + steamed veg",
//     "Quinoa & veg (small portion)",
//     "Light lentil soup (controlled sodium)"
//   ];

//   useEffect(() => {
//     // if profile load finished and no profile -> send user to /profile to create one
//     if (!loading && !profile) {
//       navigate("/profile");
//     }
//   }, [loading, profile, navigate]);

//   function toggleMealOption(title) {
//     setSelectedMeals((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
//   }

//   function handleCalculatePlan() {
//     if (!profile) {
//       // safety: redirect to profile
//       navigate("/profile");
//       return;
//     }
//     const mealPlan = planMeals(profile, "kidney");
//     const workout = planWorkout(profile, "kidney");

//     // use selectedMeals etc (same logic as before)
//     let finalMeals;
//     if (selectedMeals.length) {
//       finalMeals = selectedMeals.map((t) => ({ title: t }));
//       const needed = 4 - finalMeals.length;
//       if (needed > 0) {
//         const filler = (mealPlan.meals || []).filter((m) => !selectedMeals.includes(m.title)).slice(0, needed);
//         finalMeals = finalMeals.concat(filler);
//       }
//     } else {
//       finalMeals = mealPlan.meals || [];
//     }

//     const combined = {
//       bmr: mealPlan.bmr,
//       tdee: mealPlan.tdee,
//       macros: mealPlan.macros,
//       meals: finalMeals,
//       workout
//     };

//     setResult(combined);
//     try { localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "kidney", tdee: combined.tdee, meals: combined.meals })); } catch(_) {}
//     setTimeout(()=> document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" }), 80);
//   }

//   if (loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
//   }

//   // when profile exists, show the planner UI (form-less)
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-6">
//           <h1 className="text-3xl font-bold">Kidney — Personalized Planner</h1>
//           <p className="text-gray-600 mt-2">Your saved profile will be used to compute the plan.</p>
//         </header>

//         {/* Meal selection */}
//         <section className="bg-white p-6 rounded-2xl shadow-sm mb-6">
//           <h2 className="text-xl font-semibold mb-3">Choose preferred meals (optional)</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {MEAL_OPTIONS.map((m) => {
//               const checked = selectedMeals.includes(m);
//               return (
//                 <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}>
//                   <input type="checkbox" checked={checked} onChange={() => toggleMealOption(m)} />
//                   <div>
//                     <div className="font-medium">{m}</div>
//                     <div className="text-sm text-gray-500">Kidney-friendly, controlled portions</div>
//                   </div>
//                 </label>
//               );
//             })}
//           </div>

//           <div className="mt-4 flex items-center gap-3">
//             <button onClick={handleCalculatePlan} className="bg-emerald-600 text-white px-4 py-2 rounded">Calculate Plan</button>
//             <button onClick={() => navigate("/profile")} className="px-4 py-2 rounded border">Edit profile</button>
//             <button onClick={() => setSelectedMeals([])} className="px-3 py-2 rounded border">Clear selections</button>
//           </div>
//         </section>

//         <div id="plannerResults" className="mt-6">
//           <PlannerResult result={result} onSave={() => { try { localStorage.setItem("myfit_saved_plan", JSON.stringify(result)); alert("Saved"); } catch(_){} }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// src/pages/disease/Kidney.jsx
// import React, { useState, useEffect } from "react";
// import PlannerResult from "../../components/PlannerResult";
// import { planMeals } from "../../utils/mealPlanner";
// import { planWorkout } from "../../utils/workoutPlanner";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "../../firebase-config";
// import { useNavigate } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";

// export default function Kidney() {
//   const [profile, setProfile] = useState(null);
//   const [selectedMeals, setSelectedMeals] = useState([]);
//   const [result, setResult] = useState(null);
//   const [step, setStep] = useState(1); // 1 = waiting for profile, 2 = meal selection, 3 = results
//   const navigate = useNavigate();

//   const MEAL_OPTIONS = [
//     "White rice bowl + low-potassium veg",
//     "Grilled fish + light salad",
//     "Tofu & veggies (controlled portion)",
//     "Steamed white fish + steamed veg",
//     "Quinoa & veg (small portion)",
//     "Light lentil soup (controlled sodium)",
//   ];

//   useEffect(() => {
//     // ensure auth and then load profile (Firestore -> localStorage fallback)
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       if (!u) {
//         navigate("/login");
//         return;
//       }

//       // try firestore user doc first
//       try {
//         const ref = doc(db, "users", u.uid);
//         const snap = await getDoc(ref);
//         if (snap.exists()) {
//           const data = snap.data();
//           // expect data to contain: name, age, height, weight, gender
//           if (data && (data.age || data.height || data.weight || data.name)) {
//             setProfile({
//               name: data.name || "",
//               age: data.age ?? null,
//               height: data.height ?? null,
//               weight: data.weight ?? null,
//               gender: data.gender || "male",
//             });
//             setStep(2); // profile exists, proceed to meal selection
//             // persist locally for faster loads
//             try { localStorage.setItem("user_profile", JSON.stringify(data)); } catch(_) {}
//             return;
//           }
//         }
//       } catch (e) {
//         console.error("Error fetching user doc:", e);
//       }

//       // Firestore had no profile — try localStorage
//       try {
//         const raw = localStorage.getItem("user_profile");
//         if (raw) {
//           const cached = JSON.parse(raw);
//           if (cached && (cached.age || cached.height || cached.weight || cached.name)) {
//             setProfile({
//               name: cached.name || "",
//               age: cached.age ?? null,
//               height: cached.height ?? null,
//               weight: cached.weight ?? null,
//               gender: cached.gender || "male",
//             });
//             setStep(2);
//             return;
//           }
//         }
//       } catch (e) {
//         console.warn("localStorage parse error:", e);
//       }

//       // No profile available -> redirect user to global profile page to fill details
//       navigate("/profile");
//     });

//     return () => unsub();
//   }, [navigate]);

//   function toggleMealOption(title) {
//     setSelectedMeals((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
//   }

//   function handleCalculatePlan() {
//     if (!profile) {
//       alert("Profile missing. Please create your profile first.");
//       return;
//     }

//     const mealPlan = planMeals(profile, "kidney") || {};
//     const workout = planWorkout(profile, "kidney") || { items: [] };

//     // produce finalMeals prioritized by user picks
//     let finalMeals;
//     if (selectedMeals && selectedMeals.length) {
//       finalMeals = selectedMeals.map((t) => ({ title: t }));
//       const desiredCount = (mealPlan.meals && mealPlan.meals.length) ? mealPlan.meals.length : 4;
//       const needed = Math.max(0, desiredCount - finalMeals.length);
//       if (needed > 0) {
//         const filler = (mealPlan.meals || []).filter((m) => !selectedMeals.includes(m.title)).slice(0, needed);
//         finalMeals = finalMeals.concat(filler);
//       }
//     } else {
//       finalMeals = mealPlan.meals || [];
//     }

//     const combined = {
//       bmr: mealPlan.bmr || null,
//       tdee: mealPlan.tdee || null,
//       macros: mealPlan.macros || null,
//       meals: finalMeals,
//       workout,
//     };

//     setResult(combined);
//     setStep(3);

//     try {
//       localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "kidney", tdee: combined.tdee, meals: combined.meals }));
//     } catch (_) {}

//     setTimeout(() => {
//       document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" });
//     }, 80);
//   }

//   const handleSave = (res) => {
//     try {
//       const saved = { disease: "kidney", profile, timestamp: Date.now(), ...res };
//       localStorage.setItem("myfit_saved_plan", JSON.stringify(saved));
//       alert("Plan saved locally");
//     } catch (e) {
//       console.error(e);
//       alert("Could not save plan");
//     }
//   };

//   const resetToProfile = () => {
//     // redirect to central profile page for editing
//     navigate("/profile");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-6">
//           <h1 className="text-3xl font-bold">Kidney — Personalized Planner</h1>
//           <p className="text-gray-600 mt-2">
//             We'll use your saved profile (or ask you to create one) then let you choose meals and build a kidney-friendly plan.
//           </p>
//         </header>

//         {/* show current profile summary (read-only) */}
//         <section className="bg-white p-6 rounded-2xl shadow-sm mb-6">
//           <h2 className="text-xl font-semibold mb-2">Profile</h2>
//           {profile ? (
//             <div className="grid grid-cols-2 gap-3">
//               <div><strong>Name</strong><div className="text-sm text-gray-700">{profile.name || "—"}</div></div>
//               <div><strong>Age</strong><div className="text-sm text-gray-700">{profile.age ?? "—"}</div></div>
//               <div><strong>Height (cm)</strong><div className="text-sm text-gray-700">{profile.height ?? "—"}</div></div>
//               <div><strong>Weight (kg)</strong><div className="text-sm text-gray-700">{profile.weight ?? "—"}</div></div>
//               <div><strong>Gender</strong><div className="text-sm text-gray-700">{profile.gender || "—"}</div></div>
//             </div>
//           ) : (
//             <div>Please create your profile first. Redirecting…</div>
//           )}

//           <div className="mt-4">
//             <button onClick={() => navigate("/profile")} className="px-4 py-2 rounded border">Edit profile</button>
//           </div>
//         </section>

//         {/* STEP 2: meal selection */}
//         <section id="mealSelection" className="bg-white p-6 rounded-2xl shadow-sm mb-6">
//           <h2 className="text-xl font-semibold mb-3">Choose preferred meals (optional)</h2>
//           <p className="text-sm text-gray-600 mb-4">Pick the meals you'd prefer — selections will be prioritized in the final plan.</p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             {MEAL_OPTIONS.map((m) => {
//               const checked = selectedMeals.includes(m);
//               return (
//                 <label key={m} className={`flex items-center gap-3 p-3 rounded-lg border ${checked ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"}`}>
//                   <input type="checkbox" checked={checked} onChange={() => toggleMealOption(m)} />
//                   <div>
//                     <div className="font-medium">{m}</div>
//                     <div className="text-sm text-gray-500">Kidney-friendly, controlled portions</div>
//                   </div>
//                 </label>
//               );
//             })}
//           </div>

//           <div className="mt-4 flex items-center gap-3">
//             <button onClick={handleCalculatePlan} className="bg-emerald-600 text-white px-4 py-2 rounded">Calculate Plan</button>
//             <button onClick={resetToProfile} className="px-4 py-2 rounded border">Edit profile</button>
//             <button onClick={() => setSelectedMeals([])} className="px-3 py-2 rounded border">Clear selections</button>
//           </div>
//         </section>

//         {/* results */}
//         <div id="plannerResults" className="mt-6">
//           <PlannerResult result={result} onSave={handleSave} />
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/disease/Kidney.jsx
import React, { useState, useEffect } from "react";
import DiseaseProfileForm from "../../components/DisaeseProfileForm";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

const MEAL_OPTIONS = [
  "White rice bowl + low-potassium veg",
  "Grilled fish + light salad",
  "Tofu & veggies (controlled portion)",
  "Steamed white fish + steamed veg",
  "Quinoa & veg (small portion)",
  "Light lentil soup (controlled sodium)"
];

export default function Kidney() {
  const [profile, setProfile] = useState(null); // disease-specific profile
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState(1); // 1 = profile, 2 = meals, 3 = result
  const navigate = useNavigate();
  const storageKey = "user_profile_kidney";

  useEffect(() => {
    // ensure user is logged in, otherwise redirect
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) navigate("/login");
    });
    // load disease-specific profile from localStorage if present
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && (saved.name || saved.age || saved.height || saved.weight)) {
          setProfile(saved);
          setStep(2); // go to meal selection automatically
        }
      }
    } catch (e) {
      console.warn("Could not parse kidney profile:", e);
    }
    return () => unsub();
  }, [navigate]);

  const onProfileSubmit = (values) => {
    setProfile(values);
    setStep(2);
    // ensure localStorage saved already by the form; if you also want Firestore saving, do it here
    setSelectedMeals([]);
    setResult(null);
    setTimeout(()=> document.getElementById("mealSelection")?.scrollIntoView({behavior:"smooth"}), 50);
  };

  const toggleMealOption = (title) => {
    setSelectedMeals(prev => prev.includes(title) ? prev.filter(t=>t!==title) : [...prev, title]);
  };

  const handleCalculatePlan = () => {
    if (!profile) {
      alert("Please enter your profile first.");
      return;
    }

    const mealPlan = planMeals(profile, "kidney") || {};
    const workout = planWorkout(profile, "kidney") || { items: [] };

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
      localStorage.setItem("myfit_last_plan", JSON.stringify({ disease: "kidney", tdee: combined.tdee, meals: combined.meals }));
    } catch (_) {}
    setTimeout(()=> document.getElementById("plannerResults")?.scrollIntoView({behavior:"smooth"}), 80);
  };

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

  const editProfile = () => {
    // allow editing disease-specific profile (opens disease form again)
    setStep(1);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Kidney — Personalized Planner</h1>
          <p className="text-gray-600 mt-2">Enter your profile, choose meals, then create a kidney-friendly plan.</p>
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
                <p className="text-sm text-gray-600">Selected items will be prioritized in the final plan.</p>
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
                      <div className="text-sm text-gray-500">Kidney-friendly, portion-controlled</div>
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
