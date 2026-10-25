import { describe, expect, it } from '@jest/globals';

import { TYPE_NAMES as TYPES_WITH_COLOR } from '@/constants/type-colors';
import { itemName, statName, triggerName, typeName } from '@/features/pokemon/translations';
import { resolveLanguage } from '@/i18n/language';

describe('traduções', () => {
  it('traduz os 18 tipos que têm cor no app', () => {
    const untranslated = TYPES_WITH_COLOR.filter(
      (type) =>
        typeName(type, 'pt') === type.charAt(0).toUpperCase() + type.slice(1) && type !== 'normal',
    );
    expect(untranslated).toEqual([]);
    expect(typeName('fire', 'pt')).toBe('Fogo');
    expect(typeName('psychic', 'pt')).toBe('Psíquico');
  });

  it('traduz itens, gatilhos e status de evolução', () => {
    expect(itemName('thunder-stone', 'pt')).toBe('Pedra do Trovão');
    expect(itemName('sweet-apple', 'pt')).toBe('Maçã Doce');
    expect(triggerName('trade', 'pt')).toBe('Troca');
    expect(statName('special-attack', 'pt')).toBe('Ataque Esp.');
  });

  it('em inglês, usa os nomes da API', () => {
    expect(typeName('fire', 'en')).toBe('Fire');
    expect(itemName('thunder-stone', 'en')).toBe('Thunder Stone');
    expect(triggerName('level-up', 'en')).toBe('Level Up');
    expect(statName('hp', 'en')).toBe('HP');
  });

  it('formata o nome da API quando não há tradução', () => {
    expect(typeName('stellar', 'pt')).toBe('Stellar');
    expect(itemName('mystery-gadget', 'pt')).toBe('Mystery Gadget');
  });
});

describe('idioma', () => {
  it('segue o aparelho quando a escolha é Sistema', () => {
    expect(resolveLanguage('system', 'pt')).toBe('pt');
    expect(resolveLanguage('system', 'en')).toBe('en');
  });

  it('a escolha do usuário vale mais que o aparelho', () => {
    expect(resolveLanguage('en', 'pt')).toBe('en');
    expect(resolveLanguage('pt', 'en')).toBe('pt');
  });
});
