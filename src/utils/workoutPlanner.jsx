// // src/utils/workoutPlanner.js
// import exercises from "../data/exercises.json";

// /**
//  * Basic workout generator:
//  * - disease: apply constraints (low-impact for kidney, cardiac -> moderate cardio, etc.)
//  * - equipment: array of available equipment strings
//  * - goal: 'muscle_gain'|'fat_loss'|'maintenance'
//  *
//  * returns array of exercises { name, sets, notes }
//  */

// function filterByDisease(exs, disease) {
//   if (!disease) return exs;
//   const d = disease.toLowerCase();
//   return exs.filter(e => {
//     if (d === "kidney") {
//       // avoid high-load heavy lifts if flagged
//       if (e.tags?.includes("high-dehydration") || e.tags?.includes("very-heavy")) return false;
//     }
//     if (d === "cardiac") {
//       if (e.tags?.includes("max-effort") || e.tags?.includes("very-heavy")) return false;
//     }
//     if (d === "diabetes") {
//       // safe - encourage aerobic + resistance
//       return true;
//     }
//     if (d === "hypertension") {
//       // avoid valsalva heavy lifts
//       if (e.tags?.includes("max-effort")) return false;
//     }
//     return true;
//   });
// }

// export function planWorkout({ disease, equipment = [] , focus = "full" } = {}) {
//   let pool = filterByDisease(exercises, disease);

//   // prefer exercises compatible with available equipment
//   const withEquip = pool.filter(e => {
//     if (!e.equipment || e.equipment.length === 0) return true;
//     return e.equipment.some(eq => equipment.includes(eq));
//   });

//   if (withEquip.length > 0) pool = withEquip;

//   // pick 5 exercises as default
//   const choice = [];
//   const shuffled = pool.slice().sort(() => Math.random() - 0.5);
//   for (let i = 0; i < Math.min(6, shuffled.length); i++) {
//     const ex = shuffled[i];
//     const sets = ex.type === "cardio" ? "20-30 min" : "3 sets x 8-12 reps";
//     choice.push({ name: ex.name, sets, notes: ex.notes || "" });
//   }

//   return choice;
// }


// src/utils/workoutPlanner.js

/**
 * Basic workout generator returns array of { name, sets, notes }.
*/

// import exercises from "../data/exercises.json";
// function filterByDisease(exs, disease) {
//   if (!disease) return exs;
//   const d = disease.toLowerCase();
//   return exs.filter((e) => {
//     if (d === "kidney") {
//       if (e.tags?.includes("very-heavy") || e.tags?.includes("high-dehydration")) return false;
//     }
//     if (d === "cardiac") {
//       if (e.tags?.includes("very-heavy") || e.tags?.includes("max-effort")) return false;
//     }
//     if (d === "hypertension") {
//       if (e.tags?.includes("max-effort")) return false;
//     }
//     if (d === "diabetes") {
//       return true;
//     }
//     return true;
//   });
// }

// export function planWorkout({ disease, equipment = [], focus = "full" } = {}) {
//   let pool = filterByDisease(exercises, disease);

//   // prefer exercises that match equipment (if any)
//   if (equipment && equipment.length > 0) {
//     const withEquip = pool.filter((e) => !e.equipment || e.equipment.length === 0 || e.equipment.some((eq) => equipment.includes(eq)));
//     if (withEquip.length > 0) pool = withEquip;
//   }

//   // pick up to 6 exercises
//   const shuffled = pool.slice().sort(() => Math.random() - 0.5);
//   const chosen = shuffled.slice(0, Math.min(6, shuffled.length)).map((ex) => ({
//     name: ex.name,
//     sets: ex.type === "cardio" ? ex.duration || "20-30 min" : ex.sets || "3 sets x 8-12 reps",
//     notes: ex.notes || "",
//   }));

//   return chosen;
// }



// export async function planWorkout({ disease = 'none', user = {}, equipment = [], focus = 'full' }) {
//   // returns array of { name, notes }
//   const lowImpact = [
//     { name: 'Brisk walk', notes: '30–45 mins, moderate pace' },
//     { name: 'Gentle cycling', notes: '20–30 mins - low resistance' },
//   ];

//   const strength = [
//     { name: 'Squat variation', notes: '3 sets of 8–12 reps — bodyweight or dumbbells' },
//     { name: 'Push or Press', notes: '3 sets of 8–12 reps — use dumbbells or push-ups' },
//     { name: 'Single-arm row', notes: '3 sets 8–12 each side' },
//     { name: 'Plank', notes: '3 x 30–60s' },
//   ];

//   const cardiacSafe = [
//     { name: 'Low-intensity cardio', notes: 'Walking, cycling — avoid sudden spikes' },
//     { name: 'Light mobility', notes: 'Joint mobility and breathing work' },
//   ];

//   const diabetesSafe = [
//     { name: 'Brisk walk', notes: 'Helps glucose control — 30–45 mins' },
//     { name: 'Resistance circuit', notes: '2–3x/week compound moves' },
//   ];

//   const pcosFocus = [
//     { name: 'Strength training', notes: '3x/week focusing on compound lifts' },
//     { name: 'Short HIIT (optional)', notes: '10–12 min intervals if tolerated' },
//   ];

//   const kidneyFocus = [
//     { name: 'Low-impact cardio', notes: 'Cycling or walking — keep hydrated' },
//     { name: 'Light resistance', notes: 'Bodyweight or very light weights' },
//   ];

//   const hypertensionFocus = [
//     { name: 'Aerobic cardio', notes: '30 mins moderate most days' },
//     { name: 'Mobility & core', notes: 'Daily light mobility' },
//   ];

//   const diseaseKey = (disease || 'none').toLowerCase();
//   let plan = [];

//   switch (diseaseKey) {
//     case 'cardiac':
//       plan = [...cardiacSafe, ...lowImpact];
//       break;
//     case 'diabetes':
//       plan = [...diabetesSafe, ...strength.slice(0,2)];
//       break;
//     case 'pcos':
//       plan = [...pcosFocus, ...strength.slice(0,3)];
//       break;
//     case 'kidney':
//       plan = [...kidneyFocus, ...lowImpact.slice(0,1)];
//       break;
//     case 'hypertension':
//       plan = [...hypertensionFocus, ...lowImpact.slice(0,1)];
//       break;
//     default:
//       plan = [...strength.slice(0,3), ...lowImpact.slice(0,1)];
//       break;
//   }

//   // if user has "no equipment" prefer bodyweight phrasing
//   const noEquipment = !equipment || equipment.length === 0 || equipment.includes('none');
//   if (noEquipment) {
//     plan = plan.map((ex) => ({ ...ex, notes: ex.notes + ' (bodyweight / minimal gear suggested)' }));
//   }

//   return plan;
// }


// src/utils/workoutPlanner.js
// Exports planWorkout(profile, disease, workoutFocus)

const WORKOUT_BANK = {
  default: [
    { name: "Brisk walk", sets: "30-40 min" },
    { name: "Full body resistance circuit", sets: "3 rounds; compound moves" }
  ],
  kidney: [
    { name: "Low-impact cardio", sets: "30 min (walking/cycling)" },
    { name: "Light resistance", sets: "2-3 sets moderate" }
  ],
  diabetes: [
    { name: "Brisk walk", sets: "30-45 min" },
    { name: "Resistance training (compound)", sets: "2-3x/week" }
  ],
  pcos: [
    { name: "Strength training", sets: "3x/week focus on big lifts" },
    { name: "Short HIIT (if tolerated)", sets: "10–15 min intervals" }
  ],
  hypertension: [
    { name: "Moderate aerobic", sets: "30 min most days" },
    { name: "Mobility and core", sets: "daily light mobility" }
  ],
  cardiac: [
    { name: "Moderate aerobic", sets: "30 min, avoid sudden high-intensity" },
    { name: "Light resistance", sets: "monitor symptoms; supervised if necessary" }
  ]
};

export function planWorkout(profile, disease, focus = "general") {
  const bank = WORKOUT_BANK[disease] || WORKOUT_BANK.default;
  // optionally tweak plans by age/weight — simple rule
  const suggestions = bank.map((w) => {
    const adjusted = { ...w };
    if (profile.age > 60) adjusted.note = "Reduce intensity and prioritize mobility";
    if (profile.weight > 120) adjusted.note = (adjusted.note ? adjusted.note + " • " : "") + "Avoid high-impact";
    return adjusted;
  });
  return suggestions;
}
