import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from './en';
import type { Language } from './language';
import { pt } from './pt';

// Instância própria; o initReactI18next a entrega para o useTranslation.
const i18n = createInstance();

// Inicia de forma síncrona: os textos já estão no bundle e a primeira tela sai no idioma certo.
export function setupI18n(language: Language) {
  i18n.use(initReactI18next).init({
    resources: { pt: { translation: pt }, en: { translation: en } },
    lng: language,
    // Sem idioma reserva: as duas traduções têm as mesmas chaves (o tipo de en.ts garante).
    fallbackLng: false,
    interpolation: { escapeValue: false },
    initAsync: false,
  });
}

export function changeLanguage(language: Language) {
  i18n.changeLanguage(language);
}
