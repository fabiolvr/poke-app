import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrutalButton } from '@/components/brutal-button';
import { PokemonGrid } from '@/components/pokemon-grid';
import { ScreenMessage } from '@/components/screen-message';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { selectFavorites } from '@/features/favorites/favorites-slice';
import type { PokemonSummary } from '@/features/pokemon/types';
import { useAppSelector } from '@/store/hooks';

type SortOrder = 'number' | 'name';

const SORTERS: Record<SortOrder, (a: PokemonSummary, b: PokemonSummary) => number> = {
  number: (a, b) => a.id - b.id,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function FavoritesScreen() {
  const theme = useBrutalTheme();
  const favorites = useAppSelector(selectFavorites);
  const [order, setOrder] = useState<SortOrder>('number');

  const sorted = useMemo(() => [...favorites].sort(SORTERS[order]), [favorites, order]);

  if (favorites.length === 0) {
    return (
      <ScreenMessage
        tone="empty"
        text="Nenhum favorito ainda. Abra um Pokémon na Pokédex e toque em Favoritar."
        actionLabel="Abrir a Pokédex"
        onAction={() => router.navigate('/')}
      />
    );
  }

  return (
    <PokemonGrid
      data={sorted}
      ListHeaderComponent={
        <View style={styles.sort}>
          <Text style={[styles.sortLabel, { color: theme.text }]}>ORDENAR POR</Text>
          <View style={styles.sortButtons}>
            <BrutalButton
              label="Número"
              selected={order === 'number'}
              color={order === 'number' ? theme.yellow : theme.white}
              onPress={() => setOrder('number')}
            />
            <BrutalButton
              label="Nome"
              selected={order === 'name'}
              color={order === 'name' ? theme.yellow : theme.white}
              onPress={() => setOrder('name')}
            />
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  sort: { gap: 10 },
  sortLabel: { fontFamily: Brutal.font.bold, fontSize: 12, letterSpacing: 1 },
  sortButtons: { flexDirection: 'row', gap: 12 },
});
