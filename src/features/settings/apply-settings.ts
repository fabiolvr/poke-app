import { Appearance, Platform } from 'react-native';

import { changeLanguage } from '@/i18n';
import { deviceLanguage, resolveLanguage, type LanguageSetting } from '@/i18n/language';

import type { ThemeSetting } from './settings-slice';

// Aplica o tema no app inteiro, inclusive nas partes nativas (cabeçalhos, folha de tipos,
// barra de status). 'unspecified' volta a seguir o sistema.
export function applyTheme(theme: ThemeSetting) {
  // Na web (inclusive no manifesto de servidor que o build do Android gera) o Appearance não
  // tem setColorScheme; lá o app segue o tema do sistema.
  if (Platform.OS === 'web') {
    return;
  }
  Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
}

export function applyLanguage(language: LanguageSetting) {
  changeLanguage(resolveLanguage(language, deviceLanguage()));
}
