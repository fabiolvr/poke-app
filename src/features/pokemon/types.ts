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
  genera: { genus: string; language: NamedResource }[];
  flavor_text_entries: { flavor_text: string; language: NamedResource }[];
};

// O mínimo que a lista e os favoritos precisam para desenhar uma linha.
export type PokemonSummary = {
  id: number;
  name: string;
  imageUrl: string;
};
