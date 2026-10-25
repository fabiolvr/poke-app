import { combineSlices, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import {
  favoritesSlice,
  selectFavorites,
  toggleFavorite,
} from '@/features/favorites/favorites-slice';
import { loadFavorites, saveFavorites } from '@/features/favorites/favorites-storage';
import { pokemonApi } from '@/features/pokemon/pokemon-api';

const rootReducer = combineSlices(pokemonApi, favoritesSlice);

// Grava os favoritos no aparelho sempre que a lista muda.
const favoritesListener = createListenerMiddleware();
favoritesListener.startListening({
  actionCreator: toggleFavorite,
  effect: (_action, listenerApi) => {
    saveFavorites(selectFavorites(listenerApi.getState() as RootState));
  },
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: { favorites: { items: loadFavorites() } },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Checagens só de desenvolvimento: percorrem a store inteira e, com os 1.025 nomes da
      // busca guardados, passam do limite padrão de 32 ms e enchem o terminal de avisos.
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 },
    })
      .prepend(favoritesListener.middleware)
      .concat(pokemonApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
