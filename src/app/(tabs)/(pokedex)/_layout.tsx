import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { HeaderLogoTitle } from '@/components/header-logo-title';
import { SettingsButton } from '@/components/settings-button';
import { useBrutalHeaderOptions } from '@/hooks/use-brutal-header-options';

export default function PokedexLayout() {
  const headerOptions = useBrutalHeaderOptions();
  const { t } = useTranslation();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: t('headers.pokedex'),
          headerTitle: ({ children }) => <HeaderLogoTitle title={children} />,
          headerRight: () => <SettingsButton />,
        }}
      />
    </Stack>
  );
}
