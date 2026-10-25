import { Stack } from 'expo-router';

import { useBrutalHeaderOptions } from '@/hooks/use-brutal-header-options';

export default function FavoritesLayout() {
  const headerOptions = useBrutalHeaderOptions();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: 'FAVORITOS' }} />
    </Stack>
  );
}
