


// src/components/PlannerResult.jsx
import React from "react";

export default function PlannerResult({ plan }) {
  if (!plan) return null;
  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow">
      <h3 className="text-xl font-bold mb-3">Generated Plan</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">Target Calories</div>
          <div className="text-2xl font-extrabold">{plan.tdee}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">Protein</div>
          <div className="text-2xl font-extrabold">{plan.proteinG} g</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">Carbs / Fats</div>
          <div className="text-2xl font-extrabold">{plan.carbG} g / {plan.fatG} g</div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Meals</h4>
        <div className="space-y-3">
          {plan.meals.map((m, idx) => (
            <div key={idx} className="p-3 rounded border bg-gray-50">
              <div className="font-semibold">{m.title} — {m.calories} kcal</div>
              <div className="text-sm text-gray-600">{m.items.join(" • ")}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Workout</h4>
        <ul className="list-disc pl-5">
          {(plan.workout || []).map((w, i) => (
            <li key={i} className="mb-1">
              <div className="font-medium">{w.name}</div>
              <div className="text-sm text-gray-600">{w.sets} — {w.notes}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
