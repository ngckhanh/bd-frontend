import { create } from "zustand";

const useHistoryStore = create((set) => ({
    history: [],
    addToHistory: (data) => set((state) => ({ history: data })),
    removeFromHistory: (subId) => set((state) => ({ history: state.history.filter((s) => s.sub_id !== subId) })),
    getFromHistory: (subId) => state.history.find((s) => s.sub_id === subId),
    clearHistory: () => set({ history: [] })
}));

export default useHistoryStore;