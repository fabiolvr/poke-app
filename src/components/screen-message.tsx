import { StyleSheet, Text, View } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { BrutalButton } from '@/components/brutal-button';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Tone = 'loading' | 'error' | 'empty';

type Props = {
  text: string;
  tone?: Tone;
  actionLabel?: string;
  onAction?: () => void;
};

// Estado de carregando, erro ou vazio, centralizado na tela.
export function ScreenMessage({ text, tone = 'loading', actionLabel, onAction }: Props) {
  const theme = useBrutalTheme();
  const boxColor = { loading: theme.yellow, error: theme.red, empty: theme.pink }[tone];
  const buttonColor = tone === 'loading' ? theme.pink : theme.yellow;

  return (
    <View style={[styles.container, { backgroundColor: theme.paper }]}>
      <BrutalBox color={boxColor} style={styles.box}>
        <Text style={[styles.text, { color: theme.textOnColor }]}>{text}</Text>
        {actionLabel && onAction ? (
          <BrutalButton label={actionLabel} onPress={onAction} color={buttonColor} />
        ) : null}
      </BrutalBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  box: { padding: 20, gap: 16 },
  text: { fontFamily: Brutal.font.bold, fontSize: 18, lineHeight: 24 },
});
