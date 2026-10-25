import { describe, expect, it } from '@jest/globals';

import {
  favoritesSlice,
  selectFavorites,
  selectIsFavorite,
  toggleFavorite,
} from '@/features/favorites/favorites-slice';

const pikachu = { id: 25, name: 'pikachu', imageUrl: '' };
const charizardMegaX = { id: 10034, name: 'charizard-mega-x', imageUrl: '' };

describe('favoritos', () => {
  const reduce = favoritesSlice.reducer;

  it('adiciona e depois remove o mesmo Pokémon', () => {
    const added = reduce(undefined, toggleFavorite(pikachu));
    expect(added.items).toEqual([pikachu]);
    expect(reduce(added, toggleFavorite(pikachu)).items).toEqual([]);
  });

  it('guarda formas alternativas pelo nome, como as espécies', () => {
    const state = reduce(
      reduce(undefined, toggleFavorite(pikachu)),
      toggleFavorite(charizardMegaX),
    );
    const root = { favorites: state };
    expect(selectFavorites(root)).toHaveLength(2);
    expect(selectIsFavorite(root, 'charizard-mega-x')).toBe(true);
    expect(selectIsFavorite(root, 'charizard')).toBe(false);
  });
});
