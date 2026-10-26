import type { Language } from '@/i18n/language';

// A PokéAPI tem o idioma pt-br, mas os tipos e os itens não vêm traduzidos; por isso estas tabelas.
// Os tipos seguem os nomes dos jogos em português. Nos itens e gatilhos, alguns nomes são
// traduções descritivas e podem não bater exatamente com a versão oficial dos jogos.
// Em inglês, e para o que falte nas tabelas, vale o nome da API formatado ("water-stone" → "Water Stone").

const TYPE_NAMES: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  electric: 'Elétrico',
  grass: 'Planta',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Venenoso',
  ground: 'Terrestre',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Sombrio',
  steel: 'Aço',
  fairy: 'Fada',
};

// Categoria "evolution" da PokéAPI (/item-category/evolution).
const ITEM_NAMES: Record<string, string> = {
  'sun-stone': 'Pedra do Sol',
  'moon-stone': 'Pedra da Lua',
  'fire-stone': 'Pedra do Fogo',
  'thunder-stone': 'Pedra do Trovão',
  'water-stone': 'Pedra da Água',
  'leaf-stone': 'Pedra da Folha',
  'shiny-stone': 'Pedra Brilhante',
  'dusk-stone': 'Pedra do Crepúsculo',
  'dawn-stone': 'Pedra da Alvorada',
  'ice-stone': 'Pedra do Gelo',
  'oval-stone': 'Pedra Oval',
  'dragon-scale': 'Escama de Dragão',
  'up-grade': 'Melhoria',
  protector: 'Protetor',
  electirizer: 'Eletrizador',
  magmarizer: 'Magmatizador',
  'dubious-disc': 'Disco Duvidoso',
  'reaper-cloth': 'Manto Ceifador',
  'prism-scale': 'Escama Prismática',
  'whipped-dream': 'Chantili',
  sachet: 'Sachê',
  'strawberry-sweet': 'Doce de Morango',
  'love-sweet': 'Doce de Coração',
  'berry-sweet': 'Doce de Fruta',
  'clover-sweet': 'Doce de Trevo',
  'flower-sweet': 'Doce de Flor',
  'star-sweet': 'Doce de Estrela',
  'ribbon-sweet': 'Doce de Laço',
  'sweet-apple': 'Maçã Doce',
  'tart-apple': 'Maçã Azeda',
  'syrupy-apple': 'Maçã Xaroposa',
  'cracked-pot': 'Bule Rachado',
  'chipped-pot': 'Bule Lascado',
  'unremarkable-teacup': 'Xícara Comum',
  'masterpiece-teacup': 'Xícara Obra-Prima',
  'malicious-armor': 'Armadura Maligna',
  'linking-cord': 'Cordão de Ligação',
  'black-augurite': 'Augurita Negra',
  'peat-block': 'Bloco de Turfa',
  'metal-alloy': 'Liga Metálica',
};

// Gatilhos de evolução (/evolution-trigger). Nível, item, troca e amizade são tratados à parte.
const TRIGGER_NAMES: Record<string, string> = {
  'level-up': 'Subir de nível',
  trade: 'Troca',
  'use-item': 'Usar item',
  shed: 'Muda',
  spin: 'Girar',
  'tower-of-darkness': 'Torre das Trevas',
  'tower-of-waters': 'Torre das Águas',
  'three-critical-hits': '3 golpes críticos',
  'take-damage': 'Sofrer dano',
  'in-battle-level-up': 'Subir de nível em batalha',
  'agile-style-move': 'Golpe em estilo ágil',
  'strong-style-move': 'Golpe em estilo forte',
  'recoil-damage': 'Dano de recuo',
  'use-move': 'Usar golpe',
  'three-defeated-bisharp': 'Derrotar 3 Bisharp',
  'gimmighoul-coins': 'Moedas de Gimmighoul',
  'meltan-candies': 'Doces de Meltan',
  unclassified: 'Outro',
};

const STAT_NAMES: Record<Language, Record<string, string>> = {
  pt: {
    hp: 'PS',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defesa Esp.',
    speed: 'Velocidade',
  },
  en: {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  },
};

// Palavras curtas que acompanham os dados da API nos cards e na linha evolutiva.
const WORDS = {
  pt: { level: 'Nv.', trade: 'Troca', friendship: 'Amizade', form: 'Forma', defaultForm: 'Padrão' },
  en: {
    level: 'Lv.',
    trade: 'Trade',
    friendship: 'Friendship',
    form: 'Form',
    defaultForm: 'Default',
  },
};

function fromSlug(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function translate(table: Record<string, string>, slug: string, language: Language) {
  return (language === 'pt' ? table[slug] : undefined) ?? fromSlug(slug);
}

export function typeName(type: string, language: Language) {
  return translate(TYPE_NAMES, type, language);
}

export function itemName(item: string, language: Language) {
  return translate(ITEM_NAMES, item, language);
}

export function triggerName(trigger: string, language: Language) {
  return translate(TRIGGER_NAMES, trigger, language);
}

// Golpes ficam em inglês: a PokéAPI não traz os nomes em português.
export function moveName(move: string) {
  return fromSlug(move);
}

export function statName(stat: string, language: Language) {
  return STAT_NAMES[language][stat] ?? fromSlug(stat);
}

export function word(key: keyof (typeof WORDS)['pt'], language: Language) {
  return WORDS[language][key];
}
