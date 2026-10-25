import { describe, expect, it } from '@jest/globals';

import {
  dexLabel,
  describeEvolution,
  flattenChain,
  formatHeight,
  formatName,
  formatWeight,
  formLabel,
  idFromUrl,
  isDexEntry,
  matchesQuery,
  pickFlavorText,
  toSummary,
} from '@/features/pokemon/pokemon-utils';
import type { ChainLink, EvolutionDetail, PokemonSpecies } from '@/features/pokemon/types';

const resource = (name: string, id: number, kind = 'pokemon-species') => ({
  name,
  url: `https://pokeapi.co/api/v2/${kind}/${id}/`,
});

const detail = (overrides: Partial<EvolutionDetail>): EvolutionDetail => ({
  min_level: null,
  min_happiness: null,
  item: null,
  trigger: { name: 'level-up', url: '' },
  ...overrides,
});

const link = (
  name: string,
  id: number,
  how: Partial<EvolutionDetail> | null,
  next: ChainLink[] = [],
) => ({
  species: resource(name, id),
  evolution_details: how ? [detail(how)] : [],
  evolves_to: next,
});

describe('ids e resumo', () => {
  it('tira o id do fim da URL, com ou sem barra final', () => {
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
    expect(idFromUrl('https://pokeapi.co/api/v2/pokemon/10034')).toBe(10034);
  });

  it('monta o resumo com a arte oficial pelo id', () => {
    expect(toSummary(resource('pikachu', 25, 'pokemon'))).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    });
  });

  it('separa espécies (até 9999) de formas alternativas (10000 em diante)', () => {
    expect(isDexEntry({ id: 1025 })).toBe(true);
    expect(isDexEntry({ id: 10001 })).toBe(false);
  });
});

describe('nomes e números', () => {
  it('mantém o nome das espécies como vem da API', () => {
    expect(formatName({ id: 25, name: 'pikachu' })).toBe('Pikachu');
    expect(formatName({ id: 250, name: 'ho-oh' })).toBe('Ho-oh');
  });

  it('deixa legível o nome das formas', () => {
    expect(formatName({ id: 10034, name: 'charizard-mega-x' })).toBe('Charizard Mega X');
    expect(formatName({ id: 10196, name: 'charizard-gmax' })).toBe('Charizard Gigantamax');
    expect(formatName({ id: 10080, name: 'pikachu-rock-star' })).toBe('Pikachu Rock Star');
  });

  it('mostra o número da Pokédex só para espécies', () => {
    expect(dexLabel({ id: 25 })).toBe('#0025');
    expect(dexLabel({ id: 1025 })).toBe('#1025');
    expect(dexLabel({ id: 10034 })).toBe('Forma');
  });

  it('dá um rótulo curto para cada variedade da espécie', () => {
    expect(formLabel('charizard', 'charizard')).toBe('Padrão');
    expect(formLabel('charizard-mega-x', 'charizard')).toBe('Mega X');
    expect(formLabel('charizard-gmax', 'charizard')).toBe('Gigantamax');
    expect(formLabel('raichu-alola', 'raichu')).toBe('Alola');
    expect(formLabel('mr-mime-galar', 'mr-mime')).toBe('Galar');
  });

  it('converte altura e peso para metros e quilos', () => {
    expect(formatHeight(4)).toBe('0.4 m');
    expect(formatWeight(60)).toBe('6.0 kg');
  });
});

describe('busca', () => {
  const pikachu = { id: 25, name: 'pikachu', imageUrl: '' };
  const mrMime = { id: 122, name: 'mr-mime', imageUrl: '' };

  it('aceita qualquer Pokémon quando a busca está vazia', () => {
    expect(matchesQuery(pikachu, '')).toBe(true);
    expect(matchesQuery(pikachu, '   ')).toBe(true);
  });

  it('ignora maiúsculas e espaços nas pontas', () => {
    expect(matchesQuery(pikachu, ' PIKA ')).toBe(true);
    expect(matchesQuery(pikachu, 'chu')).toBe(true);
  });

  it('trata espaço como hífen, como nos nomes da API', () => {
    expect(matchesQuery(mrMime, 'mr mime')).toBe(true);
  });

  it('recusa o que não faz parte do nome', () => {
    expect(matchesQuery(pikachu, 'raichu')).toBe(false);
  });
});

describe('evoluções', () => {
  it('descreve cada gatilho em português', () => {
    expect(describeEvolution(undefined)).toBe('');
    expect(describeEvolution(detail({ min_level: 16 }))).toBe('Nv. 16');
    expect(
      describeEvolution(
        detail({ item: { name: 'water-stone', url: '' }, trigger: { name: 'use-item', url: '' } }),
      ),
    ).toBe('Pedra da Água');
    expect(describeEvolution(detail({ trigger: { name: 'trade', url: '' } }))).toBe('Troca');
    expect(describeEvolution(detail({ min_happiness: 220 }))).toBe('Amizade');
    expect(describeEvolution(detail({}))).toBe('Subir de nível');
    expect(describeEvolution(detail({ trigger: { name: 'spin', url: '' } }))).toBe('Girar');
  });

  it('usa o nome da API quando o gatilho não está na tabela', () => {
    expect(describeEvolution(detail({ trigger: { name: 'some-new-trigger', url: '' } }))).toBe(
      'Some New Trigger',
    );
  });

  it('achata uma linha simples em estágios', () => {
    const chain = link('bulbasaur', 1, null, [
      link('ivysaur', 2, { min_level: 16 }, [link('venusaur', 3, { min_level: 32 })]),
    ]);
    const stages = flattenChain(chain);
    expect(stages.map((stage) => stage.map((step) => step.pokemon.name))).toEqual([
      ['bulbasaur'],
      ['ivysaur'],
      ['venusaur'],
    ]);
    expect(stages[1][0].how).toBe('Nv. 16');
    expect(stages[0][0].how).toBe('');
  });

  it('põe evoluções ramificadas no mesmo estágio', () => {
    const stone = (item: string) => ({
      item: { name: item, url: '' },
      trigger: { name: 'use-item', url: '' },
    });
    const chain = link('eevee', 133, null, [
      link('vaporeon', 134, stone('water-stone')),
      link('jolteon', 135, stone('thunder-stone')),
      link('flareon', 136, stone('fire-stone')),
    ]);
    const stages = flattenChain(chain);
    expect(stages).toHaveLength(2);
    expect(stages[1].map((step) => [step.pokemon.id, step.how])).toEqual([
      [134, 'Pedra da Água'],
      [135, 'Pedra do Trovão'],
      [136, 'Pedra do Fogo'],
    ]);
  });
});

describe('descrição da Pokédex', () => {
  const species = (text: string, language = 'en'): PokemonSpecies => ({
    name: 'pikachu',
    genera: [],
    flavor_text_entries: [{ flavor_text: text, language: { name: language, url: '' } }],
    evolution_chain: { url: '' },
    varieties: [],
  });

  it('junta as quebras de linha e corrige o "POKéMON" dos textos antigos', () => {
    expect(pickFlavorText(species('When several of these POKéMON\ngather,\fthey…'))).toBe(
      'When several of these Pokémon gather, they…',
    );
  });

  it('devolve vazio se não houver texto no idioma pedido', () => {
    expect(pickFlavorText(species('Texto', 'ja'))).toBe('');
  });
});
