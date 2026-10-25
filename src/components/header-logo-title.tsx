import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Brutal, useBrutalTheme } from '@/constants/brutal';

const LOGO = require('@/assets/images/pokeball.png');

type Props = {
  title: string;
};

// Título do cabeçalho com a Poké Bola do ícone ao lado. A imagem é decorativa: o leitor de tela lê só o texto.
export function HeaderLogoTitle({ title }: Props) {
  const theme = useBrutalTheme();

  return (
    <View style={styles.row}>
      <Image source={LOGO} style={styles.logo} accessible={false} />
      <Text
        style={[styles.title, { color: theme.textOnColor }]}
        accessibilityRole="header"
        numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 28, height: 28 },
  title: { fontFamily: Brutal.font.display, fontSize: 18 },
});
