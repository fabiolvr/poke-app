import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

// Barra de abas flutuante, desenhada como um card brutalista.
export function BrutalTabList({ children, ...props }: TabListProps) {
  const insets = useSafeAreaInsets();

  return (
    <View {...props} style={[styles.container, { bottom: insets.bottom + 8 }]}>
      <BrutalBox style={styles.bar}>{children}</BrutalBox>
    </View>
  );
}

// O `ref` do TabTrigger chega como prop comum e segue para o Pressable no spread.
type TabButtonProps = Omit<TabTriggerSlotProps, 'ref' | 'children'> & {
  label: string;
  icon: SymbolViewProps['name'];
};

export function BrutalTabButton({ label, isFocused = false, icon, ...props }: TabButtonProps) {
  const theme = useBrutalTheme();
  const color = isFocused ? theme.textOnColor : theme.text;

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      // Sem rótulo explícito, o VoiceOver lê também o nome do ícone ("love, Favoritos").
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      style={styles.trigger}>
      {({ pressed }) => (
        <BrutalBox
          color={isFocused ? theme.yellow : theme.surface}
          pressed={pressed || isFocused}
          style={styles.tab}>
          <SymbolView name={icon} size={18} tintColor={color} />
          <Text style={[styles.label, { color }]}>{label}</Text>
        </BrutalBox>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: { flexDirection: 'row', gap: 10, padding: 8 },
  trigger: { minWidth: 132 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  label: { fontFamily: Brutal.font.bold, fontSize: 14 },
});
