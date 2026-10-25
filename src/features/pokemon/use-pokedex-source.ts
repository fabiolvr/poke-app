import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';

import {
  useGetAllPokemonQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonListInfiniteQuery,
} from './pokemon-api';
import { isDexEntry, matchesQuery, toSummary } from './pokemon-utils';

// Decide de onde vem a lista da Pokédex: páginas da API, todos os nomes (busca) ou um tipo.
export function usePokedexSource(query: string, type: string | null) {
  const isSearching = query.trim() !== '';
  const isFiltered = isSearching || type !== null;

  const pages = useGetPokemonListInfiniteQuery();
  const all = useGetAllPokemonQuery(isSearching && type === null ? undefined : skipToken);
  const byType = useGetPokemonByTypeQuery(type ?? skipToken);
  const active = type !== null ? byType : isSearching ? all : pages;

  // `currentData` é só do argumento atual: ao trocar de tipo, a grade não mostra o tipo anterior
  // enquanto carrega, nem quando o novo falha (ex.: sem internet).
  const data = useMemo(() => {
    if (type !== null) {
      return (byType.currentData ?? []).filter((pokemon) => matchesQuery(pokemon, query));
    }
    if (isSearching) {
      return (all.currentData ?? []).filter((pokemon) => matchesQuery(pokemon, query));
    }
    // A última página traz as primeiras formas alternativas junto com as últimas espécies.
    return (
      pages.currentData?.pages.flatMap((page) => page.results.map(toSummary).filter(isDexEntry)) ??
      []
    );
  }, [type, isSearching, query, byType.currentData, all.currentData, pages.currentData]);
  const hasData = active.currentData !== undefined;

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = pages;
  const loadMore = useCallback(() => {
    if (!isFiltered && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFiltered, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    data,
    isFiltered,
    isLoading: active.isFetching && !hasData,
    // Se a próxima página falha (ex.: sem internet), a grade continua com o que já carregou.
    isError: active.isError && !hasData,
    refetch: active.refetch,
    loadMore,
    isFetchingMore: !isFiltered && isFetchingNextPage,
  };
}
