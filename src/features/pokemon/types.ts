export type NamedResource = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedResource[];
};

export type Pokemon = {
  id: number;
  name: string;
  height: number; // em decímetros
  weight: number; // em hectogramas
  species: NamedResource;
  types: { slot: number; type: NamedResource }[];
  stats: { base_stat: number; stat: NamedResource }[];
  abilities: { is_hidden: boolean; ability: NamedResource }[];
};

export type PokemonSpecies = {
  name: string;
  genera: { genus: string; language: NamedResource }[];
  flavor_text_entries: { flavor_text: string; language: NamedResource }[];
  evolution_chain: { url: string };
  // Variedades da espécie: a padrão (mesmo número) e as formas (megas, regionais…).
  varieties: { is_default: boolean; pokemon: NamedResource }[];
};

export type TypeResponse = {
  pokemon: { slot: number; pokemon: NamedResource }[];
};

export type EvolutionDetail = {
  min_level: number | null;
  min_happiness: number | null;
  item: NamedResource | null;
  trigger: NamedResource;
};

export type ChainLink = {
  species: NamedResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
};

export type EvolutionChain = {
  id: number;
  chain: ChainLink;
};

// Um Pokémon dentro da linha evolutiva e o que faz ele evoluir ("Nv. 16", "Troca").
export type EvolutionStep = {
  pokemon: PokemonSummary;
  how: string;
};

// O mínimo que a lista e os favoritos precisam para desenhar uma linha.
export type PokemonSummary = {
  id: number;
  name: string;
  imageUrl: string;
};
