// // src/pages/diseases/Cardiac.jsx
// import React from "react";
// import DiseasePage from "../DiseasePage";

// const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

// export default function Cardiac() {
//   return (
//     <DiseasePage
//       slug="cardiac"
//       title="Cardiac"
//       heroImage={hero}
//       quickTips={[
//         "Low-saturated-fat diet, follow clinical guidance",
//         "Prefer moderate-intensity aerobic activity",
//         "Always clear exercises with your cardiologist if needed"
//       ]}
//       recommendedMeals={[
//         "Oily fish, steamed veg, whole grains",
//         "Legume-based soups and salads",
//         "Baked chicken with vegetables"
//       ]}
//       recommendedWorkouts={[
//         { name: "Cardio (moderate)", notes: "Walking/cycling; avoid sudden high intensity changes" },
//         { name: "Light Resistance", notes: "Supervised if necessary" }
//       ]}
//     />
//   );
// }


import React, { useState } from "react";
import DiseasePage from "../../pages/DiseasePage";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";

export default function Cardiac() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createPlanner() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user_profile") || "null") || { weight: 70, height: 170, age: 50, gender: "male" };
    const meals = planMeals({ disease: "cardiac", user, mealCount: 3 });
    const workout = planWorkout({ disease: "cardiac", equipment: [], focus: "full" });
    setPlan({ ...meals, workout });
    try { localStorage.setItem("myfit_last_plan", JSON.stringify({ tdee: meals.tdee, meals: meals.meals })); } catch (_) {}
    setLoading(false);
  }

  return (
    <>
      <DiseasePage
        slug="cardiac"
        title="Cardiac"
        heroImage=""
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
          { name: "Moderate Cardio", notes: "Walking/cycling; steady pace" },
          { name: "Light Resistance", notes: "Supervised if necessary" }
        ]}
      />

      <div className="max-w-4xl mx-auto p-6 text-center">
        <button onClick={createPlanner} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Create Planner for Cardiac"}
        </button>
        <PlannerResult plan={plan} />
      </div>
    </>
  );
}
