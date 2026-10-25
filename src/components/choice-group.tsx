import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Opções lado a lado, uma escolhida por vez. A escolhida fica amarela e afundada.
export function ChoiceGroup<T extends string>({ options, value, onChange }: Props<T>) {
  const theme = useBrutalTheme();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={styles.option}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}>
            {({ pressed }) => (
              <BrutalBox
                color={selected ? theme.yellow : theme.surface}
                pressed={pressed || selected}
                style={styles.box}>
                <Text
                  style={[styles.label, { color: selected ? theme.textOnColor : theme.text }]}
                  numberOfLines={1}
                  // "PORTUGUÊS" é o rótulo mais largo: em telas estreitas, a fonte diminui.
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}>
                  {option.label.toUpperCase()}
                </Text>
              </BrutalBox>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  option: { flex: 1 },
  box: { paddingVertical: 12, paddingHorizontal: 6, alignItems: 'center' },
  label: { fontFamily: Brutal.font.bold, fontSize: 13, letterSpacing: 1 },
});
