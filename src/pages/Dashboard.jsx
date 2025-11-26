// // import React, { useEffect, useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { auth } from "../firebase-config";
// // import { onAuthStateChanged, signOut } from "firebase/auth";

// // export default function Dashboard() {
// //   const [userName, setUserName] = useState("");
// //   const [recentPlan, setRecentPlan] = useState(null);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const unsub = onAuthStateChanged(auth, (u) => {
// //       if (!u) {
// //         navigate("/login");
// //         return;
// //       }

// //       setUserName(u.displayName || u.email || "");

// //       // load last saved plan from localStorage
// //       const last = JSON.parse(localStorage.getItem("myfit_last_plan") || "null");
// //       if (last) setRecentPlan(last);
// //     });

// //     return () => unsub();
// //   }, [navigate]);

// //   const doSignOut = async () => {
// //     await signOut(auth).catch(console.error);
// //     navigate("/login");
// //   };

// //   return (
// //     <div className="bg-gray-50 min-h-screen">
// //       {/* HEADER */}
// //       <header className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white p-4">
// //         <div className="max-w-6xl mx-auto flex items-center gap-4">
// //           <Link to="/" className="text-xl font-bold">
// //             MyFitEngine
// //           </Link>

// //           <nav className="ml-6 space-x-4 hidden md:inline-block">
// //             <Link to="/dashboard" className="underline">
// //               Dashboard
// //             </Link>
// //             <Link to="/planner" className="hover:underline">
// //               Planner
// //             </Link>
// //             <Link to="/analytics" className="hover:underline">
// //               Analytics
// //             </Link>
// //           </nav>

// //           <div className="ml-auto flex items-center gap-3">
// //             <span id="navName" className="text-sm">
// //               {userName}
// //             </span>
// //             <button
// //               onClick={doSignOut}
// //               className="bg-white/20 px-3 py-1 rounded-md text-sm"
// //             >
// //               Sign out
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* MAIN CONTENT */}
// //       <main className="max-w-6xl mx-auto p-6">
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           {/* Summary card */}
// //           <div className="bg-white p-6 rounded-2xl shadow-sm">
// //             <h3 className="font-semibold">Today's summary</h3>
// //             <div className="mt-3 text-3xl font-bold">2200 kcal</div>
// //             <div className="mt-2 text-sm text-gray-500">
// //               Protein 140g • Workout ready
// //             </div>
// //           </div>

// //           {/* Quick actions */}
// //           <div className="bg-white p-6 rounded-2xl shadow-sm">
// //             <h3 className="font-semibold">Quick actions</h3>
// //             <div className="mt-3 space-x-2">
// //               <Link to="/planner" className="bg-indigo-600 text-white px-3 py-1 rounded">
// //                 Open planner
// //               </Link>
// //               <Link to="/meals" className="border px-3 py-1 rounded">
// //                 Meals
// //               </Link>
// //             </div>
// //           </div>

// //           {/* Recent plan */}
// //           <div className="bg-white p-6 rounded-2xl shadow-sm">
// //             <h3 className="font-semibold">Recent plan</h3>
// //             <div className="mt-3 text-sm text-gray-700">
// //               {recentPlan
// //                 ? `${recentPlan.tdee} kcal • ${recentPlan.meals?.length || 0} meals`
// //                 : "No saved plan"}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Progress + Tips section */}
// //         <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           <div className="bg-white p-6 rounded-2xl shadow-sm">
// //             <h3 className="font-semibold">Progress</h3>
// //             <div className="mt-3 text-gray-500">Weight and calories charts coming here</div>
// //           </div>

// //           <div className="bg-white p-6 rounded-2xl shadow-sm">
// //             <h3 className="font-semibold">Tips</h3>
// //             <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
// //               <li>Save profile for better plans</li>
// //               <li>Log workouts to track progress</li>
// //             </ul>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }


// // src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { auth, db } from "../firebase-config";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// /**
//  * Local image path (you uploaded this file in the session).
//  * The dev tooling will transform this path to an accessible URL in your environment.
//  */
// const heroUrl = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

// export default function Dashboard() {
//   const [userName, setUserName] = useState("");
//   const [recentPlan, setRecentPlan] = useState(null);
//   const [diseases, setDiseases] = useState(null); // null = not loaded, [] = loaded & none
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (u) => {
//       if (!u) {
//         // Not signed in: show any cached diseases from localStorage (if present)
//         setUserName("");
//         const cached = JSON.parse(localStorage.getItem("user_diseases") || "null");
//         setDiseases(Array.isArray(cached) ? cached : []);
//         const last = JSON.parse(localStorage.getItem("myfit_last_plan") || "null");
//         if (last) setRecentPlan(last);
//         return;
//       }

//       setUserName(u.displayName || u.email || "");

//       // load last saved plan from localStorage (optional)
//       const last = JSON.parse(localStorage.getItem("myfit_last_plan") || "null");
//       if (last) setRecentPlan(last);

//       // Attempt to read diseases from Firestore; fall back to localStorage:
//       try {
//         const snap = await getDoc(doc(db, "users", u.uid));
//         if (snap.exists()) {
//           const data = snap.data();
//           if (data?.diseases && Array.isArray(data.diseases)) {
//             setDiseases(data.diseases);
//             try { localStorage.setItem("user_diseases", JSON.stringify(data.diseases)); } catch {}
//             return;
//           }
//         }
//       } catch (e) {
//         console.error("Failed to fetch user diseases from Firestore:", e);
//       }

//       // fallback: localStorage
//       const fallback = JSON.parse(localStorage.getItem("user_diseases") || "null");
//       setDiseases(Array.isArray(fallback) ? fallback : []);
//     });

//     return () => unsub();
//   }, [navigate]);

//   const doSignOut = async () => {
//     try {
//       await signOut(auth);
//       navigate("/Login");
//     } catch (e) {
//       console.error("Sign-out failed", e);
//     }
//   };

//   // A small friendly label for each disease slug
//   const labelFor = (slug) => {
//     const map = {
//       diabetes: "Diabetes",
//       hypertension: "Hypertension",
//       pcos: "PCOS",
//       cardiac: "Cardiac",
//       kidney: "Kidney",
//     };
//     return map[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <header className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white p-4">
//         <div className="max-w-6xl mx-auto flex items-center gap-4">
//           <Link to="/" className="text-xl font-bold">
//             MyFitEngine
//           </Link>

//           <nav className="ml-6 space-x-4 hidden md:inline-block">
//             <Link to="/dashboard" className="underline">
//               Dashboard
//             </Link>
//             <Link to="/planner" className="hover:underline">
//               Planner
//             </Link>
//             <Link to="/analytics" className="hover:underline">
//               Analytics
//             </Link>
//           </nav>

//           <div className="ml-auto flex items-center gap-3">
//             <span id="navName" className="text-sm">
//               {userName}
//             </span>
//             <button onClick={doSignOut} className="bg-white/20 px-3 py-1 rounded-md text-sm">
//               Sign out
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto p-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Today's summary</h3>
//             <div className="mt-3 text-3xl font-bold">2200 kcal</div>
//             <div className="mt-2 text-sm text-gray-500">Protein 140g • Workout ready</div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Quick actions</h3>
//             <div className="mt-3 space-x-2">
//               <Link to="/planner" className="bg-indigo-600 text-white px-3 py-1 rounded">
//                 Open planner
//               </Link>
//               <Link to="/meals" className="border px-3 py-1 rounded">
//                 Meals
//               </Link>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Recent plan</h3>
//             <div className="mt-3 text-sm text-gray-700">
//               {recentPlan ? `${recentPlan.tdee} kcal • ${recentPlan.meals?.length || 0} meals` : "No saved plan"}
//             </div>
//           </div>
//         </div>

//         {/* Condition-based section */}
//         <div className="mt-10">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold">Your Condition Plans</h2>
//             <div className="flex items-center gap-2">
//               <img src={heroUrl} alt="hero" className="w-12 h-12 rounded-md object-cover hidden sm:block" />
//               <Link to="/register" className="text-sm text-indigo-600">Edit profile</Link>
//             </div>
//           </div>

//           {/* Loading / empty states */}
//           {diseases === null ? (
//             <div className="p-6 bg-white rounded-2xl shadow-sm">Loading your conditions…</div>
//           ) : diseases.length === 0 ? (
//             <div className="p-6 bg-white rounded-2xl shadow-sm">
//               No conditions selected. <Link to="/register" className="text-indigo-600">Edit profile</Link> to add conditions.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {diseases.map((d) => (
//                 // normalize slug to lower-case; skip 'none'
//                 d && d.toLowerCase() !== "none" ? (
//                   <Link
//                     key={d}
//                     to={`/${d.toLowerCase()}`}
//                     className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition"
//                   >
//                     <h3 className="font-semibold capitalize">{labelFor(d.toLowerCase())} Plan</h3>
//                     <p className="text-sm text-gray-600 mt-1">Personalized recommendations for {labelFor(d.toLowerCase())}.</p>
//                     <span className="text-indigo-600 text-sm mt-3 inline-block">View details →</span>
//                   </Link>
//                 ) : null
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Progress + Tips section */}
//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Progress</h3>
//             <div className="mt-3 text-gray-500">Weight and calories charts coming here</div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Tips</h3>
//             <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
//               <li>Save profile for better plans</li>
//               <li>Log workouts to track progress</li>
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// src/pages/Dashboard.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../firebase-config";
// import { onAuthStateChanged, signOut } from "firebase/auth";

// const DISEASES = [
//   { key: "diabetes", label: "Diabetes" },
//   { key: "hypertension", label: "Hypertension" },
//   { key: "pcos", label: "PCOS" },
//   { key: "cardiac", label: "Cardiac" },
//   { key: "kidney", label: "Kidney" },
// ];

// export default function Dashboard() {
//   const [userName, setUserName] = useState("");
//   const [recentPlan, setRecentPlan] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => {
//       if (!u) {
//         navigate("/login");
//         return;
//       }
//       setUserName(u.displayName || u.email || "");
//       const last = JSON.parse(localStorage.getItem("myfit_last_plan") || "null");
//       if (last) setRecentPlan(last);
//     });
//     return () => unsub();
//   }, [navigate]);

//   const doSignOut = async () => {
//     await signOut(auth).catch(console.error);
//     navigate("/login");
//   };

//   const openDisease = (key) => {
//     navigate(`/${key}`);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <header className="bg-gradient-to-r from-emerald-600 to-indigo-600 text-white p-4">
//         <div className="max-w-6xl mx-auto flex items-center gap-4">
//           <Link to="/" className="text-xl font-bold">MyFitEngine</Link>
//           <nav className="ml-6 space-x-4 hidden md:inline-block">
//             <Link to="/dashboard" className="underline">Dashboard</Link>
//             <Link to="/planner" className="hover:underline">Planner</Link>
//             <Link to="/analytics" className="hover:underline">Analytics</Link>
//           </nav>
//           <div className="ml-auto flex items-center gap-3">
//             <span id="navName" className="text-sm">{userName}</span>
//             <button onClick={doSignOut} className="bg-white/20 px-3 py-1 rounded-md text-sm">Sign out</button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto p-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Today's summary</h3>
//             <div className="mt-3 text-3xl font-bold">— kcal</div>
//             <div className="mt-2 text-sm text-gray-500">Profile to see personalized info</div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Quick actions</h3>
//             <div className="mt-3 space-x-2">
//               <Link to="/planner" className="bg-indigo-600 text-white px-3 py-1 rounded">Open planner</Link>
//               <Link to="/meals" className="border px-3 py-1 rounded">Meals</Link>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Recent plan</h3>
//             <div className="mt-3 text-sm text-gray-700">
//               {recentPlan ? `${recentPlan.tdee} kcal • ${recentPlan.meals?.length || 0} meals` : "No saved plan"}
//             </div>
//           </div>
//         </div>

//         <section className="mt-8">
//           <h2 className="text-xl font-bold mb-4">Condition-specific pages</h2>
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//             {DISEASES.map((d) => (
//               <button
//                 key={d.key}
//                 onClick={() => openDisease(d.key)}
//                 className="bg-white p-4 rounded-2xl shadow hover:shadow-md text-left"
//               >
//                 <div className="font-semibold text-lg">{d.label}</div>
//                 <div className="text-sm text-gray-500 mt-1">Open {d.label} planner & tips</div>
//               </button>
//             ))}
//           </div>
//         </section>

//         <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Progress</h3>
//             <div className="mt-3 text-gray-500">Charts will appear here</div>
//           </div>

//           <div className="bg-white p-6 rounded-2xl shadow-sm">
//             <h3 className="font-semibold">Tips</h3>
//             <ul className="mt-3 text-sm text-gray-700 list-disc pl-5">
//               <li>Save profile for better plans</li>
//               <li>Log workouts to track progress</li>
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";

const DISEASES = [
  { key: "diabetes", label: "Diabetes" },
  { key: "hypertension", label: "Hypertension" },
  { key: "pcos", label: "PCOS" },
  { key: "cardiac", label: "Cardiac" },
  { key: "kidney", label: "Kidney" },
];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [recentPlan, setRecentPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate("/login");
        return;
      }
      setUserName(u.displayName || u.email || "");
      const last = JSON.parse(localStorage.getItem("myfit_last_plan") || "null");
      if (last) setRecentPlan(last);
    });
    return () => unsub();
  }, [navigate]);

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
          <Link to="/" className="text-xl font-bold">MyFitEngine</Link>
          <nav className="ml-6 space-x-4 hidden md:inline-block">
            <Link to="/dashboard" className="underline">Dashboard</Link>
            <Link to="/planner" className="hover:underline">Planner</Link>
            <Link to="/analytics" className="hover:underline">Analytics</Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span id="navName" className="text-sm">{userName}</span>
            <button onClick={doSignOut} className="bg-white/20 px-3 py-1 rounded-md text-sm">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold">Today's summary</h3>
            <div className="mt-3 text-3xl font-bold">— kcal</div>
            <div className="mt-2 text-sm text-gray-500">Profile to see personalized info</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-semibold">Quick actions</h3>
            <div className="mt-3 space-x-2">
              <Link to="/planner" className="bg-indigo-600 text-white px-3 py-1 rounded">Open planner</Link>
              <Link to="/meals" className="border px-3 py-1 rounded">Meals</Link>
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
            <h3 className="font-semibold">Progress</h3>
            <div className="mt-3 text-gray-500">Charts will appear here</div>
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
