import { StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Props = {
  label: string;
  color: string;
  textColor?: string;
  tilt?: number;
  size?: 'regular' | 'small';
  style?: StyleProp<ViewStyle>;
};

// Etiqueta pequena e torta, como um adesivo colado no card. Sempre em uma linha.
export function Sticker({ label, color, textColor, tilt = -3, size = 'regular', style }: Props) {
  const theme = useBrutalTheme();

  return (
    <BrutalBox
      color={color}
      style={[styles.sticker, { transform: [{ rotate: `${tilt}deg` }] }, style]}>
      <Text
        style={[
          styles.label,
          size === 'small' && styles.small,
          { color: textColor ?? theme.textOnColor },
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  sticker: { paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  label: { fontFamily: Brutal.font.bold, fontSize: 13 },
  small: { fontSize: 11 },
});
