import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { PokemonImage } from '@/components/pokemon-image';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { artworkUrl, formLabel, idFromUrl } from '@/features/pokemon/pokemon-utils';
import type { PokemonSpecies } from '@/features/pokemon/types';

const COLUMNS = 3;
const CARD_GAP = 12;

type Props = {
  species: PokemonSpecies;
  currentName: string;
};

// Outras variedades da mesma espécie: megas, formas regionais, Gigantamax…
export function PokemonForms({ species, currentName }: Props) {
  const theme = useBrutalTheme();
  const { width } = useWindowDimensions();
  const others = species.varieties.filter((variety) => variety.pokemon.name !== currentName);

  if (others.length === 0) {
    return null;
  }

  // Arredonda para baixo: no Android a soma das larguras fracionárias passava do espaço e o
  // último card da linha descia para a linha seguinte.
  const cardWidth = Math.floor((width - Brutal.gap * 2 - CARD_GAP * (COLUMNS - 1)) / COLUMNS);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>FORMAS</Text>
      <View style={styles.row}>
        {others.map(({ pokemon }) => {
          const label = formLabel(pokemon.name, species.name);
          return (
            <Pressable
              key={pokemon.name}
              style={{ width: cardWidth }}
              accessibilityRole="button"
              accessibilityLabel={`Forma ${label}`}
              onPress={() =>
                router.push({ pathname: '/pokemon/[name]', params: { name: pokemon.name } })
              }>
              {({ pressed }) => (
                <BrutalBox pressed={pressed} style={styles.card}>
                  <PokemonImage uri={artworkUrl(idFromUrl(pokemon.url))} style={styles.image} />
                  <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
                    {label.toUpperCase()}
                  </Text>
                </BrutalBox>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontFamily: Brutal.font.display, fontSize: 18, marginTop: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  card: { padding: 8, alignItems: 'center', gap: 4 },
  image: { width: '100%', aspectRatio: 1 },
  name: { fontFamily: Brutal.font.display, fontSize: 11, textAlign: 'center' },
});
