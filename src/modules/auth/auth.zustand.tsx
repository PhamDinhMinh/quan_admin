import { create } from 'zustand';

import { TUser } from '../users/services/user.model';

type TAuthState = {
  user: TUser | null;
};

type TAuthActions = {
  setUser: (user: TUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<TAuthState & TAuthActions>((set) => ({
  user: null,
  setUser: (user: TUser | null) => set({ user }),
  logout: () => set({ user: null }),
}));
