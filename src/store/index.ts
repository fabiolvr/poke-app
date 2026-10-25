import { combineSlices, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import {
  favoritesSlice,
  selectFavorites,
  toggleFavorite,
} from '@/features/favorites/favorites-slice';
import { loadFavorites, saveFavorites } from '@/features/favorites/favorites-storage';
import { pokemonApi } from '@/features/pokemon/pokemon-api';
import { applyLanguage, applyTheme } from '@/features/settings/apply-settings';
import {
  selectSettings,
  setLanguage,
  setTheme,
  settingsSlice,
} from '@/features/settings/settings-slice';
import { loadSettings, saveSettings } from '@/features/settings/settings-storage';
import { setupI18n } from '@/i18n';
import { deviceLanguage, resolveLanguage } from '@/i18n/language';

const rootReducer = combineSlices(pokemonApi, favoritesSlice, settingsSlice);

// Tema e idioma salvos valem desde a primeira tela.
const settings = loadSettings();
setupI18n(resolveLanguage(settings.language, deviceLanguage()));
applyTheme(settings.theme);

// Grava os favoritos no aparelho sempre que a lista muda.
const listener = createListenerMiddleware();
listener.startListening({
  actionCreator: toggleFavorite,
  effect: (_action, listenerApi) => {
    saveFavorites(selectFavorites(listenerApi.getState() as RootState));
  },
});

// Configurações: aplica na hora e guarda para a próxima abertura.
listener.startListening({
  actionCreator: setTheme,
  effect: (action, listenerApi) => {
    applyTheme(action.payload);
    saveSettings(selectSettings(listenerApi.getState() as RootState));
  },
});
listener.startListening({
  actionCreator: setLanguage,
  effect: (action, listenerApi) => {
    applyLanguage(action.payload);
    saveSettings(selectSettings(listenerApi.getState() as RootState));
  },
});

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: { favorites: { items: loadFavorites() }, settings },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Checagens só de desenvolvimento: percorrem a store inteira e, com os 1.025 nomes da
      // busca guardados, passam do limite padrão de 32 ms e enchem o terminal de avisos.
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 },
    })
      .prepend(listener.middleware)
      .concat(pokemonApi.middleware),
  // Reactotron mostra actions e estado da store no app de desktop. O require dentro do
  // __DEV__ deixa a biblioteca fora do build de produção.
  enhancers: (getDefaultEnhancers) => {
    if (!__DEV__) return getDefaultEnhancers();
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- import condicional de propósito
    const { reactotron } = require('./reactotron') as typeof import('./reactotron');
    return getDefaultEnhancers().concat(reactotron.createEnhancer());
  },
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
