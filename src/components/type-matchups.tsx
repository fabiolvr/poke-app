import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { TypeBadge } from '@/components/type-badge';
import { Brutal, useBrutalTheme } from '@/constants/brutal';
import { typeName } from '@/features/pokemon/translations';
import { typeMatchups, type Multiplier } from '@/features/pokemon/type-chart';
import { useLanguage } from '@/hooks/use-language';

const MULTIPLIER_LABELS: Record<Multiplier, string> = {
  4: '4×',
  2: '2×',
  0.5: '½×',
  0.25: '¼×',
  0: '0×',
};

type Props = {
  types: string[];
};

// Fraquezas, resistências e imunidades do Pokémon, somando os seus dois tipos.
export function TypeMatchups({ types }: Props) {
  const theme = useBrutalTheme();
  const { t } = useTranslation();
  const language = useLanguage();

  const groupLabel = (multiplier: Multiplier) => {
    const value = MULTIPLIER_LABELS[multiplier];
    if (multiplier === 0) {
      return t('matchups.immunity', { multiplier: value });
    }
    return multiplier > 1
      ? t('matchups.weakness', { multiplier: value })
      : t('matchups.resistance', { multiplier: value });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>{t('matchups.title')}</Text>
      <BrutalBox style={styles.box}>
        {typeMatchups(types).map(({ multiplier, types: attacking }) => {
          const label = groupLabel(multiplier);
          const names = attacking.map((type) => typeName(type, language)).join(', ');
          return (
            <View
              key={multiplier}
              style={styles.group}
              accessible
              accessibilityLabel={`${label}: ${names}`}>
              <Text style={[styles.label, { color: theme.text }]}>{label.toUpperCase()}</Text>
              <View style={styles.badges}>
                {attacking.map((type, index) => (
                  <TypeBadge key={type} type={type} tilt={index % 2 === 0 ? -3 : 3} />
                ))}
              </View>
            </View>
          );
        })}
        <Text style={[styles.hint, { color: theme.muted }]}>{t('matchups.hint')}</Text>
      </BrutalBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  title: { fontFamily: Brutal.font.display, fontSize: 18, marginTop: 8 },
  box: { padding: 14, gap: 14 },
  group: { gap: 8 },
  label: { fontFamily: Brutal.font.body, fontSize: 11, letterSpacing: 1 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  hint: { fontFamily: Brutal.font.body, fontSize: 14, lineHeight: 20 },
});
