// // src/pages/diseases/Hypertension.jsx
// import React from "react";
// import DiseasePage from "../DiseasePage";

// const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

// export default function Hypertension() {
//   return (
//     <DiseasePage
//       slug="hypertension"
//       title="Hypertension"
//       heroImage={hero}
//       quickTips={[
//         "Reduce sodium; prefer whole foods over processed",
//         "Increase potassium-rich foods if advised",
//         "Prioritize aerobic exercise for heart health"
//       ]}
//       recommendedMeals={[
//         "Oats with fruits and nuts",
//         "Grilled salmon, sweet potato, spinach",
//         "Lentil stew and salad"
//       ]}
//       recommendedWorkouts={[
//         { name: "Aerobic Cardio", notes: "30 min moderate intensity most days" },
//         { name: "Mobility & Core", notes: "Daily light mobility helps overall health" }
//       ]}
//     />
//   );
// }


import React, { useState } from "react";
import DiseasePage from "../../pages/DiseasePage";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";

export default function Hypertension() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createPlanner() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user_profile") || "null") || { weight: 70, height: 170, age: 45, gender: "male" };
    const meals = planMeals({ disease: "hypertension", user, mealCount: 3 });
    const workout = planWorkout({ disease: "hypertension", equipment: [], focus: "full" });
    setPlan({ ...meals, workout });
    try { localStorage.setItem("myfit_last_plan", JSON.stringify({ tdee: meals.tdee, meals: meals.meals })); } catch (_) {}
    setLoading(false);
  }

  return (
    <>
      <DiseasePage
        slug="hypertension"
        title="Hypertension"
        heroImage=""
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

      <div className="max-w-4xl mx-auto p-6 text-center">
        <button onClick={createPlanner} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Create Planner for Hypertension"}
        </button>
        <PlannerResult plan={plan} />
      </div>
    </>
  );
}
