import Storage from 'expo-sqlite/kv-store';

import { initialSettings, type SettingsState } from './settings-slice';

const STORAGE_KEY = 'settings';

// Leitura síncrona: o tema e o idioma precisam estar certos antes da primeira tela.
export function loadSettings(): SettingsState {
  const raw = Storage.getItemSync(STORAGE_KEY);
  if (!raw) {
    return initialSettings;
  }
  try {
    return { ...initialSettings, ...(JSON.parse(raw) as Partial<SettingsState>) };
  } catch {
    return initialSettings;
  }
}

export function saveSettings(settings: SettingsState) {
  Storage.setItemSync(STORAGE_KEY, JSON.stringify(settings));
}
