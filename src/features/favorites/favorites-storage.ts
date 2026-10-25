import Storage from 'expo-sqlite/kv-store';

import type { PokemonSummary } from '@/features/pokemon/types';

const STORAGE_KEY = 'favorites';

export function loadFavorites(): PokemonSummary[] {
  const raw = Storage.getItemSync(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as PokemonSummary[];
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: PokemonSummary[]) {
  Storage.setItemSync(STORAGE_KEY, JSON.stringify(favorites));
}
