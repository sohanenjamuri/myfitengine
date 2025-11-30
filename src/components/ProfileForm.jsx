import React, { useState } from "react";

export default function ProfileForm({
  initial = {},
  onSubmit,
  submitLabel = "Create Plan",
}) {
  const [name, setName] = useState(initial.name || "");    
  const [age, setAge] = useState(initial.age || "");
  const [height, setHeight] = useState(initial.height || ""); 
  const [weight, setWeight] = useState(initial.weight || ""); 
  const [gender, setGender] = useState(initial.gender || "male");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation name 
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!age || !height || !weight) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: String(name).trim(),     
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-2xl shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="mt-1 w-full border px-3 py-2 rounded"
          min="1"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded"
            min="1"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="mt-1 w-full border px-3 py-2 rounded"
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
