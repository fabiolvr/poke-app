import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrutalBox } from '@/components/brutal-box';
import { Sticker } from '@/components/sticker';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { useIsOffline } from '@/hooks/use-is-offline';

// Barra de abas flutuante, desenhada como um card brutalista. Sem internet, ganha um adesivo
// avisando que a Pokédex e os favoritos mostram o que já está salvo no aparelho.
export function BrutalTabList({ children, ...props }: TabListProps) {
  const insets = useSafeAreaInsets();
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const isOffline = useIsOffline();

  return (
    <View {...props} style={[styles.container, { bottom: insets.bottom + 8 }]}>
      {isOffline ? (
        <Sticker label={t('tabs.offline')} color={theme.red} tilt={-2} style={styles.offline} />
      ) : null}
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
  offline: { alignSelf: 'center', marginBottom: 10 },
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
