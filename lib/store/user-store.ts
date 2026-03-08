import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserState = {
  email: string | null;
  name: string | null;
  role: string | null;

  setUser: (user: { email: string; name: string; role: string }) => void;

  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      name: null,
      role: null,

      setUser: (user) =>
        set({
          email: user.email,
          name: user.name,
          role: user.role
        }),

      clearUser: () =>
        set({
          email: null,
          name: null,
          role: null
        })
    }),
    {
      name: 'user-storage'
    }
  )
);
