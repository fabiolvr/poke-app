import { Host, List, ListItem, Picker, Text } from '@expo/ui';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { PokemonRow } from '@/components/pokemon-row';
import { ScreenMessage } from '@/components/screen-message';
import { selectFavorites } from '@/features/favorites/favorites-slice';
import type { PokemonSummary } from '@/features/pokemon/types';
import { useAppSelector } from '@/store/hooks';

type SortOrder = 'number' | 'name';

const SORTERS: Record<SortOrder, (a: PokemonSummary, b: PokemonSummary) => number> = {
  number: (a, b) => a.id - b.id,
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function FavoritesScreen() {
  const favorites = useAppSelector(selectFavorites);
  const [order, setOrder] = useState<SortOrder>('number');

  const sorted = useMemo(() => [...favorites].sort(SORTERS[order]), [favorites, order]);

  const renderRow = useCallback(
    ({ item }: { item: PokemonSummary }) => <PokemonRow pokemon={item} />,
    [],
  );

  if (favorites.length === 0) {
    return (
      <ScreenMessage text="Nenhum favorito ainda. Abra um Pokémon na Pokédex e toque em Favoritar." />
    );
  }

  return (
    <Host style={styles.host}>
      <List>
        <ListItem
          trailing={
            <Picker selectedValue={order} onValueChange={(value) => setOrder(value as SortOrder)}>
              <Picker.Item label="Número" value="number" />
              <Picker.Item label="Nome" value="name" />
            </Picker>
          }>
          <Text>Ordenar por</Text>
        </ListItem>
        <List.ForEach data={sorted} keyExtractor={(pokemon) => pokemon.name}>
          {renderRow}
        </List.ForEach>
      </List>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1 },
});
