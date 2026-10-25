import { ListItem, RNHostView, Text } from '@expo/ui';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { selectIsFavorite } from '@/features/favorites/favorites-slice';
import { capitalize, formatDexNumber } from '@/features/pokemon/pokemon-utils';
import type { PokemonSummary } from '@/features/pokemon/types';
import { useAppSelector } from '@/store/hooks';

type Props = {
  pokemon: PokemonSummary;
};

export function PokemonRow({ pokemon }: Props) {
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, pokemon.name));

  return (
    <ListItem
      onPress={() => router.push({ pathname: '/pokemon/[name]', params: { name: pokemon.name } })}
      leading={
        // RNHostView embute uma view React Native (expo-image) dentro da árvore nativa.
        <RNHostView matchContents>
          <Image source={pokemon.imageUrl} style={styles.sprite} contentFit="contain" />
        </RNHostView>
      }
      supportingText={formatDexNumber(pokemon.id)}
      trailing={isFavorite ? <Text textStyle={{ color: '#E3350D' }}>♥</Text> : undefined}>
      <Text textStyle={{ fontWeight: '600' }}>{capitalize(pokemon.name)}</Text>
    </ListItem>
  );
}

const styles = StyleSheet.create({
  sprite: { width: 48, height: 48 },
});
