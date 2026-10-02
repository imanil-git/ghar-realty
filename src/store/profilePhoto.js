import { create } from "zustand";

export const useProfilePhotoStore = create((set, get) => ({
  profilePhoto: null,

  setProfilePhoto: (file) => {
    const previousPhoto = get().profilePhoto;

    const nextPhoto = file ? { file, url: URL.createObjectURL(file) } : null;

    set({ profilePhoto: nextPhoto });

    if (previousPhoto) {
      URL.revokeObjectURL(previousPhoto.url);
    }
  },
}));
