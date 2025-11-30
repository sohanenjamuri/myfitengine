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
// import foods from "../data/foods.json";

// /**
//  * Very simple rule-based meal planner.
//  * Returns { tdee, meals: [{title, items, calories}], proteinG, fatG, carbG }
//  */

// function calcTDEE({ weight = 70, height = 170, age = 30, gender = "male", activity = 1.375 } = {}) {
//   const bmr =
//     gender === "male"
//       ? 10 * weight + 6.25 * height - 5 * age + 5
//       : 10 * weight + 6.25 * height - 5 * age - 161;
//   return Math.round(bmr * activity);
// }

// function filterFoodsForDisease(list, disease) {
//   if (!disease) return list;
//   const d = disease.toLowerCase();
//   return list.filter((f) => {
//     if (!f.tags || f.tags.length === 0) return true;
//     if (d === "kidney") {
//       if (f.tags.includes("high-potassium") || f.tags.includes("high-phosphorus")) return false;
//     }
//     if (d === "diabetes") {
//       if (f.tags.includes("high-glycemic")) return false;
//     }
//     if (d === "hypertension") {
//       if (f.tags.includes("high-sodium")) return false;
//     }
//     if (d === "cardiac" && f.tags.includes("high-saturated-fat")) return false;
//     return true;
//   });
// }

// export function planMeals({ disease, user = {}, mealCount = 3 } = {}) {
//   const tdee = calcTDEE(user);
//   const perMealCalories = Math.max(300, Math.round(tdee / mealCount));

//   const pool = filterFoodsForDisease(foods, disease);

//   const meals = [];
//   for (let i = 0; i < mealCount; i++) {
//     // pick one of each category with fallback
//     const protein = pool.find((p) => p.category === "protein") || pool[Math.floor(Math.random() * pool.length)];
//     const carb = pool.find((p) => p.category === "carb") || pool[Math.floor(Math.random() * pool.length)];
//     const veg = pool.find((p) => p.category === "veg") || pool[Math.floor(Math.random() * pool.length)];
//     const fat = pool.find((p) => p.category === "fat") || pool[Math.floor(Math.random() * pool.length)];

//     const items = [protein?.name, carb?.name, veg?.name, fat?.name].filter(Boolean);

//     // estimate calories by summing item calories if present, otherwise fallback to perMealCalories
//     const calories =
//       Math.round(items.reduce((s, it) => {
//         const f = pool.find((x) => x.name === it);
//         return s + (f?.calories || perMealCalories / Math.max(1, items.length));
//       }, 0)) || perMealCalories;

//     meals.push({
//       title: i === 0 ? "Breakfast" : i === 1 ? "Lunch" : i === 2 ? "Dinner" : `Meal ${i + 1}`,
//       items,
//       calories,
//     });
//   }

//   const proteinG = Math.round((tdee * 0.25) / 4);
//   const fatG = Math.round((tdee * 0.25) / 9);
//   const carbG = Math.round((tdee * 0.5) / 4);

//   return { tdee, meals, proteinG, fatG, carbG };
// }


// export async function planMeals({ disease = 'none', user = {}, mealCount = 3, activityFactor = 1.375 }) {
// // user: { age, height(cm), weight(kg), gender }
// const age = Number(user.age) || 30;
// const height = Number(user.height) || 170;
// const weight = Number(user.weight) || 70;
// const gender = (user.gender || 'male').toLowerCase();

// const bmr = Math.round(
// gender === 'male'
// ? 10 * weight + 6.25 * height - 5 * age + 5
// : 10 * weight + 6.25 * height - 5 * age - 161
// );

// let tdee = Math.round(bmr * activityFactor);

// if (disease === 'fat_loss') tdee = Math.round(tdee - 400);
// if (disease === 'muscle_gain') tdee = Math.round(tdee + 350);

// let proteinRatio = 0.25, fatRatio = 0.25, carbRatio = 0.5;
// switch ((disease || '').toLowerCase()) {
// case 'kidney':
// // moderate protein, controlled calories
// proteinRatio = 0.2; fatRatio = 0.25; carbRatio = 0.55; tdee = Math.round(tdee - 100);
// break;
// case 'diabetes':
// // higher protein, lower carbs
// proteinRatio = 0.3; fatRatio = 0.28; carbRatio = 0.42;
// break;
// case 'pcos':
// // slightly higher protein, moderate carbs
// proteinRatio = 0.3; fatRatio = 0.25; carbRatio = 0.45;
// break;
// case 'cardiac':
// // heart healthy: moderate calories, lower saturated fat (handled in food choices)
// proteinRatio = 0.25; fatRatio = 0.25; carbRatio = 0.5; tdee = Math.round(tdee - 100);
// break;
// case 'hypertension':
// // encourage veggies, similar macros
// proteinRatio = 0.25; fatRatio = 0.25; carbRatio = 0.5;
// break;
// default:
// break;
// }

// const proteinG = Math.round((tdee * proteinRatio) / 4);
// const fatsG = Math.round((tdee * fatRatio) / 9);
// const carbsG = Math.round((tdee * carbRatio) / 4);

// const bank = {
//     none: [
//       'Oats with milk & banana',
//       'Grilled chicken, brown rice & veggies',
//       'Tofu stir-fry with quinoa',
//       'Greek yogurt with berries and seeds',
//     ],
//     diabetes: [
//       'Oats with nuts & cinnamon (low GI)',
//       'Grilled salmon, spinach & brown rice',
//       'Lentil soup with mixed salad',
//       'Greek yogurt bowl with seeds',
//     ],
//     pcos: [
//       'Greek yogurt, berries & flax',
//       'Quinoa salad with chickpeas & veg',
//       'Stir-fried tofu with greens',
//       'Omelette with spinach & whole grain toast',
//     ],
//     cardiac: [
//       'Grilled fish, sweet potato & greens',
//       'Lentil stew with mixed veg',
//       'Baked chicken breast with steamed veggies',
//       'Oat porridge with seeds and fruit',
//     ],
//     kidney: [
//       'White rice bowl with low-potassium veg',
//       'Grilled fish with light salad (controlled portion)',
//       'Tofu & cucumber salad with herbs',
//       'Plain oats with fruit (portion controlled)',
//     ],
//     hypertension: [
//       'Oats with fruit and seeds',
//       'Grilled salmon with spinach & quinoa',
//       'Lentil & vegetable stew',
//       'Roasted chicken with sweet potato',
//     ],
//   };

//   const choices = bank[(disease || 'none').toLowerCase()] || bank.none;

//   // deterministic selection: rotate through bank
//   const meals = Array.from({ length: mealCount }).map((_, i) => choices[i % choices.length]);

//   return {
//     tdee,
//     macros: { proteinG, carbsG, fatsG },
//     meals,
//   };
// }

// src/utils/mealPlanner.js
// Exports a planMeals(profile, disease) function
// profile: { age, height, weight, gender }
// disease: string like 'kidney' or 'diabetes'

export function calcBmr(profile) {
  const { age, height, weight, gender } = profile;
  // Mifflin-St Jeor
  const bmr = gender === "male"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  return Math.round(bmr);
}

export function calcTdee(bmr, activityFactor = 1.375) {
  return Math.round(bmr * activityFactor);
}

const MEAL_BANK = {
  default: [
    { title: "Grilled chicken & veggies", tags: ["protein","lowfat"] },
    { title: "Oats bowl with nuts & yogurt", tags: ["carb","fiber"] },
    { title: "Tofu stir-fry with rice", tags: ["protein","veg"] }
  ],
  kidney: [
    { title: "White rice bowl + low-potassium veg", tags: ["low-potassium"] },
    { title: "Grilled fish + light salad", tags: ["protein","low-potassium"] },
    { title: "Tofu & veggies (controlled portion)", tags: ["protein","controlled-protein"] }
  ],
  diabetes: [
    { title: "Oats + nuts + Greek yogurt", tags: ["low-glycemic","fiber"] },
    { title: "Grilled chicken + brown rice + spinach", tags: ["low-glycemic"] },
    { title: "Lentil soup + salad", tags: ["legumes","fiber"] }
  ],
  pcos: [
    { title: "Greek yogurt bowl with berries & seeds", tags: ["low-glycemic","protein"] },
    { title: "Quinoa salad with chickpeas", tags: ["fiber","protein"] },
    { title: "Tofu stir-fry with brown rice", tags: ["protein"] }
  ],
  hypertension: [
    { title: "Oats with fruit and flax", tags: ["low-sodium"] },
    { title: "Grilled salmon + sweet potato + spinach", tags: ["omega3","low-sodium"] },
    { title: "Lentil stew + salad", tags: ["low-sodium"] }
  ],
  cardiac: [
    { title: "Baked salmon + quinoa + veg", tags: ["omega3","heart-healthy"] },
    { title: "Legume salad + olive oil", tags: ["fiber","heart-healthy"] },
    { title: "Grilled chicken + steamed veg", tags: ["lean-protein"] }
  ]
};

export function planMeals(profile, disease) {
  const bmr = calcBmr(profile);
  const tdee = calcTdee(bmr); // default activity
  // simple macro split by disease
  let proteinPerc = 0.25, fatPerc = 0.25, carbPerc = 0.5;
  if (disease === "muscle_gain") { proteinPerc = 0.35; carbPerc = 0.45; fatPerc = 0.2; }
  if (disease === "kidney") { proteinPerc = 0.2; carbPerc = 0.55; fatPerc = 0.25; } // controlled protein
  if (disease === "diabetes" || disease === "pcos") { proteinPerc = 0.3; carbPerc = 0.4; fatPerc = 0.3; }
  if (disease === "hypertension" || disease === "cardiac") { fatPerc = 0.25; carbPerc = 0.5; proteinPerc = 0.25; }

  const proteinG = Math.round((tdee * proteinPerc) / 4);
  const fatG = Math.round((tdee * fatPerc) / 9);
  const carbsG = Math.round((tdee * carbPerc) / 4);

  const bank = MEAL_BANK[disease] || MEAL_BANK.default;
  // simple selection: breakfast/lunch/dinner/snack
  const meals = [
    bank[0] || MEAL_BANK.default[0],
    bank[1] || MEAL_BANK.default[1],
    bank[2] || MEAL_BANK.default[2],
    { title: "Fruit & nuts (snack)", tags: ["snack"] }
  ];

  return {
    bmr, tdee, macros: { proteinG, fatG, carbsG }, meals
  };
}

