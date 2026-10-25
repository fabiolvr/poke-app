import { selectLanguageSetting } from '@/features/settings/settings-slice';
import { deviceLanguage, resolveLanguage, type Language } from '@/i18n/language';
import { useAppSelector } from '@/store/hooks';

// Idioma em uso, para os nomes vindos da PokéAPI (tipos, itens, status). Os textos da
// interface usam o `t` do react-i18next.
export function useLanguage(): Language {
  return resolveLanguage(useAppSelector(selectLanguageSetting), deviceLanguage());
}
