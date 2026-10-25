import { Sticker } from '@/components/sticker';
import { getTypeColor } from '@/constants/type-colors';
import { typeName } from '@/features/pokemon/translations';
import { useLanguage } from '@/hooks/use-language';

type Props = {
  type: string;
  tilt?: number;
};

export function TypeBadge({ type, tilt }: Props) {
  const { fill, text } = getTypeColor(type);
  const language = useLanguage();
  return <Sticker label={typeName(type, language)} color={fill} textColor={text} tilt={tilt} />;
}
