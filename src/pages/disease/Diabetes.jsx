// // src/pages/diseases/Diabetes.jsx
// import React from "react";
// import DiseasePage from "../DiseasePage";

// const hero = "/mnt/data/744b2a8b-8847-474b-8e5d-592c3d59ebbb.png";

// export default function Diabetes() {
//   return (
//     <DiseasePage
//       slug="diabetes"
//       title="Diabetes"
//       heroImage={hero}
//       quickTips={[
//         "Prefer low-GI carbohydrates (brown rice, oats, quinoa)",
//         "Small frequent meals may help manage blood sugar",
//         "Monitor pre/post workout glucose if needed"
//       ]}
//       recommendedMeals={[
//         "Oats breakfast with nuts & Greek yogurt",
//         "Grilled chicken with spinach and brown rice",
//         "Lentil soup and salad"
//       ]}
//       recommendedWorkouts={[
//         { name: "Brisk Walk", notes: "30–45 minutes, low intensity to keep glucose stable." },
//         { name: "Resistance Circuit", notes: "2–3x/week; focus on compound moves." }
//       ]}
//     />
//   );
// }


import React, { useState } from "react";
import DiseasePage from "../../pages/DiseasePage";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";

export default function Diabetes() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createPlanner() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user_profile") || "null") || { weight: 70, height: 170, age: 30, gender: "male" };
    const meals = planMeals({ disease: "diabetes", user, mealCount: 3 });
    const workout = planWorkout({ disease: "diabetes", equipment: [], focus: "full" });
    setPlan({ ...meals, workout });
    try { localStorage.setItem("myfit_last_plan", JSON.stringify({ tdee: meals.tdee, meals: meals.meals })); } catch (_) {}
    setLoading(false);
  }

  return (
    <>
      <DiseasePage
        slug="diabetes"
        title="Diabetes"
        heroImage=""
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
          { name: "Brisk Walk", notes: "30–45 minutes, low intensity." },
          { name: "Resistance Circuit", notes: "2–3x/week; focus on compound moves." }
        ]}
      />

      <div className="max-w-4xl mx-auto p-6 text-center">
        <button onClick={createPlanner} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Create Planner for Diabetes"}
        </button>
        <PlannerResult plan={plan} />
      </div>
    </>
  );
}
