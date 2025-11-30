// // src/components/ProfileForm.jsx
// import React, { useEffect, useState } from "react";

// export default function ProfileForm({ onSave }) {
//   const [profile, setProfile] = useState({
//     age: "",
//     height: "",
//     weight: "",
//     gender: "male",
//   });

//   useEffect(() => {
//     try {
//       const raw = localStorage.getItem("user_profile");
//       if (raw) {
//         const p = JSON.parse(raw);
//         setProfile({
//           age: p.age ?? "",
//           height: p.height ?? "",
//           weight: p.weight ?? "",
//           gender: p.gender ?? "male",
//         });
//       }
//     } catch (_) {}
//   }, []);

//   function updateField(key, val) {
//     setProfile((prev) => ({ ...prev, [key]: val }));
//   }

//   function handleSave(e) {
//     e.preventDefault();
//     // minimal validation
//     const p = {
//       age: Number(profile.age) || 0,
//       height: Number(profile.height) || 0,
//       weight: Number(profile.weight) || 0,
//       gender: profile.gender || "male",
//     };
//     try {
//       localStorage.setItem("user_profile", JSON.stringify(p));
//     } catch (_) {}
//     if (typeof onSave === "function") onSave(p);
//   }

//   return (
//     <form onSubmit={handleSave} className="space-y-3">
//       <div className="grid grid-cols-2 gap-2">
//         <label className="block text-sm">
//           Age
//           <input
//             type="number"
//             value={profile.age}
//             onChange={(e) => updateField("age", e.target.value)}
//             className="w-full border rounded p-2 mt-1"
//             min="1"
//           />
//         </label>

//         <label className="block text-sm">
//           Gender
//           <select
//             value={profile.gender}
//             onChange={(e) => updateField("gender", e.target.value)}
//             className="w-full border rounded p-2 mt-1"
//           >
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </label>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <label className="block text-sm">
//           Height (cm)
//           <input
//             type="number"
//             value={profile.height}
//             onChange={(e) => updateField("height", e.target.value)}
//             className="w-full border rounded p-2 mt-1"
//             min="1"
//           />
//         </label>

//         <label className="block text-sm">
//           Weight (kg)
//           <input
//             type="number"
//             value={profile.weight}
//             onChange={(e) => updateField("weight", e.target.value)}
//             className="w-full border rounded p-2 mt-1"
//             min="1"
//           />
//         </label>
//       </div>

//       <div className="flex gap-2">
//         <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">
//           Save profile
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             // Reset stored profile
//             localStorage.removeItem("user_profile");
//             setProfile({ age: "", height: "", weight: "", gender: "male" });
//             if (typeof onSave === "function") onSave(null);
//           }}
//           className="px-3 py-2 border rounded"
//         >
//           Clear
//         </button>
//       </div>
//     </form>
//   );
// }


// import React, { useState, useEffect } from 'react';


// export default function ProfileForm({ initialProfile = null, onSave }) {
// const [name, setName] = useState('');
// const [age, setAge] = useState();
// const [height, setHeight] = useState(170);
// const [weight, setWeight] = useState(70);
// const [gender, setGender] = useState('male');


// useEffect(() => {
// if (!initialProfile) return;
// if (initialProfile.name) setName(initialProfile.name);
// if (initialProfile.age) setAge(initialProfile.age);
// if (initialProfile.height) setHeight(initialProfile.height);
// if (initialProfile.weight) setWeight(initialProfile.weight);
// if (initialProfile.gender) setGender(initialProfile.gender);
// }, [initialProfile]);
// function handleSubmit(e) {
// e?.preventDefault?.();
// const payload = {
// name: (name || '').trim(),
// age: Number(age) || 0,
// height: Number(height) || 0,
// weight: Number(weight) || 0,
// gender: gender || 'male',
// };
// if (typeof onSave === 'function') onSave(payload);
// }

// return (
// <form onSubmit={handleSubmit} className="space-y-3">
// <div>
// <label className="block text-sm">Name</label>
// <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded p-2" />
// </div>


// <div className="grid grid-cols-3 gap-2">
// <div>
// <label className="block text-sm">Age</label>
// <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full border rounded p-2" />
// </div>
// <div>
// <label className="block text-sm">Height (cm)</label>
// <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full border rounded p-2" />
// </div>
// <div>
// <label className="block text-sm">Weight (kg)</label>
// <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full border rounded p-2" />
// </div>
// </div>
// <div>
// <label className="block text-sm">Gender</label>
// <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border rounded p-2">
// <option value="male">Male</option>
// <option value="female">Female</option>
// <option value="other">Other</option>
// </select>
// </div>
// <div className="flex gap-3">
// <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">Save</button>
// <button type="button" onClick={() => {
// // reset to initialProfile or defaults
// if (initialProfile) {
// setName(initialProfile.name || '');
// setAge(initialProfile.age || 30);
// setHeight(initialProfile.height || 170);
// setWeight(initialProfile.weight || 70);
// setGender(initialProfile.gender || 'male');
// } else {
// setName(''); setAge(30); setHeight(170); setWeight(70); setGender('male');
// }
// }} className="px-3 py-2 border rounded">Reset</button>
// </div>
// </form>
// );
// }

// src/components/ProfileForm.jsx
import React, { useState } from "react";

export default function ProfileForm({ initial = {}, onSubmit, submitLabel = "Create Plan" }) {
  const [age, setAge] = useState(initial.age || "");
  const [height, setHeight] = useState(initial.height || ""); // cm
  const [weight, setWeight] = useState(initial.weight || ""); // kg
  const [gender, setGender] = useState(initial.gender || "male");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!age || !height || !weight) {
      alert("Please enter age, height and weight.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        gender,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
      <div>
        <label className="block text-sm font-medium">Age</label>
        <input type="number" value={age} onChange={(e)=>setAge(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" min="1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Height (cm)</label>
          <input type="number" value={height} onChange={(e)=>setHeight(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" min="1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded" min="1" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select value={gender} onChange={(e)=>setGender(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="text-right">
        <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
          {loading ? "Creating..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
