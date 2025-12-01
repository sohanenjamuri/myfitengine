import React, { useState, useEffect } from "react";
import DiseaseProfileForm from "../../components/DisaeseProfileForm";
import PlannerResult from "../../components/PlannerResult";
import { planMeals, INGREDIENTS } from "../../utils/mealPlanner";
import { planWorkout } from "../../utils/workoutPlanner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { getUser, savePlan } from "../../utils/api";

export default function None() {
    const [profile, setProfile] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState({ proteins: [], carbs: [], vitamins: [] });
    const [result, setResult] = useState(null);
    const [step, setStep] = useState(1); // 1 = profile, 2 = meals, 3 = result
    const navigate = useNavigate();
    const [uid, setUid] = useState(null);
    const diseaseName = "none";

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (!u) {
                navigate("/login");
                return;
            }
            setUid(u.uid);

            // Fetch disease-specific profile from MongoDB
            try {
                const user = await getUser(u.uid);
                if (user && user.diseaseProfiles && user.diseaseProfiles[diseaseName]) {
                    const saved = user.diseaseProfiles[diseaseName];
                    if (saved && (saved.name || saved.age || saved.height || saved.weight)) {
                        setProfile(saved);
                        setStep(2);
                    }
                }
            } catch (e) {
                console.warn("Could not fetch None profile:", e);
            }
        });
        return () => unsub();
    }, [navigate]);

    const onProfileSubmit = (values) => {
        setProfile(values);
        setStep(2);
        setSelectedIngredients({ proteins: [], carbs: [], vitamins: [] });
        setResult(null);
        setTimeout(() => document.getElementById("mealSelection")?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const toggleIngredient = (category, item) => {
        setSelectedIngredients(prev => {
            const list = prev[category];
            const newList = list.includes(item) ? list.filter(i => i !== item) : [...list, item];
            return { ...prev, [category]: newList };
        });
    };

    const handleCalculatePlan = async () => {
        if (!profile) {
            alert("Please enter your profile first.");
            return;
        }

        const mealPlan = planMeals(profile, diseaseName, selectedIngredients);
        const workout = planWorkout(profile, diseaseName) || { items: [] };

        const combined = {
            bmr: mealPlan.bmr || null,
            tdee: mealPlan.tdee || null,
            macros: mealPlan.macros || null,
            meals: mealPlan.meals,
            workout
        };

        setResult(combined);
        setStep(3);

        // Save last plan to MongoDB
        if (uid) {
            try {
                await savePlan(uid, diseaseName, { tdee: combined.tdee, macros: combined.macros, meals: combined.meals, workout: combined.workout }, true);
            } catch (_) { }
        }
        setTimeout(() => document.getElementById("plannerResults")?.scrollIntoView({ behavior: "smooth" }), 80);
    };

    const handleSave = async (res) => {
        try {
            if (uid) {
                await savePlan(uid, diseaseName, { ...profile, ...res }, false);
                alert("Plan saved to profile");
            } else {
                alert("User not identified");
            }
        } catch (e) {
            console.error(e);
            alert("Could not save plan");
        }
    };

    const editProfile = () => {
        setStep(1);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold">Healthy Living — Personalized Planner</h1>
                    <p className="text-gray-600 mt-2">Enter your profile, choose healthy ingredients, and create a balanced meal plan.</p>
                </header>

                {step === 1 && (
                    <div id="profileForm" className="mb-6">
                        <DiseaseProfileForm
                            initial={profile || {}}
                            onSubmit={onProfileSubmit}
                            submitLabel="Next: Choose Meals"
                            uid={uid}
                            disease={diseaseName}
                        />
                    </div>
                )}

                {step >= 2 && (
                    <section id="mealSelection" className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-1">Choose Ingredients</h2>
                                <p className="text-sm text-gray-600">Select your preferred ingredients to build your plan.</p>
                            </div>
                            <div>
                                <button onClick={editProfile} className="text-sm underline text-gray-600">Edit profile</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Proteins */}
                            <div>
                                <h3 className="font-semibold text-emerald-700 mb-2">Proteins</h3>
                                <div className="space-y-2">
                                    {INGREDIENTS.none?.proteins.map(item => (
                                        <label key={item} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedIngredients.proteins.includes(item)}
                                                onChange={() => toggleIngredient('proteins', item)}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Carbs */}
                            <div>
                                <h3 className="font-semibold text-emerald-700 mb-2">Carbs</h3>
                                <div className="space-y-2">
                                    {INGREDIENTS.none?.carbs.map(item => (
                                        <label key={item} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedIngredients.carbs.includes(item)}
                                                onChange={() => toggleIngredient('carbs', item)}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Vitamins */}
                            <div>
                                <h3 className="font-semibold text-emerald-700 mb-2">Vitamins (Veg/Fruit)</h3>
                                <div className="space-y-2">
                                    {INGREDIENTS.none?.vitamins.map(item => (
                                        <label key={item} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedIngredients.vitamins.includes(item)}
                                                onChange={() => toggleIngredient('vitamins', item)}
                                                className="rounded text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <button onClick={handleCalculatePlan} className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition">Generate Plan</button>
                            <button onClick={() => setSelectedIngredients({ proteins: [], carbs: [], vitamins: [] })} className="px-3 py-2 rounded border hover:bg-gray-50">Clear selections</button>
                        </div>
                    </section>
                )}

                <div id="plannerResults" className="mt-6">
                    <PlannerResult result={result} onSave={handleSave} />
                </div>
            </div>
        </div>
    );
}
