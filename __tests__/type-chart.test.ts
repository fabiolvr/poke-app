import { describe, expect, it } from '@jest/globals';

import { typeMatchups } from '@/features/pokemon/type-chart';

describe('typeMatchups', () => {
  it('Pikachu (Elétrico): só fraco a Terrestre', () => {
    expect(typeMatchups(['electric'])).toEqual([
      { multiplier: 2, types: ['ground'] },
      { multiplier: 0.5, types: ['electric', 'flying', 'steel'] },
    ]);
  });

  it('Charizard (Fogo/Voador): 4× de Pedra, ¼× de Planta e Inseto e imune a Terrestre', () => {
    expect(typeMatchups(['fire', 'flying'])).toEqual([
      { multiplier: 4, types: ['rock'] },
      { multiplier: 2, types: ['water', 'electric'] },
      { multiplier: 0.5, types: ['fire', 'fighting', 'steel', 'fairy'] },
      { multiplier: 0.25, types: ['grass', 'bug'] },
      { multiplier: 0, types: ['ground'] },
    ]);
  });

  it('Gengar (Fantasma/Venenoso): imune a Normal e Lutador', () => {
    expect(typeMatchups(['ghost', 'poison'])).toEqual([
      { multiplier: 2, types: ['ground', 'psychic', 'ghost', 'dark'] },
      { multiplier: 0.5, types: ['grass', 'fairy'] },
      { multiplier: 0.25, types: ['poison', 'bug'] },
      { multiplier: 0, types: ['normal', 'fighting'] },
    ]);
  });

  it('fraqueza e resistência se anulam: Gelo não faz diferença contra Charizard', () => {
    const types = typeMatchups(['fire', 'flying']).flatMap((matchup) => matchup.types);
    expect(types).not.toContain('ice');
  });

  it('imunidade vence a fraqueza: Zapdos (Elétrico/Voador) não leva dano de Terrestre', () => {
    // Terrestre seria 2× contra Elétrico, mas Voador zera.
    const immune = typeMatchups(['electric', 'flying']).find((matchup) => matchup.multiplier === 0);
    expect(immune?.types).toEqual(['ground']);
  });
});
