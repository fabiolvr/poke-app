import { Sticker } from '@/components/sticker';
import { getTypeColor } from '@/constants/type-colors';
import { typeName } from '@/features/pokemon/translations';

type Props = {
  type: string;
  tilt?: number;
};

export function TypeBadge({ type, tilt }: Props) {
  const { fill, text } = getTypeColor(type);
  return <Sticker label={typeName(type)} color={fill} textColor={text} tilt={tilt} />;
}
