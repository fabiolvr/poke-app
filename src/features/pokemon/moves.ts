import type { MoveLearnDetail, Pokemon, PokemonMove } from './types';

// Jogos principais, do mais novo para o mais antigo. A tela mostra os golpes de um jogo só:
// o primeiro desta lista em que o Pokémon aparece. Megas e outras formas que só existem em
// jogos fora dela (Champions, Legends) ficam com o jogo em que têm mais golpes.
const MAIN_GAMES = [
  'scarlet-violet',
  'sword-shield',
  'brilliant-diamond-shining-pearl',
  'ultra-sun-ultra-moon',
  'sun-moon',
  'omega-ruby-alpha-sapphire',
  'x-y',
  'black-2-white-2',
  'black-white',
  'heartgold-soulsilver',
  'platinum',
  'diamond-pearl',
  'emerald',
  'firered-leafgreen',
  'ruby-sapphire',
  'crystal',
  'gold-silver',
  'yellow',
  'red-blue',
];

// Títulos dos jogos, iguais em português e inglês. O que faltar sai do nome da API.
const GAME_NAMES: Record<string, string> = {
  'scarlet-violet': 'Scarlet/Violet',
  'sword-shield': 'Sword/Shield',
  'brilliant-diamond-shining-pearl': 'Brilliant Diamond/Shining Pearl',
  'ultra-sun-ultra-moon': 'Ultra Sun/Ultra Moon',
  'sun-moon': 'Sun/Moon',
  'omega-ruby-alpha-sapphire': 'Omega Ruby/Alpha Sapphire',
  'x-y': 'X/Y',
  'black-2-white-2': 'Black 2/White 2',
  'black-white': 'Black/White',
  'heartgold-soulsilver': 'HeartGold/SoulSilver',
  'diamond-pearl': 'Diamond/Pearl',
  'firered-leafgreen': 'FireRed/LeafGreen',
  'ruby-sapphire': 'Ruby/Sapphire',
  'gold-silver': 'Gold/Silver',
  'red-blue': 'Red/Blue',
  'lets-go-pikachu-lets-go-eevee': "Let's Go",
  'legends-arceus': 'Legends: Arceus',
  'legends-za': 'Legends: Z-A',
};

// As abas da tela, nesta ordem. Formas raras de aprender (Colosseum, XD, Stadium…) ficam de fora.
export const LEARN_METHODS = ['level-up', 'machine', 'egg', 'tutor'] as const;

export type LearnMethod = (typeof LEARN_METHODS)[number];

export type LearnedMove = {
  name: string;
  // Só nos golpes por nível; 0 é o golpe aprendido ao evoluir.
  level: number;
};

export type Learnset = {
  game: string;
  methods: { method: LearnMethod; moves: LearnedMove[] }[];
};

const isLearnMethod = (method: string): method is LearnMethod =>
  (LEARN_METHODS as readonly string[]).includes(method);

// O jogo cujos golpes vão para a tela.
export function pickGame(moves: PokemonMove[]): string | undefined {
  const counts = new Map<string, number>();
  moves.forEach(({ version_group_details }) =>
    version_group_details.forEach(({ version_group }) =>
      counts.set(version_group.name, (counts.get(version_group.name) ?? 0) + 1),
    ),
  );
  const main = MAIN_GAMES.find((game) => counts.has(game));
  if (main) {
    return main;
  }
  return [...counts].sort(([, a], [, b]) => b - a)[0]?.[0];
}

// Deixa cada golpe só com o jogo escolhido: a lista completa repete o golpe em cada jogo.
export function slimMoves(moves: PokemonMove[]): PokemonMove[] {
  const game = pickGame(moves);
  const inGame = (detail: MoveLearnDetail) => detail.version_group.name === game;
  return moves
    .filter(({ version_group_details }) => version_group_details.some(inGame))
    .map(({ move, version_group_details }) => ({
      move,
      version_group_details: version_group_details.filter(inGame),
    }));
}

export function gameName(game: string) {
  return (
    GAME_NAMES[game] ??
    game
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

// Golpes agrupados por forma de aprender: por nível em ordem de nível, os outros em ordem
// alfabética. Cópias salvas antes desta tela não têm golpes e devolvem undefined.
export function learnset(pokemon: Pick<Pokemon, 'moves'>): Learnset | undefined {
  const moves = pokemon.moves ?? [];
  const game = pickGame(moves);
  if (!game) {
    return undefined;
  }

  const byMethod = new Map<LearnMethod, LearnedMove[]>();
  moves.forEach(({ move, version_group_details }) =>
    version_group_details
      .filter((detail) => detail.version_group.name === game)
      .forEach(({ move_learn_method, level_learned_at }) => {
        const method = move_learn_method.name;
        if (!isLearnMethod(method)) {
          return;
        }
        const list = byMethod.get(method) ?? [];
        // Fora do nível, o mesmo golpe pode vir repetido (uma entrada por versão do jogo).
        if (method === 'level-up' || !list.some((learned) => learned.name === move.name)) {
          list.push({ name: move.name, level: method === 'level-up' ? level_learned_at : 0 });
        }
        byMethod.set(method, list);
      }),
  );

  const methods = LEARN_METHODS.filter((method) => byMethod.has(method)).map((method) => ({
    method,
    moves: (byMethod.get(method) ?? []).sort((a, b) =>
      method === 'level-up' && a.level !== b.level
        ? a.level - b.level
        : a.name.localeCompare(b.name),
    ),
  }));
  return methods.length > 0 ? { game, methods } : undefined;
}
