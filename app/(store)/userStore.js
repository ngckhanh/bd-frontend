import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: {},
    setUser: (user) => set({ user: user }),
    logout: () => set({ user: {} }),
    modalDismissed: true
}));

export default useUserStore;