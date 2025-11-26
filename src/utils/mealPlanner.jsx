// // src/utils/mealPlanner.js
// import foods from "../data/foods.json";

// /**
//  * Simple rule-based meal planner:
//  * inputs:
//  *   - disease: string e.g. 'kidney'
//  *   - user: { weight, height, age, goal } - optionally used to calculate calories
//  *   - options: { meals: number, equipment: [] }
//  *
//  * returns { meals: [{title, items, calories}], tdee, protein, carbs, fats }
//  */

// function calcTDEE({ weight = 70, height = 170, age = 30, gender = "male", activity = 1.375 } = {}) {
//   let bmr = gender === "male"
//     ? (10 * weight + 6.25 * height - 5 * age + 5)
//     : (10 * weight + 6.25 * height - 5 * age - 161);
//   return Math.round(bmr * activity);
// }

// function filterFoodsForDisease(list, disease) {
//   if (!disease) return list;
//   const d = disease.toLowerCase();
//   return list.filter(f => {
//     if (!f.tags || f.tags.length === 0) return true;
//     // remove foods that explicitly conflict with the disease
//     if (d === "kidney") {
//       if (f.tags.includes("high-potassium") || f.tags.includes("high-phosphorus")) return false;
//     }
//     if (d === "diabetes") {
//       if (f.tags.includes("high-glycemic")) return false;
//     }
//     if (d === "hypertension") {
//       if (f.tags.includes("high-sodium")) return false;
//     }
//     // PCOS and Cardiac: prefer whole foods, avoid processed
//     if (d === "cardiac" && f.tags.includes("high-saturated-fat")) return false;
//     return true;
//   });
// }

// export function planMeals({ disease, user = {}, mealCount = 3 }) {
//   const tdee = calcTDEE(user);
//   const perMealCalories = Math.max(300, Math.round(tdee / mealCount));

//   const pool = filterFoodsForDisease(foods, disease);

//   const meals = [];
//   for (let i = 0; i < mealCount; i++) {
//     const protein = pool.find(p => p.category === "protein") || pool[Math.floor(Math.random() * pool.length)];
//     const carb = pool.find(p => p.category === "carb") || pool[Math.floor(Math.random() * pool.length)];
//     const veg = pool.find(p => p.category === "veg") || pool[Math.floor(Math.random() * pool.length)];
//     const fat = pool.find(p => p.category === "fat") || pool[Math.floor(Math.random() * pool.length)];

//     const items = [protein?.name, carb?.name, veg?.name, fat?.name].filter(Boolean);
//     meals.push({
//       title: i === 0 ? "Breakfast" : i === 1 ? "Lunch" : `Meal ${i + 1}`,
//       items,
//       // rough calorie estimate: sum of item calorie estimates if provided or fallback to perMealCalories
//       calories: Math.round(items.reduce((s, it) => {
//         const f = pool.find(x => x.name === it);
//         return s + (f?.calories || perMealCalories / mealCount);
//       }, 0) || perMealCalories)
//     });
//   }

//   // simple macro placeholders
//   const proteinG = Math.round((tdee * 0.25) / 4);
//   const fatG = Math.round((tdee * 0.25) / 9);
//   const carbG = Math.round((tdee * 0.5) / 4);

//   return { tdee, meals, proteinG, fatG, carbG };
// }


// src/utils/mealPlanner.js
import foods from "../data/foods.json";

/**
 * Very simple rule-based meal planner.
 * Returns { tdee, meals: [{title, items, calories}], proteinG, fatG, carbG }
 */

function calcTDEE({ weight = 70, height = 170, age = 30, gender = "male", activity = 1.375 } = {}) {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  return Math.round(bmr * activity);
}

function filterFoodsForDisease(list, disease) {
  if (!disease) return list;
  const d = disease.toLowerCase();
  return list.filter((f) => {
    if (!f.tags || f.tags.length === 0) return true;
    if (d === "kidney") {
      if (f.tags.includes("high-potassium") || f.tags.includes("high-phosphorus")) return false;
    }
    if (d === "diabetes") {
      if (f.tags.includes("high-glycemic")) return false;
    }
    if (d === "hypertension") {
      if (f.tags.includes("high-sodium")) return false;
    }
    if (d === "cardiac" && f.tags.includes("high-saturated-fat")) return false;
    return true;
  });
}

export function planMeals({ disease, user = {}, mealCount = 3 } = {}) {
  const tdee = calcTDEE(user);
  const perMealCalories = Math.max(300, Math.round(tdee / mealCount));

  const pool = filterFoodsForDisease(foods, disease);

  const meals = [];
  for (let i = 0; i < mealCount; i++) {
    // pick one of each category with fallback
    const protein = pool.find((p) => p.category === "protein") || pool[Math.floor(Math.random() * pool.length)];
    const carb = pool.find((p) => p.category === "carb") || pool[Math.floor(Math.random() * pool.length)];
    const veg = pool.find((p) => p.category === "veg") || pool[Math.floor(Math.random() * pool.length)];
    const fat = pool.find((p) => p.category === "fat") || pool[Math.floor(Math.random() * pool.length)];

    const items = [protein?.name, carb?.name, veg?.name, fat?.name].filter(Boolean);

    // estimate calories by summing item calories if present, otherwise fallback to perMealCalories
    const calories =
      Math.round(items.reduce((s, it) => {
        const f = pool.find((x) => x.name === it);
        return s + (f?.calories || perMealCalories / Math.max(1, items.length));
      }, 0)) || perMealCalories;

    meals.push({
      title: i === 0 ? "Breakfast" : i === 1 ? "Lunch" : i === 2 ? "Dinner" : `Meal ${i + 1}`,
      items,
      calories,
    });
  }

  const proteinG = Math.round((tdee * 0.25) / 4);
  const fatG = Math.round((tdee * 0.25) / 9);
  const carbG = Math.round((tdee * 0.5) / 4);

  return { tdee, meals, proteinG, fatG, carbG };
}
