import { Text, type UniversalStyle } from '@expo/ui';

import { capitalize } from '@/features/pokemon/pokemon-utils';

// Cores usadas nos jogos para cada um dos 18 tipos.
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const badgeStyle: UniversalStyle = {
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 999,
};

type Props = {
  type: string;
};

export function TypeBadge({ type }: Props) {
  return (
    <Text
      style={{ ...badgeStyle, backgroundColor: TYPE_COLORS[type] ?? '#888888' }}
      textStyle={{ color: '#FFFFFF', fontWeight: '600', fontSize: 13 }}>
      {capitalize(type)}
    </Text>
  );
}
