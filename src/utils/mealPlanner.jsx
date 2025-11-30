
export function calcBmr(profile) {
  const { age, height, weight, gender } = profile;
 
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

