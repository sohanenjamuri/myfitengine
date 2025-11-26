
import React, { useState } from "react";
import DiseasePage from "../../pages/DiseasePage";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";

export default function Kidney() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createPlanner() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user_profile") || "null") || { weight: 70, height: 170, age: 30, gender: "male" };
    const meals = planMeals({ disease: "kidney", user, mealCount: 3 });
    const workout = planWorkout({ disease: "kidney", equipment: [], focus: "full" });
    setPlan({ ...meals, workout });
    try { localStorage.setItem("myfit_last_plan", JSON.stringify({ tdee: meals.tdee, meals: meals.meals })); } catch (_) {}
    setLoading(false);
  }

  return (
    <>
      <DiseasePage
        slug="kidney"
        title="Kidney"
        heroImage=""
        quickTips={[
          "Monitor potassium & phosphorus in meals",
          "Prioritize high-quality protein in controlled amounts",
          "Stay hydrated but follow clinical fluid guidance"
        ]}
        recommendedMeals={[
          "White rice bowl with low-potassium veggies",
          "Grilled fish with a light salad",
          "Tofu stir-fry with controlled portion"
        ]}
        recommendedWorkouts={[
          { name: "Low-impact Cardio", notes: "Cycling or brisk walking" },
          { name: "Light Resistance", notes: "Keep intensity moderate" }
        ]}
      />

      <div className="max-w-4xl mx-auto p-6 text-center">
        <button onClick={createPlanner} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Create Planner for Kidney"}
        </button>
        <PlannerResult plan={plan} />
      </div>
    </>
  );
}
