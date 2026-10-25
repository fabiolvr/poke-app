import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';

import { PokemonGrid } from '@/components/pokemon-grid';
import { ScreenMessage } from '@/components/screen-message';
import { useBrutalTheme } from '@/constants/brutal';
import { useGetPokemonListInfiniteQuery } from '@/features/pokemon/pokemon-api';
import { toSummary } from '@/features/pokemon/pokemon-utils';

export default function PokedexScreen() {
  const theme = useBrutalTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetPokemonListInfiniteQuery();

  const pokemons = useMemo(
    () => data?.pages.flatMap((page) => page.results.map(toSummary)) ?? [],
    [data],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  if (isLoading) {
    return <ScreenMessage text="Carregando a Pokédex…" />;
  }

  if (isError) {
    return (
      <ScreenMessage
        tone="error"
        text="Não foi possível carregar a Pokédex. Confira sua conexão."
        actionLabel="Tentar de novo"
        onAction={refetch}
      />
    );
  }

  return (
    <PokemonGrid
      data={pokemons}
      onEndReached={loadMore}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.line}
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color={theme.line} style={styles.footer} />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  footer: { paddingVertical: 16 },
});
