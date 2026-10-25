import { BottomSheet, Host, RNHostView } from '@expo/ui';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { TypeBadge } from '@/components/type-badge';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { TYPE_NAMES } from '@/constants/type-colors';
import { typeName } from '@/features/pokemon/translations';
import { useLanguage } from '@/hooks/use-language';

const SHEET_PADDING = 24;

type Props = {
  isPresented: boolean;
  onDismiss: () => void;
  onSelect: (type: string) => void;
};

// Folha nativa do @expo/ui com os 18 tipos desenhados como adesivos.
export function TypeFilterSheet({ isPresented, onDismiss, onSelect }: Props) {
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const language = useLanguage();
  const { width } = useWindowDimensions();

  return (
    <Host style={styles.host}>
      <BottomSheet isPresented={isPresented} onDismiss={onDismiss} containerColor={theme.paper}>
        <RNHostView matchContents>
          <View style={[styles.content, { width }]}>
            <Text style={[styles.title, { color: theme.text }]}>{t('typeSheet.title')}</Text>
            <View style={styles.types}>
              {TYPE_NAMES.map((type, index) => (
                <Pressable
                  key={type}
                  accessibilityRole="button"
                  accessibilityLabel={t('typeSheet.option', { type: typeName(type, language) })}
                  hitSlop={4}
                  onPress={() => onSelect(type)}>
                  <TypeBadge type={type} tilt={index % 2 === 0 ? -3 : 3} />
                </Pressable>
              ))}
            </View>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}

const styles = StyleSheet.create({
  // A folha é apresentada por cima da tela; o Host em si não ocupa espaço.
  host: { position: 'absolute', width: 1, height: 1 },
  content: { padding: SHEET_PADDING, gap: 16 },
  title: { fontFamily: Brutal.font.display, fontSize: 18 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
});
