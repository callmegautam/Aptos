import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
  user: {
    email: string;
    name: string;
    role: string;
    avatar?: string;
  } | null;

  setUser: (user: UserState['user']) => void;

  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set({
          user: user
        }),

      clearUser: () =>
        set({
          user: null
        })
    }),
    {
      name: 'user-storage'
    }
  )
);
