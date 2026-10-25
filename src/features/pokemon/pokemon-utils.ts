import type { NamedResource, PokemonSpecies, PokemonSummary } from './types';

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

export function toSummary(resource: NamedResource): PokemonSummary {
  // A URL termina com o id: https://pokeapi.co/api/v2/pokemon/25/
  const id = Number(resource.url.split('/').filter(Boolean).pop());
  return { id, name: resource.name, imageUrl: artworkUrl(id) };
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
