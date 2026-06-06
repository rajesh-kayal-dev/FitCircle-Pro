import React, { useState, useRef } from "react";
import { uploadProfileImage } from "../../api/userApi";

const ProfileImageUpload = ({ currentImage, onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(currentImage || "https://via.placeholder.com/150");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size should be less than 2MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        setError("Only JPG, JPEG, and PNG formats are allowed");
        return;
      }
      
      setImage(file);
      setError("");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await uploadProfileImage(image);
      console.log("Upload success:", result);
      if (onUploadSuccess) {
        onUploadSuccess(result.profileImage);
      }
      setImage(null);
      alert("Profile image updated successfully! ✅");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Error uploading image ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-900/40 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
        <img
          src={preview}
          alt="Profile Preview"
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500/30 group-hover:border-indigo-500 transition-all duration-300 shadow-xl"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-white text-xs font-medium">Change Photo</span>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={loading || !image}
        className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
          loading || !image
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Uploading...
          </div>
        ) : (
          "Upload New Profile Picture"
        )}
      </button>
      
      <p className="text-gray-500 text-xs text-center border-t border-white/5 pt-4 w-full">
        Supports JPG, PNG (Max 2MB)
      </p>
    </div>
  );
};

export default ProfileImageUpload;
