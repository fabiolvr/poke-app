import type {
  ChainLink,
  EvolutionDetail,
  EvolutionStep,
  NamedResource,
  PokemonSpecies,
  PokemonSummary,
} from './types';

// Megas, formas regionais e afins têm id acima de 10000 e ficam fora da Pokédex.
const FIRST_ALTERNATE_FORM_ID = 10000;

const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque Esp.',
  'special-defense': 'Defesa Esp.',
  speed: 'Velocidade',
};

export function artworkUrl(id: number) {
  return `${ARTWORK_URL}/${id}.png`;
}

// A URL termina com o id: https://pokeapi.co/api/v2/pokemon/25/
export function idFromUrl(url: string) {
  return Number(url.split('/').filter(Boolean).pop());
}

export function toSummary(resource: NamedResource): PokemonSummary {
  const id = idFromUrl(resource.url);
  return { id, name: resource.name, imageUrl: artworkUrl(id) };
}

export function isDexEntry(pokemon: PokemonSummary) {
  return pokemon.id < FIRST_ALTERNATE_FORM_ID;
}

// Os nomes da API são minúsculos e usam hífen no lugar de espaço ("mr-mime").
export function matchesQuery(pokemon: PokemonSummary, query: string) {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, '-');
  return normalized === '' || pokemon.name.includes(normalized);
}

export function describeEvolution(detail: EvolutionDetail | undefined) {
  if (!detail) {
    return '';
  }
  if (detail.min_level) {
    return `Nv. ${detail.min_level}`;
  }
  if (detail.item) {
    return capitalize(detail.item.name.replace(/-/g, ' '));
  }
  if (detail.trigger.name === 'trade') {
    return 'Troca';
  }
  if (detail.min_happiness) {
    return 'Amizade';
  }
  return capitalize(detail.trigger.name.replace(/-/g, ' '));
}

// Achata a árvore da API em estágios: [[Eevee], [Vaporeon, Jolteon, …]].
export function flattenChain(root: ChainLink): EvolutionStep[][] {
  const stages: EvolutionStep[][] = [];
  const visit = (link: ChainLink, depth: number) => {
    stages[depth] ??= [];
    stages[depth].push({
      pokemon: toSummary(link.species),
      how: describeEvolution(link.evolution_details[0]),
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
export function pickFlavorText(species: PokemonSpecies, language = 'en') {
  const entry = species.flavor_text_entries.find((item) => item.language.name === language);
  // Os textos antigos escrevem "POKéMON" em caixa alta.
  return entry?.flavor_text.replace(/[\n\f]/g, ' ').replace(/POKéMON/g, 'Pokémon') ?? '';
}

export function pickGenus(species: PokemonSpecies, language = 'en') {
  return species.genera.find((item) => item.language.name === language)?.genus ?? '';
}
