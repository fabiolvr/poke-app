import { describe, expect, it } from '@jest/globals';

import { TYPE_NAMES as TYPES_WITH_COLOR } from '@/constants/type-colors';
import { itemName, triggerName, typeName } from '@/features/pokemon/translations';

describe('traduções', () => {
  it('traduz os 18 tipos que têm cor no app', () => {
    const untranslated = TYPES_WITH_COLOR.filter(
      (type) =>
        typeName(type) === type.charAt(0).toUpperCase() + type.slice(1) && type !== 'normal',
    );
    expect(untranslated).toEqual([]);
    expect(typeName('fire')).toBe('Fogo');
    expect(typeName('psychic')).toBe('Psíquico');
  });

  it('traduz itens e gatilhos de evolução', () => {
    expect(itemName('thunder-stone')).toBe('Pedra do Trovão');
    expect(itemName('sweet-apple')).toBe('Maçã Doce');
    expect(triggerName('trade')).toBe('Troca');
  });

  it('formata o nome da API quando não há tradução', () => {
    expect(typeName('stellar')).toBe('Stellar');
    expect(itemName('mystery-gadget')).toBe('Mystery Gadget');
  });
});
