import { describe, expect, it } from '@jest/globals';

import { GENERATIONS, findGeneration, inGeneration } from '@/features/pokemon/generations';

describe('gerações', () => {
  it('cobrem as 1.025 espécies, sem buraco nem sobreposição', () => {
    GENERATIONS.forEach((generation, index) => {
      const previous = GENERATIONS[index - 1];
      expect(generation.first).toBe(previous ? previous.last + 1 : 1);
    });
    expect(GENERATIONS.at(-1)?.last).toBe(1025);
  });

  it('separa pelas pontas de cada faixa', () => {
    expect(inGeneration({ id: 151 }, 1)).toBe(true);
    expect(inGeneration({ id: 152 }, 1)).toBe(false);
    expect(inGeneration({ id: 152 }, 2)).toBe(true);
    expect(inGeneration({ id: 1025 }, 9)).toBe(true);
  });

  it('sem geração escolhida, aceita todos', () => {
    expect(inGeneration({ id: 25 }, null)).toBe(true);
  });

  it('acha a região pelo número', () => {
    expect(findGeneration(3)?.region).toBe('Hoenn');
    expect(findGeneration(null)).toBeUndefined();
  });
});
