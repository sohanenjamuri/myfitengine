


// // src/components/PlannerResult.jsx
// import React from "react";

// export default function PlannerResult({ plan }) {
//   if (!plan) return null;
//   return (
//     <div className="mt-6 bg-white p-6 rounded-2xl shadow">
//       <h3 className="text-xl font-bold mb-3">Generated Plan</h3>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div className="p-3 border rounded">
//           <div className="text-sm text-gray-500">Target Calories</div>
//           <div className="text-2xl font-extrabold">{plan.tdee}</div>
//         </div>
//         <div className="p-3 border rounded">
//           <div className="text-sm text-gray-500">Protein</div>
//           <div className="text-2xl font-extrabold">{plan.proteinG} g</div>
//         </div>
//         <div className="p-3 border rounded">
//           <div className="text-sm text-gray-500">Carbs / Fats</div>
//           <div className="text-2xl font-extrabold">{plan.carbG} g / {plan.fatG} g</div>
//         </div>
//       </div>

//       <div>
//         <h4 className="font-semibold mb-2">Meals</h4>
//         <div className="space-y-3">
//           {plan.meals.map((m, idx) => (
//             <div key={idx} className="p-3 rounded border bg-gray-50">
//               <div className="font-semibold">{m.title} — {m.calories} kcal</div>
//               <div className="text-sm text-gray-600">{m.items.join(" • ")}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-4">
//         <h4 className="font-semibold mb-2">Workout</h4>
//         <ul className="list-disc pl-5">
//           {(plan.workout || []).map((w, i) => (
//             <li key={i} className="mb-1">
//               <div className="font-medium">{w.name}</div>
//               <div className="text-sm text-gray-600">{w.sets} — {w.notes}</div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


// src/components/PlannerResult.jsx
import React from "react";
import {Link} from "react-router-dom";

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
        <ul className="list-disc pl-5 space-y-2">
          {meals.map((m, i) => <li key={i}>{m.title}</li>)}
        </ul>
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
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">
          Go To Dashboard
        </button>
      </div>
    </div>
  );
}
