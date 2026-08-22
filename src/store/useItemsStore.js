import { create } from 'zustand';

// One store, made with `create`. No provider needed — Zustand stores are
// module-level, so any component can subscribe to this directly.
//
// Everything the products list needs lives here: the list itself, the request
// status, the error message, and which items have been favorited.
const useItemsStore = create((set) => ({
  items: [],
  status: 'idle', // idle | loading | success | error
  error: null,
  favorites: [],

  // The fetch lives inside the action, not in a separate api file and not in a
  // component's useEffect. Components just call loadItems() and read `status`.
  loadItems: async () => {
    set({ status: 'loading', error: null });

    try {
      const res = await fetch('https://dummyjson.com/products?limit=8');
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      set({ items: data.products, status: 'success' });
    } catch (err) {
      set({ error: err.message, status: 'error' });
    }
  },

  // Every state change goes through `set`, and we build a new array rather than
  // pushing into the old one — nothing is edited in place.
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((favId) => favId !== id)
        : [...state.favorites, id],
    })),
}));

export default useItemsStore;
