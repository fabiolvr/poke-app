import { Pressable, StyleSheet, Text } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
  // Botão de alternância ativo: fica afundado, sem sombra.
  selected?: boolean;
};

export function BrutalButton({ label, onPress, color, selected = false }: Props) {
  const theme = useBrutalTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={8}>
      {({ pressed }) => (
        <BrutalBox
          color={color ?? theme.yellow}
          pressed={pressed || selected}
          style={styles.button}>
          <Text style={[styles.label, { color: theme.textOnColor }]}>{label.toUpperCase()}</Text>
        </BrutalBox>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center' },
  label: { fontFamily: Brutal.font.bold, fontSize: 15, letterSpacing: 1 },
});
