// src/pages/diseases/Hypertension.jsx
import React from "react";
import DiseasePage from "../DiseasePage";

const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

export default function Hypertension() {
  return (
    <DiseasePage
      slug="hypertension"
      title="Hypertension"
      heroImage={hero}
      quickTips={[
        "Reduce sodium; prefer whole foods over processed",
        "Increase potassium-rich foods if advised",
        "Prioritize aerobic exercise for heart health"
      ]}
      recommendedMeals={[
        "Oats with fruits and nuts",
        "Grilled salmon, sweet potato, spinach",
        "Lentil stew and salad"
      ]}
      recommendedWorkouts={[
        { name: "Aerobic Cardio", notes: "30 min moderate intensity most days" },
        { name: "Mobility & Core", notes: "Daily light mobility helps overall health" }
      ]}
    />
  );
}
