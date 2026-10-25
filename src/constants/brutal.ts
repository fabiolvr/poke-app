import { useColorScheme } from '@/hooks/use-color-scheme';

// Medidas fixas do estilo: borda grossa, canto quase reto, sombra dura sem desfoque.
export const Brutal = {
  border: 3,
  radius: 6,
  shadow: 4,
  gap: 16,
  // Espaço livre no fim das listas para a barra de abas flutuante.
  tabBarSpace: 104,
  font: {
    display: 'ArchivoBlack_400Regular',
    body: 'SpaceGrotesk_500Medium',
    bold: 'SpaceGrotesk_700Bold',
  },
} as const;

// Cores chapadas iguais nos dois temas; o texto sobre elas é sempre preto.
const accents = {
  yellow: '#FFD23F',
  pink: '#FF6B9D',
  blue: '#4D96FF',
  green: '#3DDC97',
  red: '#FF5A5F',
  white: '#FFFFFF',
  textOnColor: '#111111',
};

export const BrutalThemes = {
  light: { ...accents, paper: '#FFF6E0', surface: '#FFFFFF', line: '#111111', text: '#111111' },
  dark: { ...accents, paper: '#141414', surface: '#232323', line: '#F2EBDD', text: '#F2EBDD' },
};

export type BrutalTheme = (typeof BrutalThemes)['light'];

export function useBrutalTheme(): BrutalTheme {
  return BrutalThemes[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
