import { create } from 'zustand';

interface CategoryState {
  activeCategory: number | null;
  setActiveCategory: (category: number | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  activeCategory: null, // Domyślnie żadna kategoria nie jest aktywna
  setActiveCategory: (category: number | null) => set({ activeCategory: category }),
}));
