import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authAPI } from '../lib/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  connectWallet: (walletAddress: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      signUp: async (email: string, password: string, fullName?: string) => {
        try {
          set({ loading: true, error: null });

          const data = await authAPI.register({
            email,
            password,
            full_name: fullName || '',
          });

          set({ user: data.user, loading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });

          const data = await authAPI.login({ email, password });

          set({ user: data.user, loading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.message || 'Login failed';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      signOut: async () => {
        try {
          set({ loading: true, error: null });
          authAPI.logout();
          set({ user: null, loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          set({ loading: true });

          const user = authAPI.getCurrentUser();

          if (!user) {
            set({ user: null, loading: false });
            return;
          }

          set({ user, loading: false });
        } catch (error: any) {
          console.error('Auth check error:', error);
          set({ user: null, loading: false });
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        try {
          const { user } = get();
          if (!user) throw new Error('Not authenticated');

          set({ loading: true, error: null });

          const data = await authAPI.updateProfile(updates);

          set({ user: data.user, loading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error || error.message;
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      connectWallet: async (walletAddress: string) => {
        try {
          const { user } = get();
          if (!user) throw new Error('Not authenticated');

          await get().updateProfile({ wallet_address: walletAddress });
        } catch (error: any) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
