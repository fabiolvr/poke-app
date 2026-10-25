import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { LanguageSetting } from '@/i18n/language';

export type ThemeSetting = 'system' | 'light' | 'dark';

export type SettingsState = {
  theme: ThemeSetting;
  language: LanguageSetting;
};

export const initialSettings: SettingsState = { theme: 'system', language: 'system' };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettings,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeSetting>) {
      state.theme = action.payload;
    },
    setLanguage(state, action: PayloadAction<LanguageSetting>) {
      state.language = action.payload;
    },
  },
  selectors: {
    selectSettings: (state) => state,
    selectThemeSetting: (state) => state.theme,
    selectLanguageSetting: (state) => state.language,
  },
});

export const { setTheme, setLanguage } = settingsSlice.actions;
export const { selectSettings, selectThemeSetting, selectLanguageSetting } =
  settingsSlice.selectors;
