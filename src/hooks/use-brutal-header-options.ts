import type { NativeStackNavigationOptions } from 'expo-router';

import { Brutal, useBrutalTheme } from '@/constants/brutal';

// Cabeçalho amarelo, sem a sombra do sistema, com título em Archivo Black.
export function useBrutalHeaderOptions(): NativeStackNavigationOptions {
  const theme = useBrutalTheme();

  return {
    headerStyle: { backgroundColor: theme.yellow },
    headerShadowVisible: false,
    headerTintColor: theme.textOnColor,
    headerTitleStyle: { fontFamily: Brutal.font.display, color: theme.textOnColor },
    headerBackButtonDisplayMode: 'minimal',
    contentStyle: { backgroundColor: theme.paper },
  };
}
