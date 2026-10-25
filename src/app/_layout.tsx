import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import {
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
  useFonts,
} from '@expo-google-fonts/space-grotesk';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';

import { SplashOverlay } from '@/components/splash-overlay';
import { useBrutalTheme } from '@/constants/brutal';
import { useBrutalHeaderOptions } from '@/hooks/use-brutal-header-options';
import { store } from '@/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const brutal = useBrutalTheme();
  const headerOptions = useBrutalHeaderOptions();
  const [fontsLoaded] = useFonts({
    ArchivoBlack_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return null; // a splash nativa continua na tela
  }

  // O fundo do navegador usa o papel do tema para a transição entre telas não piscar.
  const baseTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: { ...baseTheme.colors, background: brutal.paper, card: brutal.yellow },
  };

  return (
    <Provider store={store}>
      <ThemeProvider value={navigationTheme}>
        <SplashOverlay />
        <Stack screenOptions={headerOptions}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pokemon/[name]" options={{ title: '' }} />
          <Stack.Screen name="compare" options={{ title: 'COMPARAR' }} />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
