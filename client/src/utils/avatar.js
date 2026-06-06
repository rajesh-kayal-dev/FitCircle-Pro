export const getUserAvatar = (user) => {
  if (!user) return "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff";
  
  const avatar = user.profileImage || user.avatar || user.profilePicture || user.image;
  if (avatar) return avatar;

  const name = user.name || user.email || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
};
