import { createApi } from '@reduxjs/toolkit/query/react';

import { offlineBaseQuery } from './offline-base-query';
import { flattenChain, isDexEntry, slimPokemon, slimSpecies, toSummary } from './pokemon-utils';
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
  // Guarda cada resposta no aparelho e usa a cópia quando não há internet.
  baseQuery: offlineBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/',
    slim: {
      getPokemon: (data) => slimPokemon(data as Pokemon),
      getPokemonSpecies: (data) => slimSpecies(data as PokemonSpecies),
    },
  }),
  endpoints: (build) => ({
    // Paginação por offset: cada página pede mais 30 Pokémon. A API lista primeiro as espécies
    // (1 a 1025) e depois as formas alternativas; a grade para na página em que elas começam.
    getPokemonList: build.infiniteQuery<PokemonListResponse, void, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
          const reachedForms = lastPage.results.some((entry) => !isDexEntry(toSummary(entry)));
          return lastPage.next && !reachedForms ? lastPageParam + PAGE_SIZE : undefined;
        },
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
