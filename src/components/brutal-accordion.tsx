import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrutalBox } from '@/components/brutal-box';
import { Brutal, useBrutalTheme } from '@/constants/brutal';

type Props = {
  title: string;
  children: ReactNode;
};

export function BrutalAccordion({ title, children }: Props) {
  const theme = useBrutalTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BrutalBox>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((open) => !open)}
        style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{title.toUpperCase()}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{isOpen ? '−' : '+'}</Text>
      </Pressable>
      {isOpen ? (
        <View style={[styles.content, { borderTopColor: theme.line }]}>{children}</View>
      ) : null}
    </BrutalBox>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  title: { fontFamily: Brutal.font.display, fontSize: 16 },
  content: { borderTopWidth: Brutal.border, padding: 14, gap: 8 },
});
