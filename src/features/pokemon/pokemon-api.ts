import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { flattenChain, isDexEntry, toSummary } from './pokemon-utils';
import type {
  EvolutionChain,
  EvolutionStep,
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  PokemonSummary,
  TypeResponse,
} from './types';

const PAGE_SIZE = 30;
const ONE_HOUR = 60 * 60;

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
    // Todos os nomes de uma vez (cerca de 90 KB), para a busca filtrar no aparelho.
    getAllPokemon: build.query<PokemonSummary[], void>({
      query: () => 'pokemon?limit=100000',
      transformResponse: (response: PokemonListResponse) =>
        response.results.map(toSummary).filter(isDexEntry),
      keepUnusedDataFor: ONE_HOUR,
    }),
    getPokemonByType: build.query<PokemonSummary[], string>({
      query: (type) => `type/${type}`,
      transformResponse: (response: TypeResponse) =>
        response.pokemon
          .map((entry) => toSummary(entry.pokemon))
          .filter(isDexEntry)
          .sort((a, b) => a.id - b.id),
    }),
    getPokemon: build.query<Pokemon, string>({
      query: (name) => `pokemon/${name}`,
    }),
    getPokemonSpecies: build.query<PokemonSpecies, string>({
      query: (name) => `pokemon-species/${name}`,
    }),
    getEvolutionChain: build.query<EvolutionStep[][], number>({
      query: (id) => `evolution-chain/${id}`,
      transformResponse: (response: EvolutionChain) => flattenChain(response.chain),
    }),
  }),
});

export const {
  useGetPokemonListInfiniteQuery,
  useGetAllPokemonQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonQuery,
  useGetPokemonSpeciesQuery,
  useGetEvolutionChainQuery,
} = pokemonApi;
