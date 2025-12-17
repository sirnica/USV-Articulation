import { mockUser } from "@/lib/mockData";

export function useAuth() {
  return {
    user: mockUser,
    isAuthenticated: true,
    loading: false,
    error: null,
    refresh: () => Promise.resolve(),
    logout: () => Promise.resolve(),
  };
}
