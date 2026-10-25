export type TypeColor = {
  fill: string;
  text: string;
};

const DARK_TEXT = '#111111';
const LIGHT_TEXT = '#FFFFFF';

// Cores usadas nos jogos para cada um dos 18 tipos. O texto foi escolhido pelo
// maior contraste: só Fighting, Poison, Ghost, Dragon e Dark pedem branco.
const TYPE_COLORS: Record<string, TypeColor> = {
  normal: { fill: '#A8A77A', text: DARK_TEXT },
  fire: { fill: '#EE8130', text: DARK_TEXT },
  water: { fill: '#6390F0', text: DARK_TEXT },
  electric: { fill: '#F7D02C', text: DARK_TEXT },
  grass: { fill: '#7AC74C', text: DARK_TEXT },
  ice: { fill: '#96D9D6', text: DARK_TEXT },
  fighting: { fill: '#C22E28', text: LIGHT_TEXT },
  poison: { fill: '#A33EA1', text: LIGHT_TEXT },
  ground: { fill: '#E2BF65', text: DARK_TEXT },
  flying: { fill: '#A98FF3', text: DARK_TEXT },
  psychic: { fill: '#F95587', text: DARK_TEXT },
  bug: { fill: '#A6B91A', text: DARK_TEXT },
  rock: { fill: '#B6A136', text: DARK_TEXT },
  ghost: { fill: '#735797', text: LIGHT_TEXT },
  dragon: { fill: '#6F35FC', text: LIGHT_TEXT },
  dark: { fill: '#705746', text: LIGHT_TEXT },
  steel: { fill: '#B7B7CE', text: DARK_TEXT },
  fairy: { fill: '#D685AD', text: DARK_TEXT },
};

const FALLBACK: TypeColor = { fill: '#B0B0B0', text: DARK_TEXT };

export const TYPE_NAMES = Object.keys(TYPE_COLORS);

export function getTypeColor(type: string): TypeColor {
  return TYPE_COLORS[type] ?? FALLBACK;
}
