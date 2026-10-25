import { StyleSheet, View, type ViewProps } from 'react-native';

import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Props = ViewProps & {
  color?: string;
  pressed?: boolean;
};

// Caixa com borda grossa e sombra dura. Pressionada, ela "afunda" até onde estava a sombra.
export function BrutalBox({ color, pressed = false, style, ...rest }: Props) {
  const theme = useBrutalTheme();
  const shadow = pressed ? 0 : Brutal.shadow;
  const shift = pressed ? Brutal.shadow : 0;

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: color ?? theme.surface,
          borderColor: theme.line,
          // Sempre string e array: trocar para undefined chega como null no nativo e quebra o transform.
          boxShadow: `${shadow}px ${shadow}px 0px ${theme.line}`,
          transform: [{ translateX: shift }, { translateY: shift }],
        },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: Brutal.border,
    borderRadius: Brutal.radius,
  },
});
