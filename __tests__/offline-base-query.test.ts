import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { offlineBaseQuery } from '@/features/pokemon/offline-base-query';

// Banco do aparelho trocado por um Map em memória.
const mockStore = new Map<string, string>();
jest.mock('expo-sqlite/kv-store', () => ({
  __esModule: true,
  default: {
    getItem: async (key: string) => mockStore.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      mockStore.set(key, value);
    },
  },
}));

const fetchMock = jest.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>();
globalThis.fetch = fetchMock as typeof fetch;

function api(endpoint: string) {
  return { endpoint, signal: new AbortController().signal } as BaseQueryApi;
}

// A gravação no banco roda em segundo plano; espera ela terminar.
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

const baseQuery = offlineBaseQuery({
  baseUrl: 'https://pokeapi.co/api/v2/',
  slim: { getPokemon: (data) => ({ name: (data as { name: string }).name }) },
});

describe('offlineBaseQuery', () => {
  // O tempo limite de cada requisição é um setTimeout que o RTK não cancela; com relógio falso,
  // ele não segura o Jest aberto depois dos testes.
  beforeAll(() => {
    jest.useFakeTimers({ doNotFake: ['setImmediate', 'nextTick', 'queueMicrotask'] });
  });
  afterAll(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockStore.clear();
    fetchMock.mockReset();
  });

  it('guarda a resposta reduzida e devolve a cópia quando a rede cai', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({ name: 'pikachu', moves: ['thunderbolt'] }));
    const online = await baseQuery('pokemon/pikachu', api('getPokemon'), {});
    expect(online.data).toEqual({ name: 'pikachu' });
    await flush();

    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    const offline = await baseQuery('pokemon/pikachu', api('getPokemon'), {});
    expect(offline).toEqual({ data: { name: 'pikachu' } });
  });

  it('sem rede e sem cópia, devolve o erro', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    const result = await baseQuery('pokemon/mew', api('getPokemon'), {});
    expect(result.error?.status).toBe('FETCH_ERROR');
  });

  it('resposta de erro da API (404) não usa a cópia', async () => {
    mockStore.set('pokeapi:pokemon/nada', JSON.stringify({ name: 'velho' }));
    fetchMock.mockResolvedValueOnce(Response.json({ detail: 'Not found' }, { status: 404 }));
    const result = await baseQuery('pokemon/nada', api('getPokemon'), {});
    expect(result).toMatchObject({ error: { status: 404 } });
    expect(result.data).toBeUndefined();
  });
});
