// This file is deprecated and replaced by api.ts
// Supabase has been replaced with backend API integration
// All authentication and data operations now use the backend API

// Dummy export to prevent breaking imports
export const supabase = {
  auth: {
    signUp: () => Promise.reject(new Error('Use authAPI from api.ts instead')),
    signInWithPassword: () => Promise.reject(new Error('Use authAPI from api.ts instead')),
    signOut: () => Promise.reject(new Error('Use authAPI from api.ts instead')),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
  from: () => ({
    select: () => Promise.reject(new Error('Use API methods from api.ts instead')),
    insert: () => Promise.reject(new Error('Use API methods from api.ts instead')),
    update: () => Promise.reject(new Error('Use API methods from api.ts instead')),
    delete: () => Promise.reject(new Error('Use API methods from api.ts instead')),
  }),
};

export const DATABASE_SCHEMA = '';
