import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useMemo } from 'react';

import { inGeneration } from './generations';
import {
  useGetAllPokemonQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonListInfiniteQuery,
} from './pokemon-api';
import { intersectById, isDexEntry, matchesQuery, toSummary } from './pokemon-utils';
import type { PokemonSummary } from './types';

export type PokedexFilters = {
  // Até dois tipos: com dois, só os Pokémon que têm os dois (Fogo e Voador).
  types: string[];
  generation: number | null;
};

// Decide de onde vem a lista da Pokédex: páginas da API, todos os nomes (busca ou geração) ou
// os tipos escolhidos.
export function usePokedexSource(query: string, { types, generation }: PokedexFilters) {
  const isSearching = query.trim() !== '';
  const hasTypes = types.length > 0;
  const isFiltered = isSearching || hasTypes || generation !== null;
  const [firstType, secondType] = types;

  const pages = useGetPokemonListInfiniteQuery();
  const all = useGetAllPokemonQuery(isFiltered && !hasTypes ? undefined : skipToken);
  const byFirstType = useGetPokemonByTypeQuery(firstType ?? skipToken);
  const bySecondType = useGetPokemonByTypeQuery(secondType ?? skipToken);
  const active = hasTypes
    ? [byFirstType, ...(secondType ? [bySecondType] : [])]
    : [isFiltered ? all : pages];

  // `currentData` é só do argumento atual: ao trocar de tipo, a grade não mostra o tipo anterior
  // enquanto carrega, nem quando o novo falha (ex.: sem internet).
  const data = useMemo(() => {
    const matches = (pokemon: PokemonSummary) =>
      inGeneration(pokemon, generation) && matchesQuery(pokemon, query);
    if (hasTypes) {
      const lists = [byFirstType.currentData ?? []];
      if (secondType) {
        lists.push(bySecondType.currentData ?? []);
      }
      return intersectById(lists).filter(matches);
    }
    if (isFiltered) {
      return (all.currentData ?? []).filter(matches);
    }
    // A última página traz as primeiras formas alternativas junto com as últimas espécies.
    return (
      pages.currentData?.pages.flatMap((page) => page.results.map(toSummary).filter(isDexEntry)) ??
      []
    );
  }, [
    hasTypes,
    isFiltered,
    secondType,
    generation,
    query,
    byFirstType.currentData,
    bySecondType.currentData,
    all.currentData,
    pages.currentData,
  ]);
  const hasData = active.every((source) => source.currentData !== undefined);

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = pages;
  const loadMore = useCallback(() => {
    if (!isFiltered && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFiltered, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const refetch = () => Promise.all(active.map((source) => source.refetch()));

  return {
    data,
    isFiltered,
    isLoading: active.some((source) => source.isFetching) && !hasData,
    // Se a próxima página falha (ex.: sem internet), a grade continua com o que já carregou.
    isError: active.some((source) => source.isError) && !hasData,
    refetch,
    loadMore,
    isFetchingMore: !isFiltered && isFetchingNextPage,
  };
}
