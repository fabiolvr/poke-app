import { Host, TextInput, type TextInputRef } from '@expo/ui';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

// Campo nativo do @expo/ui (SwiftUI/Compose) dentro de uma caixa brutalista.
export function SearchBar({ value, onChangeText, placeholder }: Props) {
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const inputRef = useRef<TextInputRef>(null);

  const handleClear = () => {
    inputRef.current?.clear();
    onChangeText('');
  };

  return (
    <BrutalBox style={styles.box}>
      {/* A altura vem do campo nativo; com altura fixa o texto ficava grudado no topo. */}
      <Host matchContents={{ vertical: true }} style={styles.host}>
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          placeholderTextColor={theme.muted}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          cursorColor={theme.line}
          selectionColor={theme.pink}
          textStyle={{ fontFamily: Brutal.font.bold, fontSize: 17, color: theme.text }}
        />
      </Host>
      {value !== '' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.clearSearch')}
          hitSlop={12}
          onPress={handleClear}>
          <Text style={[styles.clear, { color: theme.text }]}>✕</Text>
        </Pressable>
      ) : null}
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  host: { flex: 1 },
  clear: { fontFamily: Brutal.font.bold, fontSize: 18, paddingHorizontal: 4 },
});
