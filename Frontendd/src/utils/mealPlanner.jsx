
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

const INGREDIENTS = {
  default: {
    proteins: ["Grilled Chicken", "Tofu", "Eggs", "Greek Yogurt", "Lentils"],
    carbs: ["Brown Rice", "Oats", "Quinoa", "Whole Wheat Bread", "Sweet Potato"],
    vitamins: ["Spinach", "Broccoli", "Carrots", "Berries", "Apple"]
  },
  kidney: {
    proteins: ["Egg whites", "Fresh Fish (Cod/Tilapia)", "Skinless Chicken", "Tofu", "Cottage Cheese (Low Sodium)"],
    carbs: ["White Rice", "White Bread", "Pasta", "Couscous", "Rice Noodles"], // Lower phosphorus/potassium
    vitamins: ["Cauliflower", "Red Bell Pepper", "Cabbage", "Apple", "Blueberries"] // Low potassium
  },
  diabetes: {
    proteins: ["Salmon", "Chicken Breast", "Tofu", "Eggs", "Lentils"],
    carbs: ["Quinoa", "Barley", "Oats", "Brown Rice", "Chickpeas"], // Low GI
    vitamins: ["Leafy Greens", "Broccoli", "Tomatoes", "Cucumber", "Berries"]
  },
  pcos: {
    proteins: ["Salmon", "Chicken", "Tofu", "Tempeh", "Edamame"],
    carbs: ["Quinoa", "Buckwheat", "Oats", "Sweet Potato", "Black Beans"],
    vitamins: ["Spinach", "Kale", "Broccoli", "Berries", "Cherries"]
  },
  hypertension: {
    proteins: ["Grilled Salmon", "Chicken Breast", "Lean Beef", "Unsalted Nuts", "Yogurt"],
    carbs: ["Oats", "Brown Rice", "Quinoa", "Whole Grain Pasta", "Potatoes (Baked)"],
    vitamins: ["Leafy Greens", "Beets", "Bananas", "Avocado", "Oranges"] // Potassium rich (DASH)
  },
  cardiac: {
    proteins: ["Salmon (Omega-3)", "Mackerel", "Walnuts", "Tofu", "Beans"],
    carbs: ["Oats", "Barley", "Brown Rice", "Quinoa", "Whole Grain Bread"],
    vitamins: ["Berries", "Spinach", "Kale", "Broccoli", "Carrots"]
  },
  none: {
    proteins: ["Chicken Breast", "Eggs", "Greek Yogurt", "Tofu", "Lean Beef", "Lentils"],
    carbs: ["Brown Rice", "Oats", "Quinoa", "Sweet Potato", "Whole Wheat Pasta", "Banana"],
    vitamins: ["Spinach", "Broccoli", "Carrots", "Berries", "Apple", "Orange", "Mixed Greens"]
  }
};

export { INGREDIENTS };

export function planMeals(profile, disease, selectedIngredients = {}) {
  const bmr = calcBmr(profile);
  const tdee = calcTdee(bmr);

  // simple macro split by disease
  let proteinPerc = 0.25, fatPerc = 0.25, carbPerc = 0.5;
  if (disease === "muscle_gain") { proteinPerc = 0.35; carbPerc = 0.45; fatPerc = 0.2; }
  if (disease === "kidney") { proteinPerc = 0.2; carbPerc = 0.55; fatPerc = 0.25; }
  if (disease === "diabetes" || disease === "pcos") { proteinPerc = 0.3; carbPerc = 0.4; fatPerc = 0.3; }
  if (disease === "hypertension" || disease === "cardiac") { fatPerc = 0.25; carbPerc = 0.5; proteinPerc = 0.25; }
  if (disease === "none") { proteinPerc = 0.3; carbPerc = 0.45; fatPerc = 0.25; } // Balanced healthy diet

  const proteinG = Math.round((tdee * proteinPerc) / 4);
  const fatG = Math.round((tdee * fatPerc) / 9);
  const carbsG = Math.round((tdee * carbPerc) / 4);

  // Get ingredients (use selected or fallback to all available for that disease)
  const bank = INGREDIENTS[disease] || INGREDIENTS.default;
  const proteins = selectedIngredients.proteins?.length ? selectedIngredients.proteins : bank.proteins;
  const carbs = selectedIngredients.carbs?.length ? selectedIngredients.carbs : bank.carbs;
  const vitamins = selectedIngredients.vitamins?.length ? selectedIngredients.vitamins : bank.vitamins;

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Generate 3 distinct meals
  const meals = {
    breakfast: [
      { title: `${pick(proteins)} with ${pick(carbs)} and ${pick(vitamins)}` },
      { title: "Green Tea / Coffee (optional)" }
    ],
    lunch: [
      { title: `${pick(proteins)} bowl with ${pick(carbs)}` },
      { title: `Side of ${pick(vitamins)}` }
    ],
    dinner: [
      { title: `Light ${pick(proteins)} salad` },
      { title: `${pick(vitamins)} mix with ${pick(carbs)}` }
    ],
    snack: [
      { title: `${pick(vitamins)} or Nuts` }
    ]
  };

  return {
    bmr, tdee, macros: { proteinG, fatG, carbsG }, meals
  };
}

