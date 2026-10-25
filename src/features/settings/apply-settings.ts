import { Appearance } from 'react-native';

import { changeLanguage } from '@/i18n';
import { deviceLanguage, resolveLanguage, type LanguageSetting } from '@/i18n/language';

import type { ThemeSetting } from './settings-slice';

// Aplica o tema no app inteiro, inclusive nas partes nativas (cabeçalhos, folha de tipos,
// barra de status). 'unspecified' volta a seguir o sistema.
export function applyTheme(theme: ThemeSetting) {
  Appearance.setColorScheme(theme === 'system' ? 'unspecified' : theme);
}

export function applyLanguage(language: LanguageSetting) {
  changeLanguage(resolveLanguage(language, deviceLanguage()));
}
