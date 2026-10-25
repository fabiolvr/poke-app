import Storage from 'expo-sqlite/kv-store';

// Respostas da PokéAPI guardadas no aparelho, uma por URL, para abrir o app sem internet.
// Fica no mesmo banco dos favoritos, com prefixo próprio na chave.
const KEY_PREFIX = 'pokeapi:';

export async function readCachedResponse(url: string): Promise<unknown> {
  try {
    const raw = await Storage.getItem(KEY_PREFIX + url);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export async function writeCachedResponse(url: string, data: unknown) {
  try {
    await Storage.setItem(KEY_PREFIX + url, JSON.stringify(data));
  } catch {
    // Sem espaço ou banco ocupado: o app segue normal, só não fica salvo para depois.
  }
}
