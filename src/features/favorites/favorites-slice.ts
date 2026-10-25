import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { PokemonSummary } from '@/features/pokemon/types';

type FavoritesState = {
  items: PokemonSummary[];
};

const initialState: FavoritesState = { items: [] };

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<PokemonSummary>) {
      const index = state.items.findIndex((item) => item.name === action.payload.name);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
  },
  selectors: {
    selectFavorites: (state) => state.items,
    selectIsFavorite: (state, name: string) => state.items.some((item) => item.name === name),
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const { selectFavorites, selectIsFavorite } = favoritesSlice.selectors;
