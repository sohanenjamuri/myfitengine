// src/pages/diseases/Kidney.jsx
import React from "react";
import DiseasePage from "../DiseasePage";

const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

export default function Kidney() {
  return (
    <DiseasePage
      slug="kidney"
      title="Kidney"
      heroImage={hero}
      quickTips={[
        "Monitor potassium & phosphorus in meals",
        "Prioritize high-quality protein in controlled amounts",
        "Stay hydrated but follow any fluid restrictions given by your clinician"
      ]}
      recommendedMeals={[
        "White rice bowl with low-potassium veggies",
        "Grilled fish with a light salad",
        "Tofu stir-fry with controlled portion"
      ]}
      recommendedWorkouts={[
        { name: "Low-impact Cardio", notes: "Cycling or brisk walking; avoid heavy dehydration." },
        { name: "Light Resistance", notes: "Keep intensity moderate; monitor symptoms." }
      ]}
    />
  );
}
