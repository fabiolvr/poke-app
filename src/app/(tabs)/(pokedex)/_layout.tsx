import { Stack } from 'expo-router';

export default function PokedexLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Pokédex', headerLargeTitle: true }} />
    </Stack>
  );
}
