import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { BrutalTabButton, BrutalTabList } from '@/components/brutal-tabs';

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <BrutalTabList>
          <TabTrigger name="(pokedex)" href="/" asChild>
            <BrutalTabButton
              label="Pokédex"
              icon={{ ios: 'square.grid.2x2.fill', android: 'grid_view', web: 'grid_view' }}
            />
          </TabTrigger>
          <TabTrigger name="favorites" href="/favorites" asChild>
            <BrutalTabButton
              label="Favoritos"
              icon={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
            />
          </TabTrigger>
        </BrutalTabList>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1 },
});
