import { Host, List, ListItem, Text } from '@expo/ui';
import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { PokemonRow } from '@/components/pokemon-row';
import { ScreenMessage } from '@/components/screen-message';
import { useGetPokemonListInfiniteQuery } from '@/features/pokemon/pokemon-api';
import { toSummary } from '@/features/pokemon/pokemon-utils';
import type { PokemonSummary } from '@/features/pokemon/types';

export default function PokedexScreen() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPokemonListInfiniteQuery();

  const pokemons = useMemo(
    () => data?.pages.flatMap((page) => page.results.map(toSummary)) ?? [],
    [data],
  );

  const renderRow = useCallback(
    ({ item }: { item: PokemonSummary }) => <PokemonRow pokemon={item} />,
    [],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) {
    return <ScreenMessage text="Carregando a Pokédex…" />;
  }

  if (isError) {
    return (
      <ScreenMessage
        text="Não foi possível carregar a Pokédex. Confira sua conexão."
        actionLabel="Tentar de novo"
        onAction={refetch}
      />
    );
  }

  return (
    <Host style={styles.host}>
      <List onRefresh={handleRefresh}>
        <List.ForEach data={pokemons} keyExtractor={(pokemon) => pokemon.name}>
          {renderRow}
        </List.ForEach>
        {hasNextPage ? (
          <ListItem>
            {/* Quando esta linha aparece na tela, buscamos a próxima página. */}
            <Text onAppear={loadMore}>{isFetchingNextPage ? 'Carregando mais…' : ' '}</Text>
          </ListItem>
        ) : null}
      </List>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1 },
});
