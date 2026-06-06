import API from "./axios";

export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await API.post("/users/upload-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await API.put("/users/update", profileData);
  return data;
};

export const getUserProfile = async () => {
  const { data } = await API.get("/users/me");
  return data;
};
