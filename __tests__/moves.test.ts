import { describe, expect, it } from '@jest/globals';

import { gameName, learnset, pickGame, slimMoves } from '@/features/pokemon/moves';
import type { PokemonMove } from '@/features/pokemon/types';

const learned = (game: string, method: string, level = 0) => ({
  level_learned_at: level,
  move_learn_method: { name: method, url: '' },
  version_group: { name: game, url: '' },
});

const move = (name: string, ...details: ReturnType<typeof learned>[]): PokemonMove => ({
  move: { name, url: '' },
  version_group_details: details,
});

const pikachu = [
  move(
    'thunder-shock',
    learned('red-blue', 'level-up', 1),
    learned('scarlet-violet', 'level-up', 1),
  ),
  move('thunderbolt', learned('red-blue', 'machine'), learned('scarlet-violet', 'machine')),
  move(
    'quick-attack',
    learned('scarlet-violet', 'level-up', 1),
    learned('sword-shield', 'level-up', 1),
  ),
  move('thunder', learned('scarlet-violet', 'level-up', 44)),
  move('volt-tackle', learned('scarlet-violet', 'egg')),
  move('mega-punch', learned('red-blue', 'machine')),
  move('surf', learned('yellow', 'stadium-surfing-pikachu')),
];

describe('golpes', () => {
  it('prefere o jogo principal mais novo, mesmo com menos golpes', () => {
    expect(pickGame(pikachu)).toBe('scarlet-violet');
  });

  it('fora dos jogos principais, fica com o jogo que tem mais golpes', () => {
    const megaX = [
      move('flare-blitz', learned('champions', 'machine')),
      move('dragon-claw', learned('champions', 'machine'), learned('legends-za', 'level-up', 1)),
    ];
    expect(pickGame(megaX)).toBe('champions');
  });

  it('sem golpes, não há jogo', () => {
    expect(pickGame([])).toBeUndefined();
    expect(learnset({ moves: [] })).toBeUndefined();
  });

  it('guarda só os golpes e as entradas do jogo escolhido', () => {
    expect(slimMoves(pikachu)).toEqual([
      move('thunder-shock', learned('scarlet-violet', 'level-up', 1)),
      move('thunderbolt', learned('scarlet-violet', 'machine')),
      move('quick-attack', learned('scarlet-violet', 'level-up', 1)),
      move('thunder', learned('scarlet-violet', 'level-up', 44)),
      move('volt-tackle', learned('scarlet-violet', 'egg')),
    ]);
  });

  it('agrupa por forma de aprender, por nível em ordem de nível e depois de nome', () => {
    expect(learnset({ moves: pikachu })).toEqual({
      game: 'scarlet-violet',
      methods: [
        {
          method: 'level-up',
          moves: [
            { name: 'quick-attack', level: 1 },
            { name: 'thunder-shock', level: 1 },
            { name: 'thunder', level: 44 },
          ],
        },
        { method: 'machine', moves: [{ name: 'thunderbolt', level: 0 }] },
        { method: 'egg', moves: [{ name: 'volt-tackle', level: 0 }] },
      ],
    });
  });

  it('não repete o golpe de MT que vem uma vez por versão do jogo', () => {
    const moves = [
      move('surf', learned('scarlet-violet', 'machine'), learned('scarlet-violet', 'machine')),
    ];
    expect(learnset({ moves })?.methods).toEqual([
      { method: 'machine', moves: [{ name: 'surf', level: 0 }] },
    ]);
  });

  it('cópias salvas sem golpes não quebram a tela', () => {
    expect(learnset({} as { moves: PokemonMove[] })).toBeUndefined();
  });

  it('mostra o título do jogo', () => {
    expect(gameName('scarlet-violet')).toBe('Scarlet/Violet');
    expect(gameName('champions')).toBe('Champions');
  });
});
