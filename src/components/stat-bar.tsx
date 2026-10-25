import { StyleSheet, Text, View } from 'react-native';

import { Brutal, useBrutalTheme } from '@/constants/brutal';

// O maior status base que existe nos jogos.
const MAX_BASE_STAT = 255;

type Props = {
  label: string;
  value: number;
  color: string;
};

export function StatBar({ label, value, color }: Props) {
  const theme = useBrutalTheme();
  const percent = Math.min(value / MAX_BASE_STAT, 1) * 100;

  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <View style={[styles.track, { borderColor: theme.line, backgroundColor: theme.paper }]}>
        <View
          style={[
            styles.fill,
            { width: `${percent}%`, backgroundColor: color, borderColor: theme.line },
          ]}
        />
      </View>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { width: 96, fontFamily: Brutal.font.bold, fontSize: 14 },
  track: { flex: 1, height: 16, borderWidth: 2, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRightWidth: 2 },
  value: { width: 32, textAlign: 'right', fontFamily: Brutal.font.bold, fontSize: 14 },
});
