import { useCallback } from 'react';
import { FlatList, StyleSheet, useWindowDimensions, type FlatListProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PokemonCard } from '@/components/pokemon-card';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import type { PokemonSummary } from '@/features/pokemon/types';

type Props = Pick<
  FlatListProps<PokemonSummary>,
  'onEndReached' | 'refreshControl' | 'ListHeaderComponent' | 'ListFooterComponent'
> & {
  data: PokemonSummary[];
};

const COLUMNS = 2;

// Grade de duas colunas usada pela Pokédex e pelos favoritos.
export function PokemonGrid({ data, ...listProps }: Props) {
  const theme = useBrutalTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - Brutal.gap * (COLUMNS + 1)) / COLUMNS;

  const renderItem = useCallback(
    ({ item }: { item: PokemonSummary }) => <PokemonCard pokemon={item} width={cardWidth} />,
    [cardWidth],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(pokemon) => pokemon.name}
      numColumns={COLUMNS}
      style={[styles.list, { backgroundColor: theme.paper, borderTopColor: theme.line }]}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Brutal.tabBarSpace + insets.bottom },
      ]}
      onEndReachedThreshold={0.5}
      {...listProps}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, borderTopWidth: Brutal.border },
  row: { gap: Brutal.gap },
  content: { padding: Brutal.gap, paddingTop: Brutal.gap + 12, gap: Brutal.gap + 12 },
});
