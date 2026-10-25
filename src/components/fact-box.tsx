import { StyleSheet, Text } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Props = {
  label: string;
  value: string;
};

export function FactBox({ label, value }: Props) {
  const theme = useBrutalTheme();

  return (
    <BrutalBox style={styles.box} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.label, { color: theme.text }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 10, gap: 2 },
  label: { fontFamily: Brutal.font.body, fontSize: 11, letterSpacing: 1 },
  value: { fontFamily: Brutal.font.display, fontSize: 16 },
});
