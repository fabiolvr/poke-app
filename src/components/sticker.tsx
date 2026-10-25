import { StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Props = {
  label: string;
  color: string;
  textColor?: string;
  tilt?: number;
  style?: StyleProp<ViewStyle>;
};

// Etiqueta pequena e torta, como um adesivo colado no card.
export function Sticker({ label, color, textColor, tilt = -3, style }: Props) {
  const theme = useBrutalTheme();

  return (
    <BrutalBox
      color={color}
      style={[styles.sticker, { transform: [{ rotate: `${tilt}deg` }] }, style]}>
      <Text style={[styles.label, { color: textColor ?? theme.textOnColor }]}>{label}</Text>
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  sticker: { paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  label: { fontFamily: Brutal.font.bold, fontSize: 13 },
});
