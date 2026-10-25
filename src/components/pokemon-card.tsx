import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Sticker } from '@/components/sticker';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { selectIsFavorite } from '@/features/favorites/favorites-slice';
import { capitalize, formatDexNumber } from '@/features/pokemon/pokemon-utils';
import type { PokemonSummary } from '@/features/pokemon/types';
import { useAppSelector } from '@/store/hooks';

// A lista da API não traz o tipo, então a cor do card gira pela paleta.
const CARD_COLORS = ['yellow', 'pink', 'blue', 'green', 'red'] as const;

type Props = {
  pokemon: PokemonSummary;
  width: number;
};

export function PokemonCard({ pokemon, width }: Props) {
  const theme = useBrutalTheme();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, pokemon.name));
  const color = theme[CARD_COLORS[pokemon.id % CARD_COLORS.length]];
  const name = capitalize(pokemon.name);

  return (
    <Pressable
      style={{ width }}
      accessibilityRole="button"
      accessibilityLabel={`${name}, número ${pokemon.id}${isFavorite ? ', favorito' : ''}`}
      onPress={() => router.push({ pathname: '/pokemon/[name]', params: { name: pokemon.name } })}>
      {({ pressed }) => (
        <BrutalBox color={color} pressed={pressed} style={styles.card}>
          <Image source={pokemon.imageUrl} style={styles.artwork} contentFit="contain" />
          <Text style={[styles.name, { color: theme.textOnColor }]} numberOfLines={1}>
            {name.toUpperCase()}
          </Text>
          <Sticker label={formatDexNumber(pokemon.id)} color={theme.white} style={styles.number} />
          {isFavorite ? (
            // ︎ pede o glifo de texto; sem ele o iOS desenha o emoji vermelho.
            <Sticker label={'♥︎'} color={theme.pink} tilt={6} style={styles.favorite} />
          ) : null}
        </BrutalBox>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 10, gap: 6 },
  artwork: { width: '100%', aspectRatio: 1 },
  name: { fontFamily: Brutal.font.display, fontSize: 15 },
  number: { position: 'absolute', top: -12, right: 8 },
  favorite: { position: 'absolute', top: -12, left: 8 },
});
