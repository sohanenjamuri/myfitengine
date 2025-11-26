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
import exercises from "../data/exercises.json";

/**
 * Basic workout generator returns array of { name, sets, notes }.
 */

function filterByDisease(exs, disease) {
  if (!disease) return exs;
  const d = disease.toLowerCase();
  return exs.filter((e) => {
    if (d === "kidney") {
      if (e.tags?.includes("very-heavy") || e.tags?.includes("high-dehydration")) return false;
    }
    if (d === "cardiac") {
      if (e.tags?.includes("very-heavy") || e.tags?.includes("max-effort")) return false;
    }
    if (d === "hypertension") {
      if (e.tags?.includes("max-effort")) return false;
    }
    if (d === "diabetes") {
      return true;
    }
    return true;
  });
}

export function planWorkout({ disease, equipment = [], focus = "full" } = {}) {
  let pool = filterByDisease(exercises, disease);

  // prefer exercises that match equipment (if any)
  if (equipment && equipment.length > 0) {
    const withEquip = pool.filter((e) => !e.equipment || e.equipment.length === 0 || e.equipment.some((eq) => equipment.includes(eq)));
    if (withEquip.length > 0) pool = withEquip;
  }

  // pick up to 6 exercises
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, Math.min(6, shuffled.length)).map((ex) => ({
    name: ex.name,
    sets: ex.type === "cardio" ? ex.duration || "20-30 min" : ex.sets || "3 sets x 8-12 reps",
    notes: ex.notes || "",
  }));

  return chosen;
}
