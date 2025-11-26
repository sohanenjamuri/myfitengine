
import React, { useState } from "react";
import DiseasePage from "../../pages/DiseasePage";
import PlannerResult from "../../components/PlannerResult";
import { planMeals } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";

export default function PCOS() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createPlanner() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user_profile") || "null") || { weight: 70, height: 170, age: 30, gender: "female" };
    const meals = planMeals({ disease: "pcos", user, mealCount: 3 });
    const workout = planWorkout({ disease: "pcos", equipment: [], focus: "full" });
    setPlan({ ...meals, workout });
    try { localStorage.setItem("myfit_last_plan", JSON.stringify({ tdee: meals.tdee, meals: meals.meals })); } catch (_) {}
    setLoading(false);
  }

  return (
    <>
      <DiseasePage
        slug="pcos"
        title="PCOS"
        heroImage=""
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
          { name: "Short HIIT", notes: "10–15 min intervals if tolerated." }
        ]}
      />

      <div className="max-w-4xl mx-auto p-6 text-center">
        <button onClick={createPlanner} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded">
          {loading ? "Creating..." : "Create Planner for PCOS"}
        </button>
        <PlannerResult plan={plan} />
      </div>
    </>
  );
}
