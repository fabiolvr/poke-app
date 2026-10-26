import { TYPE_NAMES } from '@/constants/type-colors';

// Tabela de efetividade dos jogos a partir da 6ª geração: para cada tipo de ataque, o
// multiplicador contra os tipos que não levam dano normal. Fica no app, e não vem da
// PokéAPI, para a seção funcionar sem internet e sem uma requisição a mais por tipo.
const ATTACK_CHART: Record<string, Record<string, number>> = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: {
    grass: 2,
    ice: 2,
    bug: 2,
    steel: 2,
    fire: 0.5,
    water: 0.5,
    rock: 0.5,
    dragon: 0.5,
  },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  grass: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    poison: 0.5,
    flying: 0.5,
    bug: 0.5,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: {
    normal: 2,
    ice: 2,
    rock: 2,
    dark: 2,
    steel: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    fairy: 0.5,
    ghost: 0,
  },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: {
    fire: 2,
    electric: 2,
    poison: 2,
    rock: 2,
    steel: 2,
    grass: 0.5,
    bug: 0.5,
    flying: 0,
  },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: {
    grass: 2,
    psychic: 2,
    dark: 2,
    fire: 0.5,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    ghost: 0.5,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
};

// Da maior fraqueza para a imunidade, na ordem em que aparecem na tela.
const MULTIPLIERS = [4, 2, 0.5, 0.25, 0] as const;

export type Multiplier = (typeof MULTIPLIERS)[number];

export type TypeMatchup = {
  multiplier: Multiplier;
  types: string[];
};

// Dano que cada tipo de ataque causa num Pokémon desses tipos: multiplica a efetividade contra
// cada um deles (Fogo/Voador leva 4× de Pedra). Só os grupos com algum tipo; dano normal (1×)
// fica de fora. Não considera habilidades como Levitate.
export function typeMatchups(defendingTypes: string[]): TypeMatchup[] {
  const damage = (attacking: string) =>
    defendingTypes.reduce(
      (total, defending) => total * (ATTACK_CHART[attacking]?.[defending] ?? 1),
      1,
    );

  return MULTIPLIERS.map((multiplier) => ({
    multiplier,
    types: TYPE_NAMES.filter((attacking) => damage(attacking) === multiplier),
  })).filter((matchup) => matchup.types.length > 0);
}
