import { Stack } from 'expo-router';

import { HeaderLogoTitle } from '@/components/header-logo-title';
import { useBrutalHeaderOptions } from '@/hooks/use-brutal-header-options';

export default function PokedexLayout() {
  const headerOptions = useBrutalHeaderOptions();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: 'POKÉDEX',
          headerTitle: ({ children }) => <HeaderLogoTitle title={children} />,
        }}
      />
    </Stack>
  );
}
