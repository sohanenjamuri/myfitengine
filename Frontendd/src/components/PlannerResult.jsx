import React from "react";
import { Link } from "react-router-dom";

export default function PlannerResult({ result, onSave }) {
  if (!result) return null;
  const { bmr, tdee, macros, meals, workout } = result;
  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-6">
      <h2 className="text-xl font-bold mb-3">Generated Plan</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">BMR</div>
          <div className="text-2xl font-bold">{bmr} kcal</div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <div className="text-sm text-gray-600">TDEE (est)</div>
          <div className="text-2xl font-bold">{tdee} kcal</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-600">Macros</div>
        <div className="mt-2 grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded text-center">
            <div className="text-sm">Protein</div>
            <div className="font-bold">{macros.proteinG} g</div>
          </div>
          <div className="p-3 bg-gray-50 rounded text-center">
            <div className="text-sm">Carbs</div>
            <div className="font-bold">{macros.carbsG} g</div>
          </div>
          <div className="p-3 bg-gray-50 rounded text-center">
            <div className="text-sm">Fats</div>
            <div className="font-bold">{macros.fatG} g</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Meals</h3>
        <div className="space-y-4">
          {meals.breakfast && (
            <div>
              <h4 className="font-medium text-emerald-700 text-sm uppercase tracking-wide">Breakfast</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {meals.breakfast.map((m, i) => <li key={i}>{m.title}</li>)}
              </ul>
            </div>
          )}
          {meals.lunch && (
            <div>
              <h4 className="font-medium text-emerald-700 text-sm uppercase tracking-wide">Lunch</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {meals.lunch.map((m, i) => <li key={i}>{m.title}</li>)}
              </ul>
            </div>
          )}
          {meals.dinner && (
            <div>
              <h4 className="font-medium text-emerald-700 text-sm uppercase tracking-wide">Dinner</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {meals.dinner.map((m, i) => <li key={i}>{m.title}</li>)}
              </ul>
            </div>
          )}
          {meals.snack && (
            <div>
              <h4 className="font-medium text-emerald-700 text-sm uppercase tracking-wide">Snack</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {meals.snack.map((m, i) => <li key={i}>{m.title}</li>)}
              </ul>
            </div>
          )}
          {/* Fallback for old array format if any */}
          {Array.isArray(meals) && (
            <ul className="list-disc pl-5 space-y-2">
              {meals.map((m, i) => <li key={i}>{m.title}</li>)}
            </ul>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Workout</h3>
        <ul className="list-decimal pl-5 space-y-2">
          {workout.map((w, i) => (
            <li key={i}>
              <div className="font-medium">{w.name}</div>
              <div className="text-sm text-gray-600">{w.sets}{w.note ? ` • ${w.note}` : ""}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 text-right">
        {onSave && <button onClick={() => onSave(result)} className="bg-indigo-600 text-white px-4 py-2 rounded">Save plan</button>}&nbsp;&nbsp;
        <Link to='/dashboard' className="bg-indigo-600 text-white px-4 py-2 rounded">
          Go To Dashboard
        </Link>
      </div>
    </div>
  );
}
