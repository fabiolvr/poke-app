import { Sticker } from '@/components/sticker';
import { getTypeColor } from '@/constants/type-colors';
import { capitalize } from '@/features/pokemon/pokemon-utils';

type Props = {
  type: string;
  tilt?: number;
};

export function TypeBadge({ type, tilt }: Props) {
  const { fill, text } = getTypeColor(type);
  return <Sticker label={capitalize(type)} color={fill} textColor={text} tilt={tilt} />;
}
