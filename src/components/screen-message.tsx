import { Button, Column, Host, Text } from '@expo/ui';
import { StyleSheet, View } from 'react-native';

type Props = {
  text: string;
  actionLabel?: string;
  onAction?: () => void;
};

// Estado de carregando, erro ou vazio, centralizado na tela.
export function ScreenMessage({ text, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Host matchContents>
        <Column alignment="center" spacing={12}>
          <Text textStyle={{ textAlign: 'center' }}>{text}</Text>
          {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}
        </Column>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
