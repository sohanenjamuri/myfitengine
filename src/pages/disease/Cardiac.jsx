// src/pages/diseases/Cardiac.jsx
import React from "react";
import DiseasePage from "../DiseasePage";

const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

export default function Cardiac() {
  return (
    <DiseasePage
      slug="cardiac"
      title="Cardiac"
      heroImage={hero}
      quickTips={[
        "Low-saturated-fat diet, follow clinical guidance",
        "Prefer moderate-intensity aerobic activity",
        "Always clear exercises with your cardiologist if needed"
      ]}
      recommendedMeals={[
        "Oily fish, steamed veg, whole grains",
        "Legume-based soups and salads",
        "Baked chicken with vegetables"
      ]}
      recommendedWorkouts={[
        { name: "Cardio (moderate)", notes: "Walking/cycling; avoid sudden high intensity changes" },
        { name: "Light Resistance", notes: "Supervised if necessary" }
      ]}
    />
  );
}
