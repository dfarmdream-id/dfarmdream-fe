import { create } from "zustand";
import { User } from "../_models/response/sign-in";

interface AuthState {
  user: User | null;
  permissions: string[];
}

interface AuthActions {
  setUser: (user: AuthState["user"]) => void;
  setPermissions: (permissions: AuthState["permissions"]) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  permissions: [],
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  clear: () => set({ user: null, permissions: [] }),
}));
