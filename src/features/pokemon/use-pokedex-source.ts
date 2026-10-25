import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';

import {
  useGetAllPokemonQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonListInfiniteQuery,
} from './pokemon-api';
import { matchesQuery, toSummary } from './pokemon-utils';

// Decide de onde vem a lista da Pokédex: páginas da API, todos os nomes (busca) ou um tipo.
export function usePokedexSource(query: string, type: string | null) {
  const isSearching = query.trim() !== '';
  const isFiltered = isSearching || type !== null;

  const pages = useGetPokemonListInfiniteQuery();
  const all = useGetAllPokemonQuery(isSearching && type === null ? undefined : skipToken);
  const byType = useGetPokemonByTypeQuery(type ?? skipToken);
  const active = type !== null ? byType : isSearching ? all : pages;

  const data = useMemo(() => {
    if (type !== null) {
      return (byType.data ?? []).filter((pokemon) => matchesQuery(pokemon, query));
    }
    if (isSearching) {
      return (all.data ?? []).filter((pokemon) => matchesQuery(pokemon, query));
    }
    return pages.data?.pages.flatMap((page) => page.results.map(toSummary)) ?? [];
  }, [type, isSearching, query, byType.data, all.data, pages.data]);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = pages;
  const loadMore = useCallback(() => {
    if (!isFiltered && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFiltered, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    data,
    isFiltered,
    isLoading: active.isLoading,
    isError: active.isError,
    refetch: active.refetch,
    loadMore,
    isFetchingMore: !isFiltered && isFetchingNextPage,
  };
}
