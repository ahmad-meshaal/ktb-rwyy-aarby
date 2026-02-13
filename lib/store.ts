import create from 'zustand';

// Define your Zustand store
const useStore = create((set) => ({
  // Initial state
  count: 0,
  // Actions to modify the state
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;