import { StyleSheet, Text, View } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { BrutalButton } from '@/components/brutal-button';
import { BrutalScreen } from '@/components/brutal-screen';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Tone = 'loading' | 'error' | 'empty';

type Props = {
  text: string;
  tone?: Tone;
  actionLabel?: string;
  onAction?: () => void;
  // Dentro de uma tela que já tem a linha do cabeçalho (ex.: abaixo da busca).
  inline?: boolean;
};

// Estado de carregando, erro ou vazio, centralizado na tela.
export function ScreenMessage({
  text,
  tone = 'loading',
  actionLabel,
  onAction,
  inline = false,
}: Props) {
  const theme = useBrutalTheme();
  const boxColor = { loading: theme.yellow, error: theme.red, empty: theme.pink }[tone];
  const buttonColor = tone === 'loading' ? theme.pink : theme.yellow;
  const Container = inline ? View : BrutalScreen;

  return (
    <Container style={[styles.container, { backgroundColor: theme.paper }]}>
      <BrutalBox color={boxColor} style={styles.box}>
        <Text style={[styles.text, { color: theme.textOnColor }]}>{text}</Text>
        {actionLabel && onAction ? (
          <BrutalButton label={actionLabel} onPress={onAction} color={buttonColor} />
        ) : null}
      </BrutalBox>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  box: { padding: 20, gap: 16 },
  text: { fontFamily: Brutal.font.bold, fontSize: 18, lineHeight: 24 },
});
