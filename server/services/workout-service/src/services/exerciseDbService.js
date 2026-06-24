import axios from "axios";

const BASE_URL = "https://oss.exercisedb.dev/api/v1";

export async function getExercisesByBodyPart(bodyPart) {
  const { data } = await axios.get(`${BASE_URL}/exercises/bodyPart/${bodyPart}`, {
    params: { limit: 50 },
  });
  return data;
}

export async function getExerciseById(id) {
  const { data } = await axios.get(`${BASE_URL}/exercises/exercise/${id}`);
  return data;
}

export async function listBodyParts() {
  const { data } = await axios.get(`${BASE_URL}/exercises/bodyPartList`);
  return data;
}

export async function getExercisesByTarget(target) {
  const { data } = await axios.get(`${BASE_URL}/exercises/target/${target}`, {
    params: { limit: 50 },
  });
  return data;
}

export async function getExercisesByEquipment(equipment) {
  const { data } = await axios.get(`${BASE_URL}/exercises/equipment/${equipment}`, {
    params: { limit: 50 },
  });
  return data;
}

export async function searchExercises(query) {
  const { data } = await axios.get(`${BASE_URL}/exercises/name/${query}`, {
    params: { limit: 50 },
  });
  return data;
}
