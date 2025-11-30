// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

export default function Profile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // initial load
  const [saving, setSaving] = useState(false);  // Save button state
  const [userId, setUserId] = useState(null);

  // form state
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState(""); // cm
  const [weight, setWeight] = useState(""); // kg
  const [gender, setGender] = useState("male");

  useEffect(() => {
    // ensure user is signed in and load profile
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/login");
        return;
      }
      setUserId(u.uid);

      // prefill from Auth displayName if present
      if (u.displayName) setName(u.displayName);

      // fetch user profile from MongoDB backend
      try {
        const response = await fetch(`http://localhost:4000/api/users/${u.uid}`);
        if (response.ok) {
          const data = await response.json();
          // Fill fields if present in backend
          if (data.name) setName(data.name);
          if (data.age !== undefined && data.age !== null) setAge(String(data.age));
          if (data.height !== undefined && data.height !== null) setHeight(String(data.height));
          if (data.weight !== undefined && data.weight !== null) setWeight(String(data.weight));
          if (data.gender) setGender(data.gender);
        } else if (response.status !== 404) {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  const validate = () => {
    if (!name.trim()) { alert("Please enter your name."); return false; }
    const a = Number(age), h = Number(height), w = Number(weight);
    if (!a || a <= 0) { alert("Please enter a valid age."); return false; }
    if (!h || h <= 0) { alert("Please enter a valid height (cm)."); return false; }
    if (!w || w <= 0) { alert("Please enter a valid weight (kg)."); return false; }
    if (!["male", "female"].includes(gender)) { alert("Please select gender."); return false; }
    return true;
  };

  const handleSave = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const uid = userId || (auth.currentUser && auth.currentUser.uid);
      if (!uid) throw new Error("Not signed in");

      // update Auth displayName (non-fatal if fails)
      try {
        if (auth.currentUser && auth.currentUser.displayName !== name.trim()) {
          await updateProfile(auth.currentUser, { displayName: name.trim() });
        }
      } catch (upErr) {
        console.warn("updateProfile failed:", upErr);
        // continue — we'll still write to backend
      }

      // write to MongoDB backend
      const profilePayload = {
        uid,
        name: name.trim(),
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        gender,
      };

      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profilePayload),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile to backend');
      }

      // mirror into localStorage if you use it elsewhere
      try {
        localStorage.setItem("user_profile", JSON.stringify(profilePayload));
      } catch (_) { }

      // success feedback and redirect to dashboard
      alert("Profile updated successfully.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed saving profile:", err);
      alert(err?.message || "Could not save profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded shadow">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-gray-600 mt-1">Update your details — saving will return you to the dashboard.</p>
        </header>

        <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
              type="text"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
                type="number"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 w-full border px-3 py-2 rounded">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium">Height (cm)</label>
              <input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
                type="number"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded"
                type="number"
                min="1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save profile & go to Dashboard"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
