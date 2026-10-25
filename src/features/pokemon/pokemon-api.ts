import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Pokemon, PokemonListResponse, PokemonSpecies } from './types';

const PAGE_SIZE = 30;

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (build) => ({
    // Paginação por offset: cada página pede mais 30 Pokémon.
    getPokemonList: build.infiniteQuery<PokemonListResponse, void, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPage.next ? lastPageParam + PAGE_SIZE : undefined,
      },
      query: ({ pageParam }) => `pokemon?limit=${PAGE_SIZE}&offset=${pageParam}`,
    }),
    getPokemon: build.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonSpecies: build.query<PokemonSpecies, string>({
      query: (name) => `pokemon-species/${name}`,
    }),
  }),
});

export const { useGetPokemonListInfiniteQuery, useGetPokemonQuery, useGetPokemonSpeciesQuery } =
  pokemonApi;
