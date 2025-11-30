
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
  
  const suggestions = bank.map((w) => {
    const adjusted = { ...w };
    if (profile.age > 60) adjusted.note = "Reduce intensity and prioritize mobility";
    if (profile.weight > 120) adjusted.note = (adjusted.note ? adjusted.note + " • " : "") + "Avoid high-impact";
    return adjusted;
  });
  return suggestions;
}
