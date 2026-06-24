import axios from "axios";

export const searchExercises = async (query) => {
  try {
    const apiKey = process.env.EXERCISEDB_API_KEY;
    if (!apiKey) {
      console.warn("EXERCISEDB_API_KEY is missing. Returning mock exercises.");
      return getMockExercises();
    }

    // Usually ExerciseDB is accessed via RapidAPI
    const url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      },
      params: { limit: 5 }
    });

    if (!response.data || !Array.isArray(response.data)) return [];

    return response.data.slice(0, 5).map(item => ({
      id: item.id,
      type: "workout",
      title: item.name.toUpperCase(),
      target: item.target,
      bodyPart: item.bodyPart,
      equipment: item.equipment,
      image: item.gifUrl,
    }));
  } catch (error) {
    console.error("ExerciseDB Error:", error.response?.data || error.message);
    return getMockExercises();
  }
};

function getMockExercises() {
  return [
    {
      id: "mock-e1",
      type: "workout",
      title: "BARBELL BENCH PRESS",
      target: "pectorals",
      bodyPart: "chest",
      equipment: "barbell",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: "mock-e2",
      type: "workout",
      title: "DUMBBELL BICEP CURL",
      target: "biceps",
      bodyPart: "upper arms",
      equipment: "dumbbell",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=300"
    }
  ];
}
