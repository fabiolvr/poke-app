import { getLocales } from 'expo-localization';

export type Language = 'pt' | 'en';
export type LanguageSetting = 'system' | Language;

let cachedDeviceLanguage: Language | undefined;

// Aparelho em português usa o app em português; qualquer outro idioma cai no inglês.
// Lido uma vez: trocar o idioma do aparelho reinicia o app.
export function deviceLanguage(): Language {
  cachedDeviceLanguage ??= getLocales()[0]?.languageCode === 'pt' ? 'pt' : 'en';
  return cachedDeviceLanguage;
}

export function resolveLanguage(setting: LanguageSetting, device: Language): Language {
  return setting === 'system' ? device : setting;
}
