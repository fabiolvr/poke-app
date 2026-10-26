import type { Language } from '@/i18n/language';

import { slimMoves } from './moves';
import { itemName, triggerName, word } from './translations';
import type {
  ChainLink,
  EvolutionDetail,
  EvolutionStep,
  NamedResource,
  Pokemon,
  PokemonSpecies,
  PokemonSummary,
} from './types';

// Megas, formas regionais e afins têm id acima de 10000 e ficam fora da Pokédex.
const FIRST_ALTERNATE_FORM_ID = 10000;

const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// A versão shiny fica numa pasta ao lado, com o mesmo nome de arquivo.
export function artworkUrl(id: number, shiny = false) {
  return `${ARTWORK_URL}${shiny ? '/shiny' : ''}/${id}.png`;
}

// Gritos em MP3 do Pokémon Showdown: os da PokéAPI são .ogg (Vorbis), que o iOS não toca.
const CRY_URL = 'https://play.pokemonshowdown.com/audio/cries';

// O Showdown nomeia pelo nome sem hífen nem pontuação ("mr-mime" → "mrmime") e as formas com
// um hífen só ("charizard-mega-x" → "charizard-megax"). Formas sem grito próprio, como as
// regionais, usam o da espécie: a lista vem em ordem de preferência.
export function cryUrls(pokemon: Pick<Pokemon, 'id' | 'name' | 'species'>) {
  const id = (slug: string) => slug.replace(/[^a-z0-9]/g, '');
  const species = pokemon.species.name;
  const url = (name: string) => `${CRY_URL}/${name}.mp3`;
  if (isDexEntry(pokemon) || !pokemon.name.startsWith(`${species}-`)) {
    return [url(id(species))];
  }
  const form = pokemon.name.slice(species.length + 1);
  return [url(`${id(species)}-${id(form)}`), url(id(species))];
}

// A URL termina com o id: https://pokeapi.co/api/v2/pokemon/25/
export function idFromUrl(url: string) {
  return Number(url.split('/').filter(Boolean).pop());
}

export function toSummary(resource: NamedResource): PokemonSummary {
  const id = idFromUrl(resource.url);
  return { id, name: resource.name, imageUrl: artworkUrl(id) };
}

export function isDexEntry(pokemon: Pick<PokemonSummary, 'id'>) {
  return pokemon.id < FIRST_ALTERNATE_FORM_ID;
}

// Palavras dos nomes de forma que pedem mais que só a inicial maiúscula.
const FORM_WORDS: Record<string, string> = {
  gmax: 'Gigantamax',
};

function formatWords(slug: string) {
  return slug
    .split('-')
    .map((word) => FORM_WORDS[word] ?? capitalize(word))
    .join(' ');
}

// Espécies mantêm o nome da API ("Ho-oh"); formas ficam legíveis ("Charizard Mega X").
export function formatName(pokemon: Pick<PokemonSummary, 'id' | 'name'>) {
  return isDexEntry(pokemon) ? capitalize(pokemon.name) : formatWords(pokemon.name);
}

// Número da Pokédex para espécies; formas não têm número próprio.
export function dexLabel(pokemon: Pick<PokemonSummary, 'id'>, language: Language) {
  return isDexEntry(pokemon) ? formatDexNumber(pokemon.id) : word('form', language);
}

// Rótulo curto de uma variedade dentro da espécie: "charizard-mega-x" → "Mega X".
export function formLabel(varietyName: string, speciesName: string, language: Language) {
  if (varietyName === speciesName) {
    return word('defaultForm', language);
  }
  const prefix = `${speciesName}-`;
  return formatWords(
    varietyName.startsWith(prefix) ? varietyName.slice(prefix.length) : varietyName,
  );
}

// Só dígitos (com ou sem "#" e zeros à esquerda, como "#0025") buscam o número exato.
const DEX_NUMBER_QUERY = /^#?\d+$/;

// Só os Pokémon que estão em todas as listas, na ordem da primeira (ex.: Fogo e Voador).
export function intersectById(lists: PokemonSummary[][]) {
  const [first = [], ...rest] = lists;
  const others = rest.map((list) => new Set(list.map((pokemon) => pokemon.id)));
  return first.filter((pokemon) => others.every((ids) => ids.has(pokemon.id)));
}

// Os nomes da API são minúsculos e usam hífen no lugar de espaço ("mr-mime").
export function matchesQuery(pokemon: PokemonSummary, query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, '-');
  if (DEX_NUMBER_QUERY.test(normalized)) {
    return pokemon.id === Number(normalized.replace('#', ''));
  }
  return normalized === '' || pokemon.name.includes(normalized);
}

export function describeEvolution(detail: EvolutionDetail | undefined, language: Language) {
  if (!detail) {
    return '';
  }
  if (detail.min_level) {
    return `${word('level', language)} ${detail.min_level}`;
  }
  if (detail.item) {
    return itemName(detail.item.name, language);
  }
  if (detail.trigger.name === 'trade') {
    return word('trade', language);
  }
  if (detail.min_happiness) {
    return word('friendship', language);
  }
  return triggerName(detail.trigger.name, language);
}

// Achata a árvore da API em estágios: [[Eevee], [Vaporeon, Jolteon, …]].
export function flattenChain(root: ChainLink): EvolutionStep[][] {
  const stages: EvolutionStep[][] = [];
  const visit = (link: ChainLink, depth: number) => {
    stages[depth] ??= [];
    stages[depth].push({
      pokemon: toSummary(link.species),
      detail: link.evolution_details[0],
    });
    link.evolves_to.forEach((next) => visit(next, depth + 1));
  };
  visit(root, 0);
  return stages;
}

export function formatDexNumber(id: number) {
  return `#${String(id).padStart(4, '0')}`;
}

export function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatHeight(decimeters: number) {
  return `${(decimeters / 10).toFixed(1)} m`;
}

export function formatWeight(hectograms: number) {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

// A PokéAPI não traz textos em português; usamos inglês.
const TEXT_LANGUAGE = 'en';

export function pickFlavorText(species: PokemonSpecies, language = TEXT_LANGUAGE) {
  const entry = species.flavor_text_entries.find((item) => item.language.name === language);
  // Os textos antigos escrevem "POKéMON" em caixa alta.
  return entry?.flavor_text.replace(/[\n\f]/g, ' ').replace(/POKéMON/g, 'Pokémon') ?? '';
}

export function pickGenus(species: PokemonSpecies, language = TEXT_LANGUAGE) {
  return species.genera.find((item) => item.language.name === language)?.genus ?? '';
}

// Só os campos que o app usa: a resposta completa de um Pokémon passa de 200 KB por causa
// da lista de golpes, e ela fica guardada no aparelho para o modo sem internet. Dos golpes,
// fica só o jogo mostrado na tela.
export function slimPokemon({
  id,
  name,
  height,
  weight,
  species,
  types,
  stats,
  abilities,
  moves,
}: Pokemon): Pokemon {
  return { id, name, height, weight, species, types, stats, abilities, moves: slimMoves(moves) };
}

// Mantém só os textos no idioma exibido; a API manda cada um em uma dezena de idiomas.
export function slimSpecies({
  name,
  genera,
  flavor_text_entries,
  evolution_chain,
  varieties,
}: PokemonSpecies): PokemonSpecies {
  const inLanguage = ({ language }: { language: NamedResource }) => language.name === TEXT_LANGUAGE;
  return {
    name,
    genera: genera.filter(inLanguage),
    flavor_text_entries: flavor_text_entries.filter(inLanguage),
    evolution_chain,
    varieties,
  };
}
