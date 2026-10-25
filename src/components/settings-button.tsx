import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';

import { useBrutalTheme } from '@/constants/brutal';

// Engrenagem no canto do cabeçalho da Pokédex e dos Favoritos.
export function SettingsButton() {
  const theme = useBrutalTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('common.settings')}
      hitSlop={12}
      onPress={() => router.push('/settings')}>
      <SymbolView
        name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
        size={24}
        tintColor={theme.textOnColor}
      />
    </Pressable>
  );
}
