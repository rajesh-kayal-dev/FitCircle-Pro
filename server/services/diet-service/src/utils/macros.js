export function calculateMacros(tdee, goal, weightKg) {
  let calories = tdee;

  if (goal === "weight_loss") {
    calories = tdee - 500;
  } else if (goal === "muscle_gain") {
    calories = tdee + 300;
  } else if (goal === "fat_loss") {
    calories = tdee - 300;
  }

  if (calories < 1200) calories = 1200;

  const protein = Math.round(weightKg * 2);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return {
    calories,
    protein,
    carbs,
    fat,
  };
}
