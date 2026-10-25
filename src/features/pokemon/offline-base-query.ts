import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { readCachedResponse, writeCachedResponse } from './response-cache';

type Options = {
  baseUrl: string;
  // Por endpoint: reduz a resposta antes de guardar (o /pokemon traz centenas de golpes que o app não usa).
  slim?: Record<string, (data: unknown) => unknown>;
};

const REQUEST_TIMEOUT_MS = 10_000;

// Sem rede, a requisição falha com FETCH_ERROR (ou estoura o tempo em rede ruim).
const OFFLINE_ERRORS: FetchBaseQueryError['status'][] = ['FETCH_ERROR', 'TIMEOUT_ERROR'];

// Rede primeiro: cada resposta boa é guardada no aparelho; sem rede, devolve a última guardada.
export function offlineBaseQuery({
  baseUrl,
  slim = {},
}: Options): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  const rawBaseQuery = fetchBaseQuery({ baseUrl, timeout: REQUEST_TIMEOUT_MS });

  return async (args, api, extraOptions) => {
    const url = typeof args === 'string' ? args : args.url;
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
      if (!OFFLINE_ERRORS.includes(result.error.status)) {
        return result;
      }
      const cached = await readCachedResponse(url);
      return cached === undefined ? result : { data: cached };
    }

    const data = slim[api.endpoint]?.(result.data) ?? result.data;
    // Grava em segundo plano para não atrasar a tela; uma falha aqui não afeta a resposta.
    void writeCachedResponse(url, data);
    return { ...result, data };
  };
}
