// src/pages/diseases/Diabetes.jsx
import React from "react";
import DiseasePage from "../DiseasePage";

const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

export default function Diabetes() {
  return (
    <DiseasePage
      slug="diabetes"
      title="Diabetes"
      heroImage={hero}
      quickTips={[
        "Prefer low-GI carbohydrates (brown rice, oats, quinoa)",
        "Small frequent meals may help manage blood sugar",
        "Monitor pre/post workout glucose if needed"
      ]}
      recommendedMeals={[
        "Oats breakfast with nuts & Greek yogurt",
        "Grilled chicken with spinach and brown rice",
        "Lentil soup and salad"
      ]}
      recommendedWorkouts={[
        { name: "Brisk Walk", notes: "30–45 minutes, low intensity to keep glucose stable." },
        { name: "Resistance Circuit", notes: "2–3x/week; focus on compound moves." }
      ]}
    />
  );
}
