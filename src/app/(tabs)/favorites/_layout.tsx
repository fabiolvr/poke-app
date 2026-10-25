import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { SettingsButton } from '@/components/settings-button';
import { useBrutalHeaderOptions } from '@/hooks/use-brutal-header-options';

export default function FavoritesLayout() {
  const headerOptions = useBrutalHeaderOptions();
  const { t } = useTranslation();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen
        name="index"
        options={{ title: t('headers.favorites'), headerRight: () => <SettingsButton /> }}
      />
    </Stack>
  );
}
