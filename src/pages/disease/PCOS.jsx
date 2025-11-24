// src/pages/diseases/PCOS.jsx
import React from "react";
import DiseasePage from "../DiseasePage";

const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

export default function PCOS() {
  return (
    <DiseasePage
      slug="pcos"
      title="PCOS"
      heroImage={hero}
      quickTips={[
        "Prioritize low-glycemic carbs and fibre",
        "Focus on resistance training to improve insulin sensitivity",
        "Pay attention to sleep & stress management"
      ]}
      recommendedMeals={[
        "Greek yogurt bowl with berries & seeds",
        "Quinoa salad with chickpeas and veg",
        "Stir-fried tofu & greens with brown rice"
      ]}
      recommendedWorkouts={[
        { name: "Strength Training", notes: "3x/week focusing on big muscle groups." },
        { name: "HIIT (short)", notes: "10–15 min intervals if tolerated." }
      ]}
    />
  );
}
