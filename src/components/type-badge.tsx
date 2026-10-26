import { Sticker } from '@/components/sticker';
import { getTypeColor } from '@/constants/type-colors';
import { typeName } from '@/features/pokemon/translations';
import { useLanguage } from '@/hooks/use-language';

type Props = {
  type: string;
  tilt?: number;
  // Escolhido num filtro: ganha um ✓, para não depender só da cor.
  selected?: boolean;
};

export function TypeBadge({ type, tilt, selected = false }: Props) {
  const { fill, text } = getTypeColor(type);
  const language = useLanguage();
  const label = typeName(type, language);
  return (
    <Sticker label={selected ? `✓ ${label}` : label} color={fill} textColor={text} tilt={tilt} />
  );
}
