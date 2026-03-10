import { create } from 'zustand';

interface AuthState {
    token: string | null;
    user: any | null;
    setAuth: (token: string, user: any) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('user_data') || 'null'),
    setAuth: (token, user) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        set({ token, user });
    },
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        set({ token: null, user: null });
    },
}));
