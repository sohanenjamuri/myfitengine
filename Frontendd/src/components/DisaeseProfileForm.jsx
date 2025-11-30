// src/components/DiseaseProfileForm.jsx
import React, { useState } from "react";

/**
 * DiseaseProfileForm
 * - initial: optional initial object { name, age, height, weight, gender }
 * - onSubmit(values) : called with typed values (numbers for age,height,weight)
 * - submitLabel : label for submit button
 * - storageKey : optional localStorage key to save (default 'user_profile_<disease>')
 */
export default function DiseaseProfileForm({
  initial = {},
  onSubmit,
  submitLabel = "Next: Choose Meals",
  storageKey = "user_profile_disease",
}) {
  const [name, setName] = useState(initial.name || "");
  const [age, setAge] = useState(initial.age ?? "");
  const [height, setHeight] = useState(initial.height ?? "");
  const [weight, setWeight] = useState(initial.weight ?? "");
  const [gender, setGender] = useState(initial.gender || "male");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) { alert("Please enter your name."); return false; }
    const a = Number(age), h = Number(height), w = Number(weight);
    if (!a || a <= 0) { alert("Please enter valid age."); return false; }
    if (!h || h <= 0) { alert("Please enter valid height (cm)."); return false; }
    if (!w || w <= 0) { alert("Please enter valid weight (kg)."); return false; }
    if (!["male","female"].includes(gender)) { alert("Please select gender."); return false; }
    return true;
  };

  const handle = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = {
      name: name.trim(),
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      gender,
    };

    try {
      // store locally for disease-specific page
      try { localStorage.setItem(storageKey, JSON.stringify(payload)); } catch (_) {}
      if (onSubmit) await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}
               className="mt-1 w-full border px-3 py-2 rounded" placeholder="Full name" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Age</label>
          <input type="number" value={age} onChange={(e)=>setAge(e.target.value)}
                 className="mt-1 w-full border px-3 py-2 rounded" min="1" />
        </div>

        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select value={gender} onChange={(e)=>setGender(e.target.value)}
                  className="mt-1 w-full border px-3 py-2 rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Height (cm)</label>
          <input type="number" value={height} onChange={(e)=>setHeight(e.target.value)}
                 className="mt-1 w-full border px-3 py-2 rounded" min="1" />
        </div>

        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)}
                 className="mt-1 w-full border px-3 py-2 rounded" min="1" />
        </div>
      </div>

      <div className="text-right">
        <button type="submit" disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60">
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
