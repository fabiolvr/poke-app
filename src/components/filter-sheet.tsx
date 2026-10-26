import { BottomSheet, Host, RNHostView } from '@expo/ui';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrutalButton } from '@/components/brutal-button';
import { Sticker } from '@/components/sticker';
import { TypeBadge } from '@/components/type-badge';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { TYPE_NAMES } from '@/constants/type-colors';
import { GENERATIONS } from '@/features/pokemon/generations';
import { typeName } from '@/features/pokemon/translations';
import type { PokedexFilters } from '@/features/pokemon/use-pokedex-source';
import { useLanguage } from '@/hooks/use-language';

const SHEET_PADDING = 24;
const MAX_TYPES = 2;

type Props = {
  isPresented: boolean;
  filters: PokedexFilters;
  onChange: (filters: PokedexFilters) => void;
  onDismiss: () => void;
};

// Folha nativa do @expo/ui com os tipos e as gerações desenhados como adesivos. Cada toque
// liga ou desliga um filtro na hora; a grade atrás já mostra o resultado.
export function FilterSheet({ isPresented, filters, onChange, onDismiss }: Props) {
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const language = useLanguage();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { types, generation } = filters;
  const isTypeLimitReached = types.length >= MAX_TYPES;

  const toggleType = (type: string) =>
    onChange({
      ...filters,
      types: types.includes(type) ? types.filter((item) => item !== type) : [...types, type],
    });

  const toggleGeneration = (number: number) =>
    onChange({ ...filters, generation: generation === number ? null : number });

  return (
    <Host style={styles.host}>
      <BottomSheet isPresented={isPresented} onDismiss={onDismiss} containerColor={theme.paper}>
        <RNHostView matchContents>
          {/* O fim da folha fica atrás do indicador de início; sem isso, o botão saía cortado. */}
          <View style={[styles.content, { width, paddingBottom: SHEET_PADDING + insets.bottom }]}>
            <Text style={[styles.title, { color: theme.text }]}>{t('filterSheet.title')}</Text>

            <Text style={[styles.section, { color: theme.text }]}>
              {t('filterSheet.types').toUpperCase()}
            </Text>
            <View style={styles.options}>
              {TYPE_NAMES.map((type, index) => {
                const selected = types.includes(type);
                // Com dois tipos escolhidos, os outros ficam apagados até um sair.
                const disabled = !selected && isTypeLimitReached;
                return (
                  <Pressable
                    key={type}
                    accessibilityRole="button"
                    accessibilityLabel={t('filterSheet.type', { type: typeName(type, language) })}
                    accessibilityState={{ selected, disabled }}
                    disabled={disabled}
                    hitSlop={4}
                    style={disabled && styles.disabled}
                    onPress={() => toggleType(type)}>
                    <TypeBadge type={type} selected={selected} tilt={index % 2 === 0 ? -3 : 3} />
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.section, { color: theme.text }]}>
              {t('filterSheet.generation').toUpperCase()}
            </Text>
            <View style={styles.options}>
              {GENERATIONS.map(({ number, region }, index) => {
                const selected = generation === number;
                return (
                  <Pressable
                    key={number}
                    accessibilityRole="button"
                    accessibilityLabel={t('filterSheet.generationOption', { number, region })}
                    accessibilityState={{ selected }}
                    hitSlop={4}
                    onPress={() => toggleGeneration(number)}>
                    <Sticker
                      label={`${selected ? '✓ ' : ''}${number} · ${region}`}
                      color={selected ? theme.yellow : theme.white}
                      tilt={index % 2 === 0 ? -3 : 3}
                    />
                  </Pressable>
                );
              })}
            </View>

            <BrutalButton label={t('filterSheet.done')} onPress={onDismiss} />
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
  section: { fontFamily: Brutal.font.body, fontSize: 11, letterSpacing: 1 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  disabled: { opacity: 0.35 },
});
