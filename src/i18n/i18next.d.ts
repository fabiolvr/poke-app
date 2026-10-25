import 'i18next';

import type { Translations } from './pt';

// Chaves de tradução tipadas: `t('pokedex.search')` é conferido pelo TypeScript.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: Translations };
  }
}
