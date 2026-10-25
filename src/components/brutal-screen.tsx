import { StyleSheet, View, type ViewProps } from 'react-native';

import { Brutal, useBrutalTheme } from '@/constants/brutal';

// Fundo de papel com a linha grossa logo abaixo do cabeçalho.
export function BrutalScreen({ style, ...rest }: ViewProps) {
  const theme = useBrutalTheme();

  return (
    <View
      style={[styles.screen, { backgroundColor: theme.paper, borderTopColor: theme.line }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, borderTopWidth: Brutal.border },
});
